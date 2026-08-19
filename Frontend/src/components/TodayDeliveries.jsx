import axios from "axios";
import React,{useEffect,useState} from "react";
import {FaArrowLeft,FaCalendarAlt,FaClock,FaStore,FaMapMarkerAlt,FaBoxOpen,FaCheckCircle,FaMoneyBillWave,FaChartBar,FaRupeeSign} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {ResponsiveContainer,BarChart,Bar,CartesianGrid,XAxis,YAxis,Tooltip} from "recharts";
import {serverUrl} from "../App";

function TodayDeliveries(){
  const navigate=useNavigate();
  const [deliveries,setDeliveries]=useState([]);
  const [totalDeliveries,setTotalDeliveries]=useState(0);
  const [stats,setStats]=useState([]);
  const [earnings,setEarnings]=useState({perDelivery:25,total:0,average:0});
  const [loading,setLoading]=useState(true);

  const fetchTodayDeliveries=async()=>{
    try{
      setLoading(true);
      const result=await axios.get(`${serverUrl}/api/order/get-today-deliveries`,{withCredentials:true});
      if(result.data.success){
        setDeliveries(result.data.orders||[]);
        setTotalDeliveries(result.data.deliveries||0);
        setStats(result.data.stats||[]);
        setEarnings(result.data.earnings||{perDelivery:25,total:0,average:0});
      }
    }catch(error){
      console.log("TODAY DELIVERIES ERROR:",error.response?.data?.message||error.message);
    }finally{setLoading(false);}
  };

  useEffect(()=>{fetchTodayDeliveries();},[]);
  const formatTime=date=>{
    if(!date)return"--";
    return new Date(date).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
  };
  const formatDate=date=>{
    if(!date)return"--";
    return new Date(date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
  };
  const getTotalItems=shopOrder=>{
    if(!shopOrder?.shopOrderItems)return 0;
    return shopOrder.shopOrderItems.reduce((total,item)=>total+Number(item.quantity||0),0);
  };
  const getOrderAmount=shopOrder=>{
    return shopOrder?.subTotalAmount||shopOrder?.totalAmount||shopOrder?.subtotal||0;
  };
  const deliveryCount=earnings?.perDelivery>0?Math.round(earnings.total/earnings.perDelivery):totalDeliveries;
  const earningProgress=Math.min((deliveryCount/10)*100,100);

  if(loading){
    return(
      <div className="min-h-screen bg-gray-50">
        <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
            <div className="h-14 sm:h-16 flex items-center justify-between">
              <div onClick={()=>navigate("/")} className="flex items-center gap-2 cursor-pointer">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500 flex items-center justify-center"><FaBoxOpen className="text-white text-sm sm:text-base"/></div>
                <span className="text-xl sm:text-2xl font-extrabold text-orange-500">AxionGo</span>
              </div>
              <button onClick={()=>navigate(-1)} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition text-xs sm:text-sm font-semibold"><FaArrowLeft/><span>Back</span></button>
            </div>
          </div>
        </nav>
        <div className="max-w-5xl mx-auto px-3 sm:px-5 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
            <div className="w-9 h-9 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mx-auto"/>
            <p className="text-sm text-gray-500 mt-4">Loading today's deliveries...</p>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <div className="h-14 sm:h-16 flex items-center justify-between">
            <div onClick={()=>navigate("/")} className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm"><FaBoxOpen className="text-white text-sm sm:text-base"/></div>
              <span className="text-xl sm:text-2xl font-extrabold text-orange-500">AxionGo</span>
            </div>
            <button onClick={()=>navigate(-1)} className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition text-xs sm:text-sm font-semibold"><FaArrowLeft className="text-xs sm:text-sm"/><span>Back</span></button>
          </div>
        </div>
      </nav>
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6 lg:py-8">
        <section className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 sm:p-5 md:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0"><FaCalendarAlt className="text-orange-500 text-base sm:text-xl"/></div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#17365D]">Today's Deliveries</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Overview of your completed deliveries and today's earnings.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div><p className="text-xs sm:text-sm text-gray-500">Completed Deliveries</p><p className="text-2xl sm:text-3xl font-extrabold text-orange-500 mt-1">{totalDeliveries}</p></div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><FaCheckCircle className="text-green-500 text-lg"/></div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div><p className="text-xs sm:text-sm text-gray-500">Today's Earnings</p><p className="text-2xl sm:text-3xl font-extrabold text-green-600 mt-1">₹{earnings.total}</p></div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><FaMoneyBillWave className="text-green-500 text-lg"/></div>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-4 sm:mt-6 bg-white rounded-2xl border border-orange-100 shadow-sm p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center"><FaChartBar className="text-orange-500"/></div>
              <div><h2 className="text-base sm:text-lg font-bold text-[#17365D]">Today's Earnings</h2><p className="text-[11px] sm:text-xs text-gray-500">₹{earnings.perDelivery} earned for every delivery</p></div>
            </div>
            <div className="text-right"><p className="text-xl sm:text-2xl font-extrabold text-orange-500">₹{earnings.total}</p></div>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2"><span className="text-[11px] sm:text-xs text-gray-500">Delivery progress</span><span className="text-[11px] sm:text-xs font-semibold text-[#17365D]">{totalDeliveries} deliveries</span></div>
            <div className="w-full h-3 sm:h-3.5 bg-orange-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-700" style={{width:totalDeliveries===0?"0%":`${earningProgress}%`}}/></div>
            <div className="flex justify-between mt-2"><span className="text-[10px] sm:text-xs text-gray-400">₹0</span><span className="text-[10px] sm:text-xs text-gray-400">₹{earnings.perDelivery*10}</span></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3"><p className="text-[10px] sm:text-xs text-gray-500">Per Delivery</p><p className="text-sm sm:text-base font-bold text-[#17365D] mt-1">₹{earnings.perDelivery}</p></div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3"><p className="text-[10px] sm:text-xs text-gray-500">Average</p><p className="text-sm sm:text-base font-bold text-[#17365D] mt-1">₹{earnings.average}</p></div>
            <div className="col-span-2 sm:col-span-1 bg-gray-50 rounded-xl border border-gray-100 p-3"><p className="text-[10px] sm:text-xs text-gray-500">Total Earned</p><p className="text-sm sm:text-base font-bold text-orange-500 mt-1">₹{earnings.total}</p></div>
          </div>
        </section>
        {stats.length>0&&(
          <section className="mt-4 sm:mt-6 bg-white rounded-2xl border border-orange-100 shadow-sm p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center"><FaChartBar className="text-orange-500"/></div>
              <div><h2 className="text-base sm:text-lg font-bold text-[#17365D]">Delivery Activity</h2><p className="text-[11px] sm:text-xs text-gray-500">Your completed deliveries by hour</p></div>
            </div>
            <div className="w-full h-[220px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} margin={{top:10,right:5,left:-20,bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                  <XAxis dataKey="hour" tickFormatter={hour=>`${String(hour).padStart(2,"0")}:00`} tick={{fontSize:11,fill:"#64748b"}} axisLine={false} tickLine={false}/>
                  <YAxis allowDecimals={false} tick={{fontSize:11,fill:"#64748b"}} axisLine={false} tickLine={false}/>
                  <Tooltip cursor={{fill:"#fff7ed"}} contentStyle={{borderRadius:"12px",border:"1px solid #fed7aa",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}} labelFormatter={hour=>`${String(hour).padStart(2,"0")}:00`} formatter={value=>[`${value} deliveries`,"Completed"]}/>
                  <Bar dataKey="count" fill="#ff6b00" radius={[6,6,0,0]} maxBarSize={42}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
        {deliveries.length===0&&(
          <section className="mt-4 sm:mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 md:p-16 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto"><FaBoxOpen className="text-orange-500 text-xl sm:text-2xl"/></div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mt-4 sm:mt-5">No deliveries today</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto">You haven't completed any deliveries today.</p>
            <button onClick={()=>navigate(-1)} className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition">Back to Dashboard</button>
          </section>
        )}
        {deliveries.length>0&&(
          <section className="mt-4 sm:mt-6">
            <div className="flex items-end justify-between mb-4 px-1">
              <div><h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#17365D]">Completed Deliveries</h2><p className="text-xs sm:text-sm text-gray-500 mt-1">Details of the orders you delivered today.</p></div>
              <span className="hidden sm:block bg-orange-50 border border-orange-100 text-orange-500 px-3 py-1.5 rounded-full text-xs font-semibold">{totalDeliveries} Completed</span>
            </div>
            <div className="space-y-4">
              {deliveries.map((shopOrder,index)=>(
                <div key={shopOrder._id||index} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0"><FaStore className="text-orange-500 text-sm sm:text-base"/></div>
                      <div className="min-w-0"><h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">{shopOrder.shop?.name||"Restaurant"}</h3><p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Delivery #{index+1}</p></div>
                    </div>
                    <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-600 text-[9px] sm:text-xs font-semibold"><FaCheckCircle/>Delivered</span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 sm:p-4">
                      <div className="flex items-start gap-2.5">
                        <FaMapMarkerAlt className="text-orange-500 mt-0.5 shrink-0 text-sm"/>
                        <div className="min-w-0"><p className="text-xs sm:text-sm font-semibold text-gray-800">Delivery Address</p><p className="text-[10px] sm:text-xs text-gray-600 mt-1 leading-4 sm:leading-5 break-words">{shopOrder.deliveryAddress?.text||shopOrder.deliveryAddress||"Address unavailable"}</p></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-3 sm:mt-4">
                      <div className="border border-gray-100 rounded-xl p-3 bg-gray-50"><p className="text-[10px] sm:text-xs text-gray-500">Items</p><p className="text-sm sm:text-base font-bold text-gray-800 mt-1">{getTotalItems(shopOrder)}</p></div>
                      <div className="border border-gray-100 rounded-xl p-3 bg-gray-50"><p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1"><FaMoneyBillWave className="text-orange-400"/>Order Amount</p><p className="text-sm sm:text-base font-bold text-orange-500 mt-1">₹{getOrderAmount(shopOrder)}</p></div>
                      <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 col-span-2 sm:col-span-1"><p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1"><FaClock className="text-orange-400"/>Delivered At</p><p className="text-sm sm:text-base font-bold text-gray-800 mt-1">{formatTime(shopOrder.deliveredAt)}</p></div>
                    </div>
                    <div className="mt-3 sm:mt-4 flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3.5 sm:px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"><FaRupeeSign className="text-green-600 text-sm"/></div>
                        <div><p className="text-[10px] sm:text-xs text-gray-500">Delivery Earning</p><p className="text-xs sm:text-sm font-semibold text-gray-700">Completed delivery</p></div>
                      </div>
                      <span className="text-base sm:text-lg font-extrabold text-green-600">₹{earnings.perDelivery}</span>
                    </div>
                    {shopOrder.shopOrderItems?.length>0&&(
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">Items Delivered</p>
                        <div className="space-y-2">
                          {shopOrder.shopOrderItems.map((item,itemIndex)=>(
                            <div key={item._id||itemIndex} className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                              <div className="min-w-0"><p className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{item.item?.name||item.name||"Food Item"}</p><p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p></div>
                              <span className="text-xs sm:text-sm font-semibold text-orange-500 shrink-0">₹{Number(item.price||0)*Number(item.quantity||0)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-[10px] sm:text-xs text-gray-400"><FaCalendarAlt className="text-orange-400"/>Delivered on {formatDate(shopOrder.deliveredAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default TodayDeliveries;