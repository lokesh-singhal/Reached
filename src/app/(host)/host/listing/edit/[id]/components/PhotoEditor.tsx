"use client";

import { useState } from "react";
import PhotoHeader from "./PhotoHeader";
import PhotoGrid from "./PhotoGrid";
import PhotoPreviewDialog from "./PhotoPreviewDialog";
import CreateInputListing from "@/types/CreateInputListing";

interface PhotoEditorProps {
    uploadLoading: boolean
    photos: string[];
    onUpload: (files: FileList) => void;
    onDelete: (image: string) => void;
    onSave: () => void;
}

export default function PhotoEditor({
    uploadLoading,
    photos,
    onUpload,
    onDelete,
    onSave,
}: PhotoEditorProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);


    return (
        <section className="mx-auto mt-10 relative w-full max-w-7xl">

            <PhotoHeader
                uploadLoading={uploadLoading}
                totalPhotos={photos.length}
                onUpload={onUpload}
            />

            <div className="mt-6 rounded-2xl border bg-card p-6">

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Guests will see these photos on your listing.
                    </p>
                    <button disabled={uploadLoading} onClick={onSave} className={`font-semibold cursor-pointer hover:underline disabled:text-black/70 disabled:cursor-not-allowed`}>Save</button>
                </div>

                <div className="mt-8">

                    <PhotoGrid
                        photos={photos}
                        onPreview={setPreviewImage}
                        onDelete={onDelete}
                    />

                </div>

            </div>

            <PhotoPreviewDialog
                image={previewImage}
                open={previewImage !== null}
                onClose={() => setPreviewImage(null)}
            />

        </section>
    );
}