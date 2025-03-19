import { useEffect } from 'react';

export const useFullscreen = () => {
  useEffect(() => {
    // const HTMLElement = document.documentElement;

    // orientaion handler
    const handleOrientationChange = () => {
      setTimeout(enterFullscreen, 100);
    };
    const enterFullscreen = () => {
      // Hide address bar
      window.scrollTo(0, 1);

      // Toggle fullscreen (not working as expected)
      // if (HTMLElement.requestFullscreen) {
      //   HTMLElement.requestFullscreen();
      // } else if (HTMLElement.webkitRequestFullscreen) {
      //   HTMLElement.webkitRequestFullscreen();
      // }
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
};
