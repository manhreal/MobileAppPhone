/**
 * Web mock of expo-sqlite using localStorage.
 * Metro bundler automatically picks this over db.ts when building for web.
 */

type Row = Record<string, any>;

const load = (table: string): Row[] => {
  try {
    return JSON.parse(localStorage.getItem(`db_${table}`) ?? '[]');
  } catch {
    return [];
  }
};

const save = (table: string, rows: Row[]): void => {
  localStorage.setItem(`db_${table}`, JSON.stringify(rows));
};

// ---------- SQL parser helpers ----------

const parseTable = (sql: string): string => {
  const m =
    sql.match(/FROM\s+(\w+)/i) ??
    sql.match(/INTO\s+(\w+)/i) ??
    sql.match(/UPDATE\s+(\w+)/i);
  return m?.[1] ?? '';
};

const parseWhere = (
  sql: string,
  params: any[]
): ((row: Row) => boolean) => {
  const m = sql.match(/WHERE\s+(.+?)(?:ORDER|LIMIT|$)/is);
  if (!m) return () => true;

  const cond = m[1].trim();
  // support: col = ? AND col2 = ? (simple cases)
  const parts = cond.split(/\s+AND\s+/i);
  let pi = 0;
  const checks: Array<(r: Row) => boolean> = parts.map((part) => {
    const eq = part.match(/(\w+)\s*=\s*\?/);
    if (eq) {
      const col = eq[1];
      const val = params[pi++];
      return (r: Row) => String(r[col]) === String(val);
    }
    return () => true;
  });
  return (row: Row) => checks.every((fn) => fn(row));
};

// ---------- Mock DB ----------

const MockDb = {
  execSync(_sql: string): void {
    // DDL no-op for web — tables are implicit via localStorage keys
  },

  getFirstSync<T = Row>(sql: string, params: any[] = []): T | null {
    const table = parseTable(sql);
    const rows = load(table);

    if (/COUNT\(\*\)/i.test(sql)) {
      return { count: rows.length } as unknown as T;
    }

    const filter = parseWhere(sql, params);
    const found = rows.find(filter);
    return (found as unknown as T) ?? null;
  },

  getAllSync<T = Row>(sql: string, params: any[] = []): T[] {
    const table = parseTable(sql);
    const rows = load(table);
    const filter = parseWhere(sql, params);
    const result = rows.filter(filter);

    if (/ORDER BY created_at DESC/i.test(sql)) {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return result as unknown as T[];
  },

  runSync(
    sql: string,
    params: any[]
  ): { lastInsertRowId: number; changes: number } {
    const table = parseTable(sql);
    const rows = load(table);

    // INSERT
    if (/^\s*INSERT/i.test(sql)) {
      // Parse column names from sql
      const colMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
      const cols = colMatch
        ? colMatch[1].split(',').map((c) => c.trim())
        : [];

      // Check for OR IGNORE (skip if id already exists)
      if (/INSERT OR IGNORE/i.test(sql)) {
        const idIdx = cols.indexOf('id');
        if (idIdx >= 0) {
          const idVal = params[idIdx];
          if (rows.some((r) => String(r.id) === String(idVal))) {
            const lastId = rows.length > 0 ? rows[rows.length - 1].id : 0;
            return { lastInsertRowId: lastId, changes: 0 };
          }
        }
      }

      const newRow: Row = {};
      cols.forEach((col, i) => {
        newRow[col] = params[i];
      });

      // Auto-increment id if not provided
      if (!newRow.id) {
        const maxId = rows.reduce(
          (m, r) => Math.max(m, Number(r.id ?? 0)),
          0
        );
        newRow.id = maxId + 1;
      }
      if (!newRow.created_at) {
        newRow.created_at = new Date().toISOString();
      }

      rows.push(newRow);
      save(table, rows);
      return { lastInsertRowId: Number(newRow.id), changes: 1 };
    }

    // UPDATE
    if (/^\s*UPDATE/i.test(sql)) {
      const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
      const setCols = setMatch
        ? setMatch[1].split(',').map((s) => s.trim())
        : [];

      // Build set map
      const setMap: Row = {};
      const setParams = params.slice(0, setCols.length);
      setCols.forEach((expr, i) => {
        const col = expr.split('=')[0].trim();
        setMap[col] = setParams[i];
      });

      const whereParams = params.slice(setCols.length);
      const filter = parseWhere(sql, whereParams);
      let changes = 0;

      const updated = rows.map((r) => {
        if (filter(r)) {
          changes++;
          return { ...r, ...setMap };
        }
        return r;
      });

      save(table, updated);
      return { lastInsertRowId: 0, changes };
    }

    return { lastInsertRowId: 0, changes: 0 };
  },
};

export type MockDatabase = typeof MockDb;

let _db: MockDatabase | null = null;

export const getDb = (): MockDatabase => {
  if (!_db) _db = MockDb;
  return _db;
};
