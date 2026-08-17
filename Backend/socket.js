import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("identity", async ({ userId }) => {
      try {
        await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true }
        );
        console.log(`User ${userId} is online`);
      } catch (error) {
        console.error("Identity error:", error);
      }
    });
    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            socketId: null,
            isOnline: false,
          }
        );
        console.log("User disconnected:", socket.id);
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    });
  });
};