import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const showToast = useCallback((message, type = 'success') => {
    const options = {
      duration: 4000,
      position: 'top-right',
      style: {
        padding: '16px',
        borderRadius: '8px',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
      },
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      default:
        toast(message, options);
    }
  }, []);

  return { showToast };
};

export default useToast; 