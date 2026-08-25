"use client";

import { Button } from "@/app/components/ui/button";
import { Spinner } from "@/app/components/ui/spinner";
import { Plus } from "lucide-react";
import { useRef } from "react";

interface PhotoHeaderProps {
    uploadLoading: boolean
    totalPhotos: number;
    onUpload: (files:FileList) => void;
}

export default function PhotoHeader({
    uploadLoading,
    totalPhotos,
    onUpload,
}: PhotoHeaderProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    return (
        <div className="space-y-6">

            {/* Heading */}
            <div className="flex items-start justify-between">

                <div>

                    <h1 className="text-3xl font-semibold tracking-tight">
                        Photo Tour
                    </h1>

                    <div className="mt-3 inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">
                        {totalPhotos} {totalPhotos === 1 ? "Photo" : "Photos"}
                    </div>

                </div>

                <input
                    type="file"
                    ref={inputRef}
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files) {
                            onUpload(e.target.files);
                        }
                    }}
                />
                <Button
                    disabled={uploadLoading}
                    size="icon"
                    className={`h-11 w-11 rounded-full ${uploadLoading ? "": ""}`}
                    onClick={() => inputRef.current?.click()}
                >
                    {uploadLoading ? <Spinner /> : <Plus className="h-5 w-5" />}
                </Button>

            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Description */}
            <div className="space-y-2">

                <h2 className="text-lg font-medium">
                    Show guests what your place looks like
                </h2>

                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    Upload high-quality photos that highlight your property.
                    The first photo will automatically be used as the cover photo on your listing.
                </p>

            </div>

        </div>
    );
}