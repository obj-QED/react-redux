const imageFailedSet = new Set();

export const removeImageOnError = (e) => {
  if (!e?.target) return;
  const img = e.target;

  const imageUrl = new URL(img.src);
  imageFailedSet.add(imageUrl.pathname);

  img.onerror = null;
  img.remove();
};

export const hideImageOnError = (e, className = 'broken-image') => {
  if (!e?.target) return;
  const img = e.target;

  const imageUrl = new URL(img.src);
  imageFailedSet.add(imageUrl.pathname);

  img.onerror = null;
  img.classList.add(className);
};

export const isImageFailed = (url) => imageFailedSet.has(url);
