import { create } from 'zustand';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

export const useNotificationStore = create((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
  },

  addNotification: (notif) => {
    set(state => ({
      notifications: [
        {
          id: `NOTIF-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          read: false,
          ...notif
        },
        ...state.notifications
      ]
    }));
  }
}));
