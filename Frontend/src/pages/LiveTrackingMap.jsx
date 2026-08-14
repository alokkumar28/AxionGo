import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { FaMotorcycle, FaHome, FaMapMarkerAlt } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";

const deliveryBoyIcon = L.divIcon({
  className: "custom-map-icon",
  html: renderToStaticMarkup(<div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#ff6b00", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.22)" }}><FaMotorcycle style={{ color: "white", fontSize: "17px" }} /></div>),
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const customerIcon = L.divIcon({
  className: "custom-map-icon",
  html: renderToStaticMarkup(<div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#172b4d", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.22)" }}><FaHome style={{ color: "white", fontSize: "16px" }} /></div>),
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

function FitMapToLocations({ deliveryBoyPosition, customerPosition }) {
  const map = useMap();
  const timeoutRef = useRef(null);
  const autoFittingRef = useRef(false);

  const fitMap = () => {
    if (!deliveryBoyPosition || !customerPosition) return;
    const bounds = L.latLngBounds([deliveryBoyPosition, customerPosition]);
    autoFittingRef.current = true;
    map.fitBounds(bounds, { padding: [45, 45], animate: true, duration: 0.8 });
    setTimeout(() => { autoFittingRef.current = false; }, 1000);
  };

  useEffect(() => {
    if (!deliveryBoyPosition || !customerPosition) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { fitMap(); }, 1800);
    return () => { clearTimeout(timeoutRef.current); };
  }, [deliveryBoyPosition?.[0], deliveryBoyPosition?.[1], customerPosition?.[0], customerPosition?.[1]]);

  useEffect(() => {
    const handleMoveEnd = () => {
      if (autoFittingRef.current) return;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => { fitMap(); }, 1800);
    };
    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
      clearTimeout(timeoutRef.current);
    };
  }, [map, deliveryBoyPosition, customerPosition]);

  return null;
}

function LiveTrackingMap({ deliveryBoyLocation, customerLocation, deliveryBoy, customer }) {
  const deliveryBoyPosition = useMemo(() => {
    if (deliveryBoyLocation?.latitude == null || deliveryBoyLocation?.longitude == null) return null;
    return [Number(deliveryBoyLocation.latitude), Number(deliveryBoyLocation.longitude)];
  }, [deliveryBoyLocation?.latitude, deliveryBoyLocation?.longitude]);

  const customerPosition = useMemo(() => {
    if (customerLocation?.latitude == null || customerLocation?.longitude == null) return null;
    return [Number(customerLocation.latitude), Number(customerLocation.longitude)];
  }, [customerLocation?.latitude, customerLocation?.longitude]);

  const trackingLine = useMemo(() => {
    if (!deliveryBoyPosition || !customerPosition) return [];
    return [deliveryBoyPosition, customerPosition];
  }, [deliveryBoyPosition, customerPosition]);

  if (!deliveryBoyPosition || !customerPosition) {
    return (
      <div className="h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] bg-gray-50 flex items-center justify-center rounded-xl">
        <div className="text-center px-5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
            <FaMapMarkerAlt className="text-orange-500 text-base sm:text-lg" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#172b4d]">Live location unavailable</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Waiting for delivery location information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-0 w-full h-[230px] sm:h-[280px] md:h-[320px] lg:h-[360px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
      <MapContainer center={deliveryBoyPosition} zoom={15} zoomControl={true} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitMapToLocations deliveryBoyPosition={deliveryBoyPosition} customerPosition={customerPosition} />
        <Marker position={deliveryBoyPosition} icon={deliveryBoyIcon}>
          <Popup>
            <div className="text-xs sm:text-sm">
              <strong>Delivery Partner</strong>
              <br />
              {deliveryBoy?.fullName || "Delivery Partner"}
              <br />
              <span className="text-gray-500">Current location</span>
            </div>
          </Popup>
        </Marker>
        <Marker position={customerPosition} icon={customerIcon}>
          <Popup>
            <div className="text-xs sm:text-sm">
              <strong>Delivery Location</strong>
              <br />
              {customer?.fullName || "Customer"}
              <br />
              <span className="text-gray-500">Customer address</span>
            </div>
          </Popup>
        </Marker>
        <Polyline positions={trackingLine} pathOptions={{ color: "#ff6b00", weight: 4, opacity: 0.75 }} />
      </MapContainer>
    </div>
  );
}

export default LiveTrackingMap;