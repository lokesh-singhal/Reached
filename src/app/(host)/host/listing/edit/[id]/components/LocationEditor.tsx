"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import CreateInputListing from "@/types/CreateInputListing";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("./LocationMarker"),
  { ssr: false }
);

interface LocationEditorProps {
    originalAddress: string;
    originalCity: string;
    originalState: string;
    originalCoordinates: [number, number];
    onSave: (updates: Partial<CreateInputListing>) => Promise<void>;
}

export default function LocationEditor({
    originalAddress,
    originalCity,
    originalState,
    originalCoordinates,
    onSave,
}: LocationEditorProps) {
    const [address, setAddress] = useState(originalAddress);
    const [city, setCity] = useState(originalCity);
    const [state, setState] = useState(originalState);
    const [coordinates, setCoordinates] =
        useState<[number, number]>(originalCoordinates);

    const [isSaving, setIsSaving] = useState(false);

    const hasChanges =
        address.trim() !== originalAddress.trim() ||
        city.trim() !== originalCity.trim() ||
        state.trim() !== originalState.trim() ||
        coordinates[0] !== originalCoordinates[0] ||
        coordinates[1] !== originalCoordinates[1];

    const handleCancel = () => {
        setAddress(originalAddress);
        setCity(originalCity);
        setState(originalState);
        setCoordinates(originalCoordinates);
    };

    const handleSave = async () => {
        if (!hasChanges){
            toast.message("Nothing to save");
            return;
        }

        try {
            setIsSaving(true);

            await onSave({
                address,
                city,
                state,
                location: {
                    type: "Point",
                    coordinates,
                },
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="lg:ml-30 ml-5 mt-5 max-w-5xl space-y-8">
            <div>
                <h1 className="text-5xl font-semibold">
                    Location
                </h1>

                <p className="mt-2 text-xl text-neutral-500">
                    Help guests find your place by updating its
                    address and map location.
                </p>
            </div>

            <div className="space-y-5">
                <Input
                    value={address}
                    onChange={(e) =>
                        setAddress(e.target.value)
                    }
                    placeholder="Address"
                />

                <div className="grid grid-cols-2 gap-5">
                    <Input
                        value={city}
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                        placeholder="City"
                    />

                    <Input
                        value={state}
                        onChange={(e) =>
                            setState(e.target.value)
                        }
                        placeholder="State"
                    />
                </div>
            </div>

            <LocationMap
                coordinates={coordinates}
                setCoordinates={setCoordinates}
            />

            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    disabled={isSaving}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>

                <Button
                    disabled={!hasChanges || isSaving}
                    onClick={handleSave}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    );
}