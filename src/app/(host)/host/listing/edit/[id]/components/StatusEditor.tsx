'use client'
import { Button } from "@/app/components/ui/button";
import CreateInputListing from "@/types/CreateInputListing";
import { useState } from "react";
import { toast } from "sonner";


interface statusEditorProps {
    originalStatus: string,
    onSave: (updates: Partial<CreateInputListing>) => Promise<void>
}


const statuses = [
    {
        value: "ACTIVE",
        title: "Active",
        description:
            "Your listing is visible to guests and can receive bookings.",
    },
    {
        value: "INACTIVE",
        title: "Inactive",
        description:
            "Your listing is hidden from guests and cannot receive bookings.",
    },
];


export default function StatusEditor({ originalStatus, onSave }: statusEditorProps) {
    const [status, setStatus] = useState<string>(originalStatus);
    const [isSaving, setIsSaving] = useState(false);
    const handleSave = async () => {
        if (status === originalStatus) {
            toast.message("Nothing to save");
            return;
        }

        try {
            setIsSaving(true);
            await onSave({ status });
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="lg:ml-30 ml-5 mt-30 max-w-3xl space-y-8">
            {statuses.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    onClick={() => setStatus(item.value)}
                    className={`w-full rounded-xl border p-5 text-left transition ${status === item.value
                        ? "border-black bg-neutral-50"
                        : "hover:border-neutral-400"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {item.title}
                            </h3>

                            <p className="mt-1 text-sm text-neutral-500">
                                {item.description}
                            </p>
                        </div>

                        <div
                            className={`h-5 w-5 rounded-full border-2 ${status === item.value
                                ? "border-black bg-black"
                                : "border-neutral-400"
                                }`}
                        />
                    </div>
                </button>
            ))}

            <div className="flex justify-end gap-3">
                <Button
                    disabled={isSaving}
                    onClick={handleSave}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    )
}