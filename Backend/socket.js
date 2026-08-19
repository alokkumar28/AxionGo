import User from "./models/user.model.js";
import Order from "./models/order.model.js";

export const socketHandler=(io)=>{
  io.on("connection",(socket)=>{
    console.log("User connected:",socket.id);

    socket.on("identity",async({userId})=>{
      try{
        await User.findByIdAndUpdate(userId,{socketId:socket.id,isOnline:true},{new:true});
        console.log(`User ${userId} is online`);
      }catch(error){
        console.error("Identity error:",error);
      }
    });

    socket.on("updateLocation",async({latitude,longitude,userId,shopOrderId})=>{
      try{
        if(latitude===undefined||longitude===undefined||!userId||!shopOrderId)return;

        const deliveryBoy=await User.findOne({_id:userId,socketId:socket.id,role:"Delivery Boy"});

        if(!deliveryBoy){
          console.log("Invalid delivery boy socket");
          return;
        }

        await User.findByIdAndUpdate(userId,{
          location:{type:"Point",coordinates:[longitude,latitude]},
          isOnline:true,
          socketId:socket.id
        });

        const order=await Order.findOne({
          "shopOrders._id":shopOrderId,
          "shopOrders.assignedDeliveryBoy":userId
        }).populate("user","socketId fullName");

        if(!order){
          console.log(`No order found for delivery boy ${userId}`);
          return;
        }

        const customerSocketId=order.user?.socketId;

        if(!customerSocketId){
          console.log(`Customer is offline for order ${order._id}`);
          return;
        }

        io.to(customerSocketId).emit("updateDeliveryLocation",{
          orderId:order._id,
          shopOrderId,
          deliveryBoyId:userId,
          latitude,
          longitude
        });

        console.log(`Location sent → customer ${order.user._id} → ${latitude}, ${longitude}`);
      }catch(error){
        console.error("Delivery Location Error:",error);
      }
    });

    socket.on("disconnect",async()=>{
      try{
        await User.findOneAndUpdate(
          {socketId:socket.id},
          {socketId:null,isOnline:false}
        );
        console.log("User disconnected:",socket.id);
      }catch(error){
        console.error("Disconnect error:",error);
      }
    });
  });
};