import { useEffect, useState } from 'react';

export const usePreloadImages = (imageUrls = []) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;

    const preload = (url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          setLoaded(true);
          // loadedCount && console.info(`✅ All ${loadedCount} images from preloadedImagesList have been loaded`);
        }
      };
      img.onerror = () => {
        console.error(`❌ Error loading image: ${url}`);
      };
    };

    imageUrls.forEach(preload);
  }, [imageUrls]);

  return loaded;
};
