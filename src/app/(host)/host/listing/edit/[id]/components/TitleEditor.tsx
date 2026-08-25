import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import CreateInputListing from "@/types/CreateInputListing";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface titleEditorProps {
    originalTitle: string,
    params: string,
    onSave: (updates: Partial<CreateInputListing>) => Promise<void>
}
export default function TitleEditor({originalTitle, params, onSave}:titleEditorProps) {
    const [title, setTitle] = useState<string>(originalTitle || "");
    const router = useRouter();
    const handleCancel = () => {
        setTitle(originalTitle);
    }

    const handleTitleSave = async() => {
        if(originalTitle.trim() === title.trim()){
            toast.message("No changes to saved");
            return;
        }
        await onSave({title});
    }
    return (
        <div className="mt-30 lg:ml-30 ml-5 max-w-3xl space-y-8">
            <div>
                <h1 className="text-5xl font-semibold">Title</h1>
                <p className="mt-2 text-xl text-neutral-500">
                    Guests see your title first. Keep it short and descriptive.
                </p>
            </div>

            <div>
                <Textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={60}
                    rows={2}
                    className="resize-none text-2xl!"
                    placeholder="e.g. Modern apartment with stunning city views"
                />

                <p className="mt-2 text-right text-sm text-neutral-500">
                    {title && title.length}/60
                </p>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>

                <Button
                    disabled={title.trim().length === 0}
                    onClick={handleTitleSave}
                >
                    Save
                </Button>
            </div>
        </div>
    )
}