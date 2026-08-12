import React, { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { FaMotorcycle, FaHome, FaMapMarkerAlt } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";

const deliveryBoyIcon = L.divIcon({
  className: "custom-map-icon",
  html: renderToStaticMarkup(
    <div
      style={{
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        background: "#ff6b00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "4px solid white",
        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
      }}
    >
      <FaMotorcycle
        style={{
          color: "white",
          fontSize: "21px",
        }}
      />
    </div>,
  ),
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

const customerIcon = L.divIcon({
  className: "custom-map-icon",
  html: renderToStaticMarkup(
    <div
      style={{
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        background: "#172b4d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "4px solid white",
        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
      }}
    >
      <FaHome
        style={{
          color: "white",
          fontSize: "20px",
        }}
      />
    </div>,
  ),
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

function FitMapToLocations({ deliveryBoyPosition, customerPosition }) {
  const map = useMap();
  const timeoutRef = useRef(null);
  const autoFittingRef = useRef(false);
  const fitMap = () => {
    if (!deliveryBoyPosition || !customerPosition) {
      return;
    }
    const bounds = L.latLngBounds([deliveryBoyPosition, customerPosition]);
    autoFittingRef.current = true;
    map.fitBounds(bounds, {
      padding: [70, 70],
      animate: true,
      duration: 1,
    });
    setTimeout(() => {
      autoFittingRef.current = false;
    }, 1200);
  };

  useEffect(() => {
    if (!deliveryBoyPosition || !customerPosition) {
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fitMap();
    }, 2500);
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [
    deliveryBoyPosition?.[0],
    deliveryBoyPosition?.[1],
    customerPosition?.[0],
    customerPosition?.[1],
  ]);

  useEffect(() => {
    const handleMoveEnd = () => {
      if (autoFittingRef.current) {
        return;
      }
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fitMap();
      }, 2500);
    };
    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
      clearTimeout(timeoutRef.current);
    };
  }, [map, deliveryBoyPosition, customerPosition]);
  return null;
}

function LiveTrackingMap({
  deliveryBoyLocation,
  customerLocation,
  deliveryBoy,
  customer,
}) {
  const deliveryBoyPosition = useMemo(() => {
    if (
      deliveryBoyLocation?.latitude == null ||
      deliveryBoyLocation?.longitude == null
    ) {
      return null;
    }
    return [
      Number(deliveryBoyLocation.latitude),
      Number(deliveryBoyLocation.longitude),
    ];
  }, [deliveryBoyLocation?.latitude, deliveryBoyLocation?.longitude]);
  const customerPosition = useMemo(() => {
    if (
      customerLocation?.latitude == null ||
      customerLocation?.longitude == null
    ) {
      return null;
    }
    return [
      Number(customerLocation.latitude),
      Number(customerLocation.longitude),
    ];
  }, [customerLocation?.latitude, customerLocation?.longitude]);
  const trackingLine = useMemo(() => {
    if (!deliveryBoyPosition || !customerPosition) {
      return [];
    }
    return [deliveryBoyPosition, customerPosition];
  }, [deliveryBoyPosition, customerPosition]);
  if (!deliveryBoyPosition || !customerPosition) {
    return (
      <div className="h-[420px] bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center px-6">
          <FaMapMarkerAlt className="text-orange-500 mx-auto mb-3" size={35} />
          <p className="font-semibold text-[#172b4d]">
            Live location unavailable
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Waiting for delivery location information.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-[420px] rounded-2xl overflow-hidden border border-gray-200">
      <MapContainer
        center={deliveryBoyPosition}
        zoom={15}
        zoomControl={true}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitMapToLocations
          deliveryBoyPosition={deliveryBoyPosition}
          customerPosition={customerPosition}
        />
        <Marker position={deliveryBoyPosition} icon={deliveryBoyIcon}>
          <Popup>
            <div className="text-sm">
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
            <div className="text-sm">
              <strong>Delivery Location</strong>
              <br />
              {customer?.fullName || "Customer"}
              <br />
              <span className="text-gray-500">Customer address</span>
            </div>
          </Popup>
        </Marker>
        <Polyline
          positions={trackingLine}
          pathOptions={{
            color: "#ff6b00",
            weight: 5,
            opacity: 0.8,
          }}
        />
      </MapContainer>
    </div>
  );
}

export default LiveTrackingMap;
