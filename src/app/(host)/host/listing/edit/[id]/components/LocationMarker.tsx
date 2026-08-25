"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

interface Props {
    coordinates: [number, number];
    setCoordinates: (coordinates: [number, number]) => void;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({
    coordinates,
    setCoordinates,
}: Props) {
    useMapEvents({
        click(e) {
            setCoordinates([e.latlng.lng, e.latlng.lat]);
        },
    });

    return (
        <Marker
            position={[coordinates[1], coordinates[0]]}
            draggable
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target as L.Marker;
                    const { lat, lng } = marker.getLatLng();

                    setCoordinates([lng, lat]);
                },
            }}
        />
    );
}

function MapCenter({
    coordinates,
}: {
    coordinates: [number, number];
}) {
    const map = useMap();

    useEffect(() => {
        map.setView(
            [coordinates[1], coordinates[0]],
            map.getZoom()
        );
    }, [coordinates, map]);

    return null;
}

export default function LocationMap({
    coordinates,
    setCoordinates,
}: Props) {
    return (
        <MapContainer
            center={[coordinates[1], coordinates[0]]}
            zoom={14}
            scrollWheelZoom

            className="h-125 w-full rounded-xl"
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapCenter coordinates={coordinates} />

            <LocationMarker
                coordinates={coordinates}
                setCoordinates={setCoordinates}
            />
        </MapContainer>
    );
}