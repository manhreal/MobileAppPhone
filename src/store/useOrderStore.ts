import { create } from 'zustand';
import { Order } from '../types';
import { getOrdersByUser } from '../services/orderService';

interface OrderState {
  orders: Order[];
  loadOrders: (userId: number) => void;
  addOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loadOrders: (userId) => {
    const orders = getOrdersByUser(userId);
    set({ orders });
  },
  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),
}));
