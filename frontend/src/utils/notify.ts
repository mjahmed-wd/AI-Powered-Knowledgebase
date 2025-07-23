import { toast, ToastOptions, Id } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

interface NotificationWrapper {
  success: (message: string, options?: ToastOptions) => Id;
  error: (message: string, options?: ToastOptions) => Id;
  info: (message: string, options?: ToastOptions) => Id;
  warning: (message: string, options?: ToastOptions) => Id;
  loading: (message: string, options?: ToastOptions) => Id;
  dismiss: (toastId?: Id) => void;
  dismissAll: () => void;
  update: (toastId: Id, options: ToastOptions & { render?: string }) => void;
}

export const notify: NotificationWrapper = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, { ...defaultOptions, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options });
  },

  dismiss: (toastId?: Id) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
  },

  update: (toastId: Id, options: ToastOptions & { render?: string }) => {
    toast.update(toastId, options);
  },
};

export default notify;
