"use client";
import { Trash2 } from "lucide-react";
import Image from "next/image";

interface PhotoGridProps {
    photos: string[];
    onPreview: (image: string) => void;
    onDelete: (image: string) => void;
    // onDelete: () => void;
    // onPreview: () => void;
}

export default function PhotoGrid({
    photos,
    onPreview,
    onDelete,
}: PhotoGridProps) {

    return (
        <div className="grid sm:grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo, index) => (
                <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border bg-muted active:cursor-grabbing">
                    <Image
                        src={photo}
                        alt="Listing photo"
                        fill
                        sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onClick={() => onPreview(photo)}
                    />

                    {/* {isCover && (
                        <div className="absolute left-3 bottom-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                            Cover
                        </div>
                    )} */}

                    {/* Delete Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(photo);
                        }}
                        className="
                            absolute left-3 top-3
                            flex h-9 w-9 items-center justify-center
                            rounded-full bg-white/90 shadow-md
                            opacity-0 transition-all
                            hover:bg-red-500 hover:text-white
                            group-hover:opacity-100
                            "
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Hover Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>
            ))}
        </div>
    );
}