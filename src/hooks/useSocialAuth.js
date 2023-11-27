import { useCallback } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveForm, signInRequest, signUpRequest } from '../store/actions';

export const useSocialAuth = (provider, setPreloader) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const domain = window.location.hostname;

  const handleResolve = useCallback(
    async ({ data }, isSignIn) => {
      if (data.accessToken || data.access_token) {
        if (setPreloader) setPreloader(true);

        const socialData = {
          provider,
          token: data.accessToken || data.access_token,
        };

        try {
          const res = isSignIn ? await dispatch(signInRequest({ social: socialData, domain })) : await dispatch(signUpRequest({ social: socialData, domain }));

          if (res.content.token) {
            navigate('/');
          }

          if (!res.error) {
            dispatch(setActiveForm('success'));
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } finally {
          if (setPreloader) setPreloader(false);
        }
      }
    },
    [dispatch, domain, navigate, provider, setPreloader],
  );

  const handleReject = useCallback((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, []);

  return { handleResolve, handleReject };
};
