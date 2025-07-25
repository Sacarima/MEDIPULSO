import { useEffect, useState } from "react";
import { LifeLine } from "react-loading-indicators";

const LoadingOverlay = ({ delay = 4000, isLoading }) => {
  const [showOverlay, setShowOverlay] = useState(isLoading)
  const [fadeOut, setFadeOut] = useState(false)

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
      <div  className={`fixed inset-0 bg-[#f8f8f8] bg-opacity-90 z-50 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}>
        <div className="w-full h-full flex items-center justify-center">
          <LifeLine color="#00c3a5" size="large" text="Loading..." textColor="" />
        </div>
      </div>
    )
  );
};

export default LoadingOverlay;
