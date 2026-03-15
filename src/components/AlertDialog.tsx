import React from 'react';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { useAlertStore } from '../store/useAlertStore';
import { Colors } from '../constants/colors';

export const AlertDialog: React.FC = () => {
  const { visible, title, message, buttons, hide } = useAlertStore();

  const handlePress = (onPress?: () => void) => {
    hide();
    onPress?.();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hide}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          {buttons.map((btn, i) => (
            <Button
              key={i}
              onPress={() => handlePress(btn.onPress)}
              textColor={
                btn.style === 'destructive'
                  ? '#D32F2F'
                  : btn.style === 'cancel'
                  ? '#666'
                  : Colors.primary
              }
            >
              {btn.text}
            </Button>
          ))}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
