import {AlertCircle, AlertTriangle, CheckCircle, Info} from 'lucide-react';
import {toast} from 'sonner';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export const showToast = (type: ToastType, title: string, message?: string) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          ),
          container:
            'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
        };
      case 'error':
        return {
          icon: (
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          ),
          container:
            'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
        };
      case 'warning':
        return {
          icon: (
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          ),
          container:
            'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-6 w-6 text-[#0a66c2]" />,
          container:
            'bg-[#0a66c2]/10 border-[#0a66c2]/20 text-[#0a66c2] dark:bg-[#0a66c2]/20 dark:text-white',
        };
    }
  };

  const {icon, container} = getStyles();

  toast.custom(id => (
    <div
      className={`
        animate-in fade-in slide-in-from-top-2
        ${container}
        border rounded-2xl shadow-lg p-4 flex items-start space-x-3 max-w-sm w-full
      `}>
      {icon}
      <div className="flex-1">
        <p className="font-semibold text-sm sm:text-base">{title}</p>
        {message && (
          <p className="text-base sm:text-sm opacity-90 mt-1">{message}</p>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(id)}
        className="text-xs font-medium text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white">
        ✕
      </button>
    </div>
  ));
};
