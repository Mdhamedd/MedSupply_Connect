// ملف جديد للتحقق من حالة الاتصال بالإنترنت

export const checkOnlineStatus = () => {
  return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
};

export const setupNetworkListeners = (onlineCallback, offlineCallback) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', onlineCallback);
    window.addEventListener('offline', offlineCallback);
    return () => {
      window.removeEventListener('online', onlineCallback);
      window.removeEventListener('offline', offlineCallback);
    };
  }
  return () => {};
};