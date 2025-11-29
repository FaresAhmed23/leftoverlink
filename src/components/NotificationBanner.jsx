import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

function NotificationBanner({
  type = "info",
  message,
  onClose,
  autoClose = 5000,
}) {
  const [isVisible, setIsVisible] = useState(false); // Start false for animation
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Trigger entry animation
    requestAnimationFrame(() => setIsVisible(true));

    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleClose = () => {
    setIsVisible(false); // Trigger exit animation
    setTimeout(() => {
      setShouldRender(false);
      if (onClose) onClose();
    }, 300); // Wait for transition duration
  };

  if (!shouldRender) return null;

  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: <InformationCircleIcon className="w-5 h-5 text-blue-500" />,
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className={`fixed top-4 right-4 z-[100] max-w-sm w-full transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`flex items-start p-4 rounded-xl border shadow-lg ${currentStyle.bg} ${currentStyle.border}`}
      >
        <div className="flex-shrink-0 mt-0.5">{currentStyle.icon}</div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className={`text-sm font-medium ${currentStyle.text}`}>
            {message}
          </p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            type="button"
            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-black/5 transition-colors ${currentStyle.text}`}
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationBanner;
