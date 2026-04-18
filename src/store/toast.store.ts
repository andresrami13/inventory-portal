import { create } from 'zustand'

type ToastType = 'success' | 'error'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastState {
  toasts: Toast[]
  show: (message: string, type?: ToastType) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, type = 'success') => {
    const id = crypto.randomUUID()
    set({ toasts: [...get().toasts, { id, message, type }] })
    setTimeout(() => get().remove(id), 3000)
  },
  remove: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export const toast = {
  success: (msg: string) => useToastStore.getState().show(msg, 'success'),
  error: (msg: string) => useToastStore.getState().show(msg, 'error'),
}
