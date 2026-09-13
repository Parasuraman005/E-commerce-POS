import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, ArrowLeft, WifiOff, RefreshCw, CheckCircle2, Ghost } from "lucide-react";

interface NotFoundViewProps {
  onGoHome: () => void;
  onGoBack: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onGoHome, onGoBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#F2EFE7]"
    >
      {/* Visual Element */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8 relative"
      >
        <div className="text-[12rem] font-bold font-outfit text-[#3368A0] opacity-10 leading-none select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-[#C8DFDB] rounded-full flex items-center justify-center shadow-lg">
            <Ghost className="w-16 h-16 text-[#3368A0]" />
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <h1 className="text-4xl font-bold font-outfit text-[#1F2933] mb-4">Oops! Page Not Found</h1>
      <p className="text-lg font-inter text-[#5B6570] max-w-md mb-10 leading-relaxed">
        The page you are looking for may have been moved, deleted, or does not exist.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 px-8 py-4 bg-[#3368A0] text-white rounded-2xl font-inter font-semibold shadow-xl shadow-[#3368A0]/20 hover:bg-[#3368A0]/90 transition-all hover:scale-105 active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span>Go to Homepage</span>
        </button>
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#3368A0] text-[#3368A0] rounded-2xl font-inter font-semibold hover:bg-[#3368A0]/5 transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>
      </div>
    </motion.div>
  );
};

interface OfflineViewProps {
  onReturnHome: () => void;
  isReconnecting?: boolean;
}

export const OfflineView: React.FC<OfflineViewProps> = ({ onReturnHome, isReconnecting }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setShowSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    };
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTryAgain = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#F2EFE7] flex flex-col items-center justify-center text-center p-6"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-[#3368A0]" />
          </motion.div>
          <h2 className="text-3xl font-bold font-outfit text-[#1F2933]">✓ You're Back Online!</h2>
          <p className="text-[#5B6570] font-inter mt-2">Reconnecting you to the marketplace...</p>
        </motion.div>
      ) : (
        <motion.div
          key="offline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#F2EFE7] flex flex-col items-center justify-center text-center p-6"
        >
          {/* Illustration */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl mb-8 border-2 border-[#C8DFDB]"
          >
            <WifiOff className="w-16 h-16 text-[#66A3BF]" />
          </motion.div>

          {/* Content */}
          <h1 className="text-4xl font-bold font-outfit text-[#1F2933] mb-4">You're Offline</h1>
          <p className="text-lg font-inter text-[#5B6570] max-w-md mb-8 leading-relaxed">
            It looks like you're not connected to the internet. Please check your connection and try again.
          </p>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C8DFDB] rounded-full mb-10">
            <span className="w-2 h-2 bg-[#5B6570]/40 rounded-full" />
            <span className="text-xs font-inter font-semibold text-[#5B6570] uppercase tracking-wider">
              ● No Internet Connection
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleTryAgain}
              disabled={isReconnecting}
              className="flex items-center gap-3 px-10 py-4 bg-[#3368A0] text-white rounded-2xl font-inter font-bold shadow-xl shadow-[#3368A0]/20 hover:bg-[#3368A0]/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isReconnecting ? 'animate-spin' : ''}`} />
              <span>Try Again</span>
            </button>
            <button
              onClick={onReturnHome}
              className="text-[#3368A0] font-inter font-semibold underline underline-offset-4 hover:text-[#3368A0]/80 transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
