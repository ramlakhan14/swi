import toast from 'react-hot-toast';

// Array to keep track of active toasts
let activeToasts = [];
const MAX_TOASTS = 3;

const manageToastLimit = (toastId) => {
    // Add new toast to the array
    activeToasts.push(toastId);
    
    // If we exceed the limit, dismiss the oldest toast
    if (activeToasts.length > MAX_TOASTS) {
        const oldestToast = activeToasts.shift();
        toast.dismiss(oldestToast);
    }
};

const removeFromActiveToasts = (toastId) => {
    activeToasts = activeToasts.filter(id => id !== toastId);
};

export const showSuccessToast = (message, duration = 3000) => {
    const toastId = toast.success(message);
    manageToastLimit(toastId);
    
    // Manually dismiss after specified duration
    setTimeout(() => {
        toast.dismiss(toastId);
        removeFromActiveToasts(toastId);
    }, duration);
    
    return toastId;
};

export const showErrorToast = (message, duration = 3000) => {
    const toastId = toast.error(message);
    manageToastLimit(toastId);
    
    // Manually dismiss after specified duration
    setTimeout(() => {
        toast.dismiss(toastId);
        removeFromActiveToasts(toastId);
    }, duration);
    
    return toastId;
};

export const showInfoToast = (message, duration = 3000) => {
    const toastId = toast(message);
    manageToastLimit(toastId);
    
    // Manually dismiss after specified duration
    setTimeout(() => {
        toast.dismiss(toastId);
        removeFromActiveToasts(toastId);
    }, duration);
    
    return toastId;
};

export const showLoadingToast = (message, duration = 3000) => {
    const toastId = toast.loading(message);
    manageToastLimit(toastId);
    
    // Manually dismiss after specified duration
    setTimeout(() => {
        toast.dismiss(toastId);
        removeFromActiveToasts(toastId);
    }, duration);
    
    return toastId;
};