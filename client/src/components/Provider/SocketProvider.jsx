import { useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_SERVER_URL);

const SocketIoProvider = () => {
  useEffect(() => {
    // return () => {
    //     socket.close();
    // }
    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket };
};

export default SocketIoProvider;
