import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

export const serverUrl = "http://localhost:8000";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { userData } = useSelector((state) => state.user);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userData?._id) {
      return;
    }

    const socketInstance = io(serverUrl, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);

      socketInstance.emit("identity", {
        userId: userData._id,
      });
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [userData?._id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};