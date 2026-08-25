"use client";

import Image from "next/image";

import {
    Dialog,
    DialogContent,
} from "@/app/components/ui/dialog";

interface PhotoPreviewDialogProps {
    image: string | null;
    open: boolean;
    onClose: () => void;
}

export default function PhotoPreviewDialog({
    image,
    open,
    onClose,
}: PhotoPreviewDialogProps) {
    if (!image) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                showCloseButton
                className="w-[48vw] max-w-[80vw]! h-[80vh] bg-black/80 p-0 shadow-none"
            >
                <div className="relative h-full w-full">
                    <Image
                        src={image}
                        alt="Preview"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}