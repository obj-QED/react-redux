import { useEffect, useState } from 'preact/hooks';

export const useBrowserAndOSDetection = () => {
  const [browser, setBrowser] = useState('');
  const [operatingSystem, setOperatingSystem] = useState('');

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check for browser
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

    // Check for operating system
    if (userAgent.indexOf('win') !== -1) {
      setOperatingSystem('windows');
    } else if (userAgent.indexOf('android') !== -1) {
      setOperatingSystem('android');
    } else if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('ipod') !== -1) {
      setOperatingSystem('ios');
    } else if (userAgent.indexOf('mac') !== -1) {
      setOperatingSystem('ios');
    } else if (userAgent.indexOf('linux') !== -1) {
      setOperatingSystem('Linux');
    } else {
      setOperatingSystem('Unknown');
    }
  }, []);

  return { browser, operatingSystem };
};
