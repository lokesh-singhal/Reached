'use client'

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PropertyDetails from "./components/PropertyDetails";
import PropertyImages from "./components/PropertyImages";
import PropertyLocation from "./components/PropertyLocation";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Spinner } from "@/app/components/ui/spinner";

interface ListingForm {
    title: string,
    description: string,
    maxGuests: number,
    price: number,
    images: File[],
    address: string,
    city: string,
    state: string,
    coordinates: [number, number]
}

export default function AddListing() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const methods = useForm<ListingForm>({
        defaultValues: {
            title: "",
            description: "",
            maxGuests: 1,
            price: 0,
            images: [],
            address: "",
            city: "",
            state: "",
            coordinates: [77.1025, 28.7041]
        }
    })

    const onSubmit = async(data: ListingForm) => {
        if(data.images.length < 2){
            toast.error("At least two images are required", {
                    style: {
                        backgroundColor: 'red',
                    }
                })
        }
        try {
            setLoading(true);
            const formData = new FormData();
            data.images.forEach((image) => {
                formData.append("images", image);
            })
            const res = await fetch("/api/upload/cloudinary", {
                method: "POST",
                body: formData
            });

            const uploadData = await res.json();
            if(!res.ok){
                toast.error(uploadData.message, {
                    style: {
                        backgroundColor: 'red',
                    }
                })

                return;
            }

            const houseImageUrls = uploadData;
            console.log(houseImageUrls.urls)
            const listingData = {
                title: data.title,
                description: data.description,
                houseImageUrl: houseImageUrls.urls,
                address: data.address,
                city: data.city,
                state: data.state,
                location: {
                    type: "Point",
                    coordinates: data.coordinates,
                },
                maxGuests: data.maxGuests,
                price: data.price
            }
            
            const res2 = await fetch("/api/listings", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(listingData),
            })

            const responseData = await res2.json();
            if(!res2.ok){
                toast.error(responseData.message, {
                    style: {
                        backgroundColor: 'red',
                    }
                })

                return;
            }

            toast.success("Listing created successfully", {
                style: {
                    backgroundColor: 'lightgreen',
                }
            })

            router.replace("/host/listing");
            
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="mx-auto max-w-380 px-4 py-5 md:px-6 lg:px-8 bg-background flex flex-col gap-4">
            <div className="">
                <div className=" flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Add a new listing
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Add your property details and make it available to guests.
                        </p>
                    </div>
                </div>
            </div>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="rounded-xl border bg-background p-5 sm:p-6 flex flex-col gap-10">
                        <PropertyDetails />
                        <PropertyImages />
                        <PropertyLocation />
                    </div>
                    <div className="flex justify-end mt-2">
                        <button
                            disabled={loading}
                            type="submit"
                            className="rounded-lg disabled:cursor-not-allowed disabled:bg-black/60 bg-black px-5 py-2.5 text-sm font-medium text-white"
                        >
                            {loading ? <Spinner /> : "Add Listing"}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}