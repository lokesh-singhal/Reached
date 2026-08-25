"use client";

import { MapPin } from "lucide-react";
import LocationMap from "../../edit/[id]/components/LocationMarker";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { useState } from "react";
import { Spinner } from "@/app/components/ui/spinner";

interface LocationProps {
    getCurrentLocation: () => void,
}

interface ListingForm {
    title: string,
    description: string,
    guests: number,
    price: number,
    images: File[],
    address: string,
    city: string,
    state: string,
    coordinates: [number, number]
}

export default function PropertyLocation() {

    const { register, setValue, control } = useFormContext<ListingForm>();
    const [loading, setLoading] = useState(false);
    const coordinates = useWatch({
        control,
        name: "coordinates"
    })
    const { errors } = useFormState({ control })

    const getCurrentLocation = () => {
        try {
            setLoading(true);
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setValue("coordinates", [
                        longitude,
                        latitude
                    ])
                },
                (error) => {
                    console.log(error);
                    if (error.code === error.PERMISSION_DENIED) {
                        alert("Please allow location access to use your current location");
                    }
                }
            )
        }finally{
            setLoading(false);
        }
    }

    return (
        <section className="">
            <div>
                <h2 className="text-xl font-semibold">
                    Location
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Add the location of your property so guests can find it easily.
                </p>
            </div>

            <div className="mt-6 space-y-5">

                <div>
                    <label
                        htmlFor="address"
                        className="mb-2 block text-sm font-medium"
                    >
                        Address
                    </label>

                    <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <input
                            {...register("address", {
                                required: "Property address is required",
                            })}
                            placeholder="Enter your property's address"
                            className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                        />

                    </div>
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.address.message}
                        </p>
                    )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                        <label
                            htmlFor="city"
                            className="mb-2 block text-sm font-medium"
                        >
                            City
                        </label>

                        <input
                            {...register("city", {
                                required: "City is required",
                            })}
                            placeholder="e.g. Lucknow"
                            className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                        />

                        {errors.city && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.city.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="state"
                            className="mb-2 block text-sm font-medium"
                        >
                            State
                        </label>

                        <input
                            {...register("state", {
                                required: "State is required",
                            })}
                            placeholder="e.g. Uttar Pradesh"
                            className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                        />

                        {errors.state && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.state.message}
                            </p>
                        )}
                    </div>

                </div>

                <div>
                    <div className="mb-2">
                        <label className="text-sm font-medium">
                            Pin your location
                        </label>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Drag the marker to the exact location of your property.
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={getCurrentLocation}
                        className="shrink-0 disabled:cursor-not-allowed rounded-lg border mb-2 px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                        {loading ? <Spinner /> : "Use my location"}
                    </button>

                    <div className="relative h-72 overflow-hidden rounded-xl border bg-muted">
                        <LocationMap
                            coordinates={coordinates}
                            setCoordinates={(coordinates) => {
                                setValue("coordinates", coordinates)
                            }}
                        />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <MapPin className="h-8 w-8" />

                                <span className="text-sm">
                                    Select location on map
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}