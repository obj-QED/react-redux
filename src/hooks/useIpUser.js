import { useEffect, useState } from 'preact/hooks';
import { baseApiGet } from '../api/baseApi';

export const useIpUser = () => {
  const [ipInfo, setIpInfo] = useState(null);

  useEffect(() => {
    baseApiGet({ api: 'https://ipapi.co/json/' })
      .then((response) => {
        setIpInfo(response);
        if (!response) setIpInfo({ country: 'US' });
      })
      .catch((data, status) => {
        setIpInfo(data);
      });
  }, []);
  return { ipInfo };
};
