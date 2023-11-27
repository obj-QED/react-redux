import { useEffect, useState } from 'preact/hooks';
//import { io } from 'socket.io-client';

export const useWebSocket = ({ url, session, token, bonusInfoId }) => {
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (url) {
      let socket = new WebSocket(`${url}?&DS=https://DOMAIN/apiLobby.php`, ['DS']);
      socket.onopen = function (e) {
        let message = {
          M_type: 'customService',
          session,
        };
        socket.send(JSON.stringify(message));
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
      socket.onmessage = function (result) {
        if (result?.data?.includes('Fatal error')) {
          socket.close();
          return;
        } else {
          setResult(JSON.parse(result?.data));
        }
      };
      socket.onclose = function (event) {
        // eslint-disable-next-line no-console
        console.log(event);
      };
      socket.onerror = function (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      };
    }
    /*ws.onclose = function (event) {
      console.log(event);
    };
    ws.onerror = function (error) {
      console.log(error);
    };*/
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return result ? result : null;
};
