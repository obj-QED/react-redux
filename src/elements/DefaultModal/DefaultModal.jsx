import React, { useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';
import { translateField } from '../../shared/utils';

/**
 * Note: Компонент DefaultModal - модальное окно с кнопками "OK" и "Cancel".
 *
 * @param {Object} props - Свойства компонента.
 * @param {string} props.content - Содержимое модального окна.
 * @param {Function} props.acceptHandling - Функция, вызываемая при нажатии на кнопку "OK".
 * @param {boolean} props.isModalOpen - Состояние открытости модального окна.
 * @param {Function} props.setIsModalOpen - Функция для изменения состояния открытости модального окна.
 * @param {string} props.modalTitle - Заголовок модального окна.
 * @param {Object} props.className - Объект с классами для стилизации различных элементов модального окна.
 * @param {Object} props.params - Дополнительные параметры для управления модальным окном.
 *
 */

const DefaultModal = memo(
  ({
    style,
    content,
    getContainer = () => document.body,
    acceptHandling,
    onCancel,
    isModalOpen,
    setIsModalOpen,
    modalTitle,
    loading,
    closable,
    buttonsParams = {
      ok: {
        text: 'ok',
        className: 'btn btn--get',
      },
      cancel: {
        text: 'cancel',
        className: 'btn btn--cancel',
      },
    },
    className = {
      className: '',
      classWrap: '',
      classBtnOkType: '',
      classBtnCancel: 'btn btn--cancel',
      classBtnOk: 'btn btn--get',
    },
    params = {
      loading: false,
      estrowOnClose: false,
      maskClosable: false,
      destroyOnClose: false,
      keyboard: false,
      disabled: false,
    },
    footer,
  }) => {
    /**
     * Обработчик события нажатия на кнопку "OK".
     * Вызывает функцию acceptHandling и закрывает модальное окно.
     */
    const handleOk = useCallback(() => {
      acceptHandling(); // Вызываем функцию acceptHandling
      setIsModalOpen(false); // Закрываем модальное окно
    }, [acceptHandling, setIsModalOpen]);

    /**
     * Обработчик события нажатия на кнопку "Cancel".
     * Закрывает модальное окно.
     */
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const words = useSelector((state) => state.words);

    return (
      <Modal
        style={style}
        getContainer={getContainer}
        loading={loading}
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={onCancel || handleCancel}
        rootClassName={className.rootClassName}
        className={className.className}
        wrapClassName={className.classWrap}
        okType={className.classBtnOkType}
        okButtonProps={{
          className: className.classBtnOk,
          disabled: params.disabled,
        }}
        okText={translateField(buttonsParams?.ok?.text, words, false)}
        cancelText={translateField(buttonsParams?.cancel?.text, words, false)}
        cancelButtonProps={{
          className: className.classBtnCancel,
        }}
        // Params
        confirmLoading={params.loading}
        destroyOnClose={params.destroyOnClose}
        maskClosable={params.maskClosable}
        estrowOnClose={params.estrowOnClose}
        keyboard={params.keyboard}
        footer={footer}
        width={params.width}
        centered={params.centered}
        closable={closable}
      >
        {content}
      </Modal>
    );
  },
);

export default DefaultModal;
