'use client'

import EditSidebar from "./components/EditSideBar";
import PhotoEditor from "./components/PhotoEditor";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TitleEditor from "./components/TitleEditor";
import CreateInputListing from "@/types/CreateInputListing";
import GuestEditor from "./components/GuestEditor";
import DescriptionEditor from "./components/DescriptionEditor";
import LocationEditor from "./components/LocationEditor";
import PriceEditor from "./components/PriceEditor";
import { se } from "date-fns/locale";
import { Menu } from "lucide-react";
import StatusEditor from "./components/StatusEditor";

interface Listing {
    _id?: string,
    description?: string,
    title: string,
    houseImageUrl: string[],
    address: string,
    city: string,
    state: string,
    location: {
        coordinates: [number, number],
    },
    maxGuests: number,
    host: {
        name: string,
        email: string,
    },
    price: number,
    averageRating: number,
    status: string,
    booking: {
        checkIn: Date,
    },
    totalBookings: number,
    totalIncome: number,
    totalReviews: number,
}

export default function Edit() {
    const [listing, setListing] = useState<Listing>();
    const [photos, setPhotos] = useState<string[]>([]);
    const [editedPhotos, setEditedPhotos] = useState<string[]>([]);
    const [openEditBar, setOpenEditBar] = useState(false);
    const searchParams = useSearchParams();
    const [uploadLoading, setUploadLoading] = useState(false);
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const section = searchParams.get("section");
    useEffect(() => {
        const getListing = async () => {
            const res = await fetch(`/api/listings/${params.id}`);
            const data = await res.json();
            setListing(data);
            console.log(data);
            setPhotos(data.houseImageUrl);
            setEditedPhotos(data.houseImageUrl);
        }

        getListing();
    }, [])


    const handleUpload = async (files: FileList) => {
        try {
            setUploadLoading(true);
            const formData = new FormData();

            Array.from(files).forEach((file) => {
                formData.append("images", file)
            });

            const res = await fetch("/api/upload/cloudinary", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                toast.error("Something went wrong while uploading the images", {
                    style: {
                        backgroundColor: 'red'
                    }
                })
            }

            const data = await res.json();

            console.log(data);
            setEditedPhotos((prev) => [...prev, ...data.urls]);
        } catch (error) {
            console.log(error);
        } finally {
            setUploadLoading(false);
        }

    }

    const handleSave = async (
        updates: Partial<CreateInputListing>
    ): Promise<void> => {
        if (Object.keys(updates).length === 0) {
            toast.message("No changes to save");
            return;
        }
        const res = await fetch(`/api/listings/${params.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                updates
            )
        })

        if (!res.ok) {
            toast.error("Failed to update the changes", {
                style: {
                    backgroundColor: 'red',
                }
            })

            return;
        }

        window.location.reload();
    }

    const handleDelete = (image: string) => {
        setEditedPhotos((prev) => prev.filter((item) => item !== image));
    }

    return (
        <div className="lg:mx-15 p-10 relative">
            <div className="flex">
                <div className="hidden md:block">
                    <EditSidebar setOpenEditBar={setOpenEditBar} listing={listing} />
                </div>
                <div className="md:hidden">
                    <div onClick={() => setOpenEditBar(true)} className="absolute top-4 left-4">
                        <Menu size={25} />
                    </div>
                    {openEditBar && (
                        <div className="absolute z-1010 overflow-auto bg-gray-50 shadow-xl top-0 left-0 bottom-0 p-4">
                            <EditSidebar setOpenEditBar={setOpenEditBar} listing={listing} />
                        </div>
                    )}
                </div>

                {listing && (
                    <div className="flex-1 max-md:h-[calc(100vh-184px)]">
                        {
                            (section === null || section === "photos") && (
                                <PhotoEditor
                                    uploadLoading={uploadLoading}
                                    photos={editedPhotos}
                                    onUpload={handleUpload}
                                    onDelete={handleDelete}
                                    onSave={() => {
                                        if (editedPhotos === photos) {
                                            toast.message("No changes to save");
                                            return;
                                        }
                                        handleSave({ houseImageUrl: editedPhotos })
                                    }}
                                />
                            )
                        }
                        {
                            section === "title" && (
                                <TitleEditor
                                    originalTitle={listing.title}
                                    params={params.id}
                                    onSave={handleSave}
                                />
                            )
                        }
                        {
                            section === "guests" && (
                                <GuestEditor
                                    originalGuests={listing.maxGuests}
                                    onSave={handleSave}
                                />
                            )
                        }
                        {
                            section === "description" && (
                                <DescriptionEditor
                                    originalDescription={listing.description!}
                                    onSave={handleSave}
                                />
                            )
                        }
                        {
                            section === "location" && (
                                <LocationEditor
                                    originalAddress={listing.address}
                                    originalCity={listing.city}
                                    originalCoordinates={listing.location.coordinates}
                                    originalState={listing.state}
                                    onSave={handleSave}
                                />
                            )
                        }
                        {
                            section === "pricing" && (
                                <PriceEditor
                                    originalPrice={listing.price}
                                    onSave={handleSave}
                                />
                            )
                        }
                        {
                            section === "status" && (
                                <StatusEditor 
                                    originalStatus={listing.status}
                                    onSave={handleSave}
                                />
                            )
                        }
                    </div>
                )}
            </div>
        </div>
    )
}