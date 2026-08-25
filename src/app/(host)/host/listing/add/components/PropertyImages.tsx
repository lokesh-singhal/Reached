"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, X, GripVertical } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";


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

export default function PropertyImages() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setValue, control } = useFormContext<ListingForm>();
    const images = useWatch({
        control,
        name: "images"
    })

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setValue("images", [...images, ...files], {
            shouldDirty: true,
            shouldValidate: true
        })
    };


    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, id) => id !== index);
        setValue("images", updatedImages, {
            shouldValidate: true,
            shouldDirty: true,
        })
    };

    return (
        <section className="">
            <div>
                <h2 className="text-xl font-semibold">
                    Property images
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Add minimum 2 photos that show guests what your property looks like.
                </p>
            </div>

            <div className="mt-6">

                {images.length === 0 ? (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex min-h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 px-6 text-center transition hover:bg-muted/50"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <p className="mt-4 font-medium">
                            Add photos of your property
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Upload multiple JPG, PNG, or WebP images
                        </p>

                        <span className="mt-4 rounded-lg border bg-background px-4 py-2 text-sm font-medium">
                            Choose photos
                        </span>
                    </button>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                        {images.map((image, index) => (
                            <div
                                key={`${image.name}-${index}`}
                                className={`group relative overflow-hidden rounded-xl border ${index === 0
                                        ? "col-span-2 row-span-2 aspect-4/3 sm:col-span-2"
                                        : "aspect-4/3"
                                    }`}
                            >
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Property image ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>

                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                                        Main photo
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex aspect-4/3 flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 transition hover:bg-muted/50"
                        >
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />

                            <span className="mt-2 text-sm font-medium">
                                Add photos
                            </span>
                        </button>

                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImages}
                />

                <p className="mt-3 text-xs text-muted-foreground">
                    The first photo will be used as the main photo of your listing.
                </p>
            </div>
        </section>
    );
}