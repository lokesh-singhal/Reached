"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import CreateInputListing from "@/types/CreateInputListing";
import { toast } from "sonner";


interface DescriptionEditorProps {
    originalDescription: string;
    onSave: (updates: Partial<CreateInputListing>) => Promise<void>;
}

export default function DescriptionEditor({
    originalDescription,
    onSave,
}: DescriptionEditorProps) {
    const [description, setDescription] = useState<string>(originalDescription);
    const [isSaving, setIsSaving] = useState(false);

    const handleCancel = () => {
        setDescription(originalDescription);
    };

    const handleSave = async () => {
        if(description.trim() === originalDescription.trim()){
            toast.message("Nothing to save");
            return;
        }

        try {
            setIsSaving(true);

            await onSave({
                description: description.trim(),
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-30 lg:ml-30 ml-5 max-w-3xl space-y-8">
            <div>
                <h1 className="text-5xl font-semibold">
                    Description
                </h1>

                <p className="mt-2 text-xl text-neutral-500">
                    Share what makes your place special. Tell guests
                    about the space, nearby attractions, or anything
                    else they'd like to know.
                </p>
            </div>

            <div>
                <Textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    maxLength={500}
                    rows={5}
                    className="resize-none w-full text-2xl!"
                    placeholder="Describe your place..."
                />
                {/* <textarea value={description} maxLength={500} rows={10} onChange={(e) => setDescription(e.target.value)} name="description" id=""></textarea> */}

                <p className="mt-2 text-right text-sm text-neutral-500">
                    {description.length}/500
                </p>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                >
                    Cancel
                </Button>

                <Button
                    disabled={isSaving}
                    onClick={handleSave}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    );
}