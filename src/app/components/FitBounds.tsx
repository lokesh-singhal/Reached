'use client'
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";


export default function FitBounds({ listings }: any) {
    const map = useMap();
    useEffect(() => {
        if (listings.length === 0) return;

        const bounds = L.latLngBounds(
            listings.map((item: any) => [
                item.location.coordinates[1],
                item.location.coordinates[0],
            ])
        );

        map.fitBounds(bounds, {
            padding: [50, 50],
        });
    }, [listings, map]);

    return null;
}