import { Fragment, memo, useCallback, useMemo, useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ReactInlineSvg from 'react-inlinesvg';

import { ErrorsMain } from '../../../elements';
import { Notification, AnimatedPreloader } from '../../../components';

import { setCurrentStepForm } from '../../../store/actions';
import { translateField } from '../../../shared/utils';
import { useWhatsAppRequest } from '../_events/useAuthSubmit';
import { SOCIAL_IMAGES_PATH, SOCIAL_IMAGES_FORMAT } from '../../../shared/imagePathes';

import Form from '../_path/_Form';

const SocialCustom = memo(
  forwardRef(({ key, variable = 'whatsapp', cmd }, ref) => {
    const dispatch = useDispatch();
    const handleWhatsAppLoginSubmit = useWhatsAppRequest({ cmd });

    const words = useSelector((state) => state.words);
    const form = useSelector((state) => state.authorization.form);
    const settings = useSelector((state) => state.settings);

    const emailTerms = settings?.emailTerms ?? false;
    const supportTerms = settings?.supportTerms ?? false;
    const thisForm = form[variable];
    const fields = thisForm?.fields;

    const [lastData, setLastData] = useState({});
    const [currentStep, setCurrentStep] = useState(thisForm?.steps[0]);
    const [messageForm, setMessageForm] = useState(null);

    const [showPreloader, setShowPreloader] = useState(false);
    const sendAgain = localStorage.getItem('send-again-submit');

    const preloader = useMemo(
      () => (
        <div className="form-preloader form-preloader_auth">
          <AnimatedPreloader />
        </div>
      ),
      [],
    );

    useEffect(() => {
      if (currentStep) {
        dispatch(setCurrentStepForm({ step_whatsApp: `whatsapp_login_${currentStep}` }));
      }

      return () => {
        dispatch(setCurrentStepForm({ step_whatsApp: undefined }));
      };
    }, [currentStep, dispatch]);

    useEffect(() => {
      return () => {
        dispatch({
          type: 'SIGNIN_WHATSAPP_MESSAGE',
          payload: undefined,
        });
        dispatch({
          type: 'WHATSAPP_ERROR',
          payload: undefined,
        });
      };
    }, [dispatch]);

    const handleSetMessage = useCallback(({ message, className, loader = false }) => {
      setMessageForm({ message, className, key: Date.now() });

      if (loader) {
        setShowPreloader(true);
        setTimeout(() => {
          setShowPreloader(false);
        }, 500);
      }
    }, []);

    const handleWhatsAppSuccess = useCallback(
      (responseData) => {
        const saveData = {};

        Object.entries(responseData).forEach(([key, value]) => {
          saveData[key] = value;
        });

        setLastData(saveData);

        const MESSAGE = responseData?.content?.message;
        const step_1_success = MESSAGE && responseData?.content?.length !== 0 && !responseData.error;

        if (step_1_success) {
          handleSetMessage({ message: MESSAGE, className: 'ant-notification-notice-success', loader: true });

          if (currentStep === thisForm?.steps[0]) {
            handleSetMessage({ message: MESSAGE, className: 'ant-notification-notice-success', loader: true });

            setCurrentStep(thisForm?.steps[1]);
          } else if (currentStep === thisForm?.steps[1]) {
            handleSetMessage({ message: MESSAGE, className: 'ant-notification-notice-success', loader: true });

            setCurrentStep(thisForm?.steps[2]);
          }
        }
      },
      [currentStep, thisForm?.steps, handleSetMessage],
    );

    const handleWhatsAppError = useCallback(
      (error) => {
        if (error && error === 'timer_wa') return;

        if (error && typeof error === 'object') {
          error = Object.entries(error)
            .map(([key, value]) => `${translateField(key, 'form', words, false)} ${translateField(value, 'form', words, false)}`)
            .join('<br />');
          handleSetMessage({ message: error, className: 'ant-notification-notice-error' });
        } else if (error && typeof error === 'string') {
          handleSetMessage({ message: error, className: 'ant-notification-notice-error' });
        } else if (error && typeof error === 'number') {
          const currentTime = new Date().getTime(); // Текущее время в миллисекундах
          const countdown = error; // Количество секунд для отсчета
          const endTime = currentTime + countdown * 1000; // Время окончания таймера
          localStorage.setItem('send-again-submit', endTime);
          localStorage.setItem('send-again-form-id', `social_custom_${currentStep}_${cmd}_${variable}`);
        }
      },
      [cmd, currentStep, variable, handleSetMessage, words],
    );

    const errorRender = useMemo(() => {
      return (
        <ErrorsMain
          errorMessages={['Sorry this form is disabled, please contact the administrator.']}
          styled="block"
          position="center"
          translate={false}
          className="auth-form__message"
        />
      );
    }, []);

    const socialForm = useMemo(() => {
      const field_phone = fields?.find((item) => item.id === 'phone');
      const field_code = fields?.find((item) => item.id === 'code');

      if (!fields?.length || !field_phone) {
        return;
      }

      const isSignUpFlow = cmd === 'signUp';
      const field_currency = isSignUpFlow ? { ...form.registration?.values?.find((item) => item.id === 'currency'), defaultValue: lastData?.currency } : undefined;
      const field_promocode = isSignUpFlow ? { ...form.registration?.values?.find((item) => item.id === 'promoCode'), defaultValue: lastData?.promoCode } : undefined;
      const fieldsSecondStep = [{ ...field_phone, disabled: true, defaultValue: lastData?.phone?.replace(/\D/g, '') }];

      if (field_currency && field_currency.id) {
        fieldsSecondStep.push(field_currency);
      }

      if (field_promocode && field_promocode.id) {
        fieldsSecondStep.push(field_promocode);
      }

      fieldsSecondStep.push(field_code);

      if (currentStep === thisForm?.steps[0]) {
        return (
          <Form
            formId={`social_custom_${currentStep}_${cmd}_${variable}`}
            fields={[
              { ...field_phone, disabled: !!sendAgain },
              ...(isSignUpFlow ? ['currency', 'promoCode'].map((id) => form.registration?.values?.find((item) => item.id === id)).filter(Boolean) : []),
            ]}
            event={(data) => handleWhatsAppLoginSubmit(data, lastData && lastData)}
            button={{
              type: 'submit',
              name: 'send_code',
            }}
            onSuccess={handleWhatsAppSuccess}
            messageError={false}
            onError={handleWhatsAppError}
            showCountdown
            termsChecked={isSignUpFlow ? true : false}
            otherTermsChecked={emailTerms ? true : false}
            supportTermsChecked={supportTerms ? true : false}
          />
        );
      } else if (currentStep === thisForm?.steps[1]) {
        return (
          <Form
            formId={`social_custom_${currentStep}_${cmd}_${variable}`}
            fields={fieldsSecondStep}
            event={(data) => handleWhatsAppLoginSubmit(data)}
            onSuccess={(response) => handleWhatsAppSuccess(response)}
            onError={handleWhatsAppError}
            messageError={false}
            button={{
              type: 'submit',
              name: 'confirm',
            }}
          />
        );
      }
    }, [
      supportTerms,
      emailTerms,
      fields,
      cmd,
      lastData,
      currentStep,
      thisForm?.steps,
      form.registration?.values,
      variable,
      sendAgain,
      handleWhatsAppSuccess,
      handleWhatsAppError,
      handleWhatsAppLoginSubmit,
    ]);

    if (!socialForm) return errorRender;

    return (
      <Fragment key={key}>
        <div className="social-custom-form" ref={ref}>
          {showPreloader ? (
            preloader
          ) : (
            <Fragment>
              <div className="social-custom-form_title">
                <span>{translateField(variable, 'form', words, false)}</span>
                <ReactInlineSvg className="icon" src={`${SOCIAL_IMAGES_PATH}auth_${variable?.toLowerCase()}.${SOCIAL_IMAGES_FORMAT}`} description={variable} cacheRequests />
              </div>
              <div className="social-custom-form_content">{socialForm}</div>
            </Fragment>
          )}
        </div>

        {messageForm && form?.message && (
          <Notification duration={5} errorResponse={{ message: translateField(messageForm?.message, 'auth', words, false), className: messageForm?.className }} />
        )}
      </Fragment>
    );
  }),
);

export default SocialCustom;
