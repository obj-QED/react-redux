import { useEffect, useRef, useState } from 'react';
//import { io } from 'socket.io-client';

export const useWebSocket = ({ url, session, token, bonusInfoId }) => {
  const [result, setResult] = useState(null);
  const ws = useRef(null);
  const DOMAIN_URL = process.env.NODE_ENV === 'production' ? window.location.hostname : '999ggg.net';

  useEffect(() => {
    let socket = new WebSocket(`${url}?&DS=https://${DOMAIN_URL}/apiLobby.php`, ['DS']);
    ws.current = socket;

    if (url) {
      // Обработчик события открытия соединения
      socket.onopen = function (e) {
        // Отправляем первое сообщение
        let message = {
          M_type: 'customService',
          session,
        };
        socket.send(JSON.stringify(message));

        // Отправляем второе сообщение
        message = {
          session,
          cmd: 'bonusInfo',
          token,
          data: {
            id: bonusInfoId,
          },
        };
        socket.send(JSON.stringify(message));
      };

      // Обработчик события получения сообщения
      socket.onmessage = function (event) {
        // Проверяем, не содержится ли в сообщении фраза 'Fatal error'
        if (event?.data?.includes('Fatal error')) {
          // Закрываем соединение в случае ошибки
          socket.close();
          return;
        } else {
          // Обрабатываем полученное сообщение
          setResult(JSON.parse(event?.data));
        }
      };

      // Обработчик события закрытия соединения
      socket.onclose = function (event) {
        // eslint-disable-next-line no-console
        console.log(event);
      };

      // Обработчик события ошибки соединения
      socket.onerror = function (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      };
    }

    // Очистка соединения при размонтировании компонента
    return () => {
      if (socket) {
        socket.close();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return result ? result : null;
};
