import React, { useState, useEffect } from 'react';
import { Preloader } from '../Preloader/Preloader';

let packageJson;
if (process.env.NODE_ENV === 'production') {
  packageJson = await import('../../../package-build.json');
}

const buildDateGreaterThan = (latestDate, currentDate) => latestDate > currentDate;

function withClearCache(Component) {
  function ClearCacheComponent(props) {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState(false);

    useEffect(() => {
      const buildVersionDate = packageJson?.buildDateTime || 0;
      const storageVersionDate = localStorage.getItem('buildDateTime');

      if (storageVersionDate) {
        const shouldForceRefresh = buildDateGreaterThan(Number(buildVersionDate), Number(storageVersionDate));

        if (shouldForceRefresh) {
          setIsLatestBuildDate(false);
          refreshCacheAndReload(buildVersionDate);
        } else {
          setIsLatestBuildDate(true);
        }
      } else {
        localStorage.setItem('buildDateTime', buildVersionDate);
        setIsLatestBuildDate(true);
      }
    }, []);

    const refreshCacheAndReload = (currentVersionDate) => {
      const _caches = window?.caches;

      if (_caches) {
        _caches
          .keys()
          .then((names) => {
            for (const name of names) {
              _caches.delete(name);
            }
          })
          .then(() => {
            localStorage.setItem('buildDateTime', currentVersionDate);
          });
      }
      // delete browser cache and hard reload
      window.location.reload(true);
    };

    return <React.Fragment>{isLatestBuildDate ? <Component {...props} shouldRerender={true} /> : <Preloader />}</React.Fragment>;
  }

  return ClearCacheComponent;
}

export default withClearCache;
