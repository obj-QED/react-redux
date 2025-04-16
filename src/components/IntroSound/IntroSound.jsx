import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const IntroSound = ({ intro = '/uploads/sounds/intro.mp3' }) => {
  const audioRef = useRef(null);
  const INTRO_MIC = useSelector((state) => state.music.intro);

  const introSoundSetting = localStorage.getItem('intro_sound');
  const token = localStorage.getItem('user-token');

  useEffect(() => {
    if (!localStorage.getItem('intro_sound') && token) {
      localStorage.setItem('intro_sound', true);
    }
  }, [token]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(intro); // Создаём новый объект Audio
    } else {
      audioRef.current.src = intro; // Меняем источник, если он изменился
    }

    const handleError = () => {
      console.warn(`Audio file not found or unsupported: ${intro}`);
      localStorage.setItem('intro_sound', 'false');
      localStorage.setItem('intro_sound_file', 'not_found');
    };

    const handleLoadedData = () => {
      console.log(`Audio file loaded successfully: ${intro}`);
      localStorage.setItem('intro_sound_file', 'looaded');
    };

    audioRef.current.addEventListener('error', handleError);
    audioRef.current.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audioRef.current?.removeEventListener('error', handleError);
      audioRef.current?.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [intro]);

  useEffect(() => {
    if (introSoundSetting) {
      audioRef.current.loop = true;

      if (introSoundSetting === 'false') {
        audioRef.current?.pause();
      } else if (introSoundSetting === 'true') {
        audioRef.current?.play().catch((error) => {
          console.warn('Error playing audio:', error);
          localStorage.setItem('intro_sound', 'false');
        });
      }
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [introSoundSetting, INTRO_MIC]);

  return null;
};

export default IntroSound;
