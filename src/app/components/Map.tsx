"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FitBounds from "./FitBounds";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map({ listing }: any) {
  const handleListing = (list: string) => {

  }
  return (
    <MapContainer
      center={[28.6139, 77.209]} // Delhi
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds listings={listing} />

      {listing.map((item: any) => (
        <Marker position={[item.location.coordinates[1], item.location.coordinates[0]]}>
          <Popup minWidth={300} className="p-0">
            <div
              key={item._id}
              onClick={() => handleListing(item._id)}
              className="cursor-pointer"
            >
              <img
                className="w-full aspect-20/19 object-cover rounded-xl"
                src={item.houseImageUrl[0]}
                alt={item.title}
              />

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <h1 className="font-medium truncate">
                    {item.title}
                  </h1>
                  <span>⭐ 5.0</span>
                </div>

                <p className="truncate text-gray-600">
                  {item.description}
                </p>

                <p className="text-gray-600">
                  {item.maxGuests} guests
                </p>

                <p>
                  <span className="font-bold underline">
                    ₹{item.price}
                  </span>{" "}
                  for 1 night
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}