'use client'

import { Button } from "@/app/components/ui/button";
import CreateInputListing from "@/types/CreateInputListing";
import { useState } from "react";
import { toast } from "sonner";

interface GuestProp {
    originalGuests: number,
    onSave: (updates: Partial<CreateInputListing>) => Promise<void>,
}
export default function GuestEditor({originalGuests, onSave}: GuestProp) {
    const [guests, setGuests] = useState<number>(originalGuests);
    const handleSave = async() => {
        if(guests === originalGuests){
            toast.message("Nothing to change");
            return;
        }

        await onSave({maxGuests: guests});
    }
    return (
        <div className="lg:ml-30 ml-5 mt-30 max-w-3xl space-y-8">
            <div>
                <h1 className="text-5xl font-semibold">Guests</h1>
                <p className="mt-2 text-xl text-neutral-500">
                    Set the maximum number of guests your place can accommodate.
                </p>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-6">
                <div>
                    <h2 className="text-2xl font-medium">Guests</h2>
                    <p className="text-neutral-500">
                        Maximum guests allowed
                    </p>
                </div>

                <div className="flex items-center gap-5">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={guests <= 1}
                        onClick={() =>
                            setGuests(prev => prev - 1)
                        }
                    >
                        -
                    </Button>

                    <span className="w-8 text-center text-2xl font-medium">
                        {guests}
                    </span>

                    <Button
                        variant="outline"
                        size="icon"
                        disabled={guests >= 10}
                        onClick={() =>
                            setGuests(prev => prev + 1)
                        }
                    >
                        +
                    </Button>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={() => setGuests(originalGuests)}
                >
                    Cancel
                </Button>

                <Button
                    disabled={guests === originalGuests}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </div>
        </div>
    )
}