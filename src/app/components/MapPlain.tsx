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

export default function MapPlain({ listing }: any) {
    const handleListing = (list: string) => {

    }
    return (
        <MapContainer
            center={[listing.location.coordinates[1], listing.location.coordinates[0]]} // Delhi
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />



            <Marker position={[listing.location.coordinates[1], listing.location.coordinates[0]]}>
                
            </Marker>
        </MapContainer>
    );
}