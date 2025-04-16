import { useState, useCallback } from 'react';

export const useCopyClipboard = (timeout = 2000) => {
  const [copyFieldMessage, setCopyFieldMessage] = useState({});

  const copyToClipboard = useCallback(
    (id) => {
      const inputElement = document.getElementById(id);

      if (inputElement) {
        const textToCopy = inputElement.value?.trim() || inputElement.innerText?.trim();
        setTimeout(() => {
          setCopyFieldMessage((prevMessages) => ({
            ...prevMessages,
            [id]: '',
          }));
        }, timeout);

        if (textToCopy === '') {
          setCopyFieldMessage((prevMessages) => ({
            ...prevMessages,
            [id]: 'field_is_empty',
          }));
          return;
        }

        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setCopyFieldMessage((prevMessages) => ({
              ...prevMessages,
              [id]: 'copied',
            }));
          })
          .catch((error) => {
            setCopyFieldMessage((prevMessages) => ({
              ...prevMessages,
              [id]: 'error_copied',
            }));
          });
      }
    },
    [timeout],
  );

  const copyToClipboardWithShareApi = useCallback(() => {
    return async (id, message) => {
      copyToClipboard(id);
      if (navigator.share) {
        try {
          const urlToShare = document.getElementById(id)?.value?.trim();
          await navigator.share({
            title: document.title,
            // text: message,
            url: urlToShare,
          });
          console.log('Success');
        } catch (error) {
          console.log('Error:', error);
        }
      } else {
        console.log('Error: Your browser does not support Web Share API');
      }
    };
  }, [copyToClipboard]);

  return [copyFieldMessage, copyToClipboard, copyToClipboardWithShareApi];
};
