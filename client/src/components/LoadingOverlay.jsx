import { useEffect, useState } from "react";
import { LifeLine } from "react-loading-indicators";

const LoadingOverlay = ({ delay = 4000, isLoading }) => {
  const [showOverlay, setShowOverlay] = useState(isLoading);

  useEffect(() => {
    // If loading is set to true, start the timeout for delay
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowOverlay(false); // Hide overlay after delay
      }, delay);

      return () => clearTimeout(timer); // Cleanup timeout on component unmount
    } else {
      setShowOverlay(false); // If loading finishes early, immediately hide overlay
    }
  }, [isLoading, delay]);

  return (
    showOverlay && (
      <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <LifeLine color="#00c3a5" size="large" text="Loading..." textColor="" />
        </div>
      </div>
    )
  );
};

export default LoadingOverlay;
