"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import CreateInputListing from "@/types/CreateInputListing";
import { toast } from "sonner";


interface PricingEditorProps {
    originalPrice: number;
    onSave: (updates: Partial<CreateInputListing>) => Promise<void>;
}

export default function PriceEditor({
    originalPrice,
    onSave,
}: PricingEditorProps) {
    const [price, setPrice] = useState(originalPrice);
    const [isSaving, setIsSaving] = useState(false);


    const handleCancel = () => {
        setPrice(originalPrice);
    };

    const handleSave = async () => {
        if (price === originalPrice){
            toast.message("Nothing to save");
            return;
        } 

        try {
            setIsSaving(true);

            await onSave({
                price,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="lg:ml-30 ml-5 mt-30 max-w-3xl space-y-8">
            <div>
                <h1 className="text-5xl font-semibold">
                    Price
                </h1>

                <p className="mt-2 text-xl text-neutral-500">
                    Set the nightly price guests will pay before taxes and fees.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Nightly price
                </label>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-neutral-500">
                        ₹
                    </span>

                    <Input
                        type="number"
                        value={price}
                        onChange={(e) =>
                            setPrice(Number(e.target.value))
                        }
                        className="h-16 pl-10 text-2xl! font-semibold"
                    />
                </div>

                <p className="text-sm text-neutral-500">
                    Guests will see this price per night before taxes and service fees.
                </p>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    disabled={isSaving}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>

                <Button
                    disabled={isSaving || price <= 0}
                    onClick={handleSave}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    );
}