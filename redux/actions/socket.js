import io from 'socket.io-client';
import { getBaseUrl } from '../../helpers/config';

export const setupSocket = () => {
  return (dispatch) => {
    let url = getBaseUrl();

    const socket = io(url);

    socket.on('connect', () => {
      dispatch({ type: 'SOCKET_CONNECTED', socket });
    });

    socket.on('eventName', (data) => {
      dispatch({ type: 'SOCKET_EVENT_RECEIVED', data });
    });

    socket.on('disconnect', (data) => {
      dispatch({ type: 'SOCKET_DISCONNECTED' });
    });
  };
};
