import { useEffect } from "react";

/**
 * Custom hook to detect clicks outside of a specified element
 * @param {React.RefObject} ref - The reference to the element
 * @param {Function} handler - The function to execute when clicking outside
 */
const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler();
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
};

export default useClickOutside;
