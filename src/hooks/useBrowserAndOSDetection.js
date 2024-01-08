// Импортируем хуки из Preact
import { useEffect, useState } from 'preact/hooks';

// Определяем пользовательский хук useBrowserAndOSDetection
export const useBrowserAndOSDetection = () => {
  // Инициализируем состояния для определения браузера и операционной системы
  const [browser, setBrowser] = useState('');
  const [operatingSystem, setOperatingSystem] = useState('');

  // Используем эффект для выполнения кода при монтировании компонента
  useEffect(() => {
    // Получаем строку User-Agent из объекта navigator
    const userAgent = navigator.userAgent.toLowerCase();

    // Проверяем браузер
    if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
      setBrowser('Internet Explorer');
    } else if (userAgent.indexOf('edge') !== -1) {
      setBrowser('Microsoft Edge');
    } else if (userAgent.indexOf('chrome') !== -1) {
      setBrowser('Google Chrome');
    } else if (userAgent.indexOf('firefox') !== -1) {
      setBrowser('Mozilla Firefox');
    } else if (userAgent.indexOf('safari') !== -1) {
      setBrowser('Apple Safari');
    } else if (userAgent.indexOf('opera') !== -1 || userAgent.indexOf('opr') !== -1) {
      setBrowser('Opera');
    } else {
      setBrowser('Unknown');
    }

    // Проверяем операционную систему
    if (userAgent.indexOf('win') !== -1) {
      setOperatingSystem('Windows');
    } else if (userAgent.indexOf('android') !== -1) {
      setOperatingSystem('Android');
    } else if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('ipod') !== -1) {
      setOperatingSystem('iOS');
    } else if (userAgent.indexOf('mac') !== -1) {
      setOperatingSystem('macOS');
    } else if (userAgent.indexOf('linux') !== -1) {
      setOperatingSystem('Linux');
    } else {
      setOperatingSystem('Unknown');
    }
  }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится только при монтировании компонента

  // Возвращаем объект с определенными браузером и операционной системой
  return { browser, operatingSystem };
};
