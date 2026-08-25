"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Camera,
  FileText,
  MapPin,
  IndianRupee,
  Users,
  Type,
  ChevronRight,
  ArrowLeft,
  X,
  Info,
} from "lucide-react";

interface Listing {
  _id?: string,
  description?: string,
  title: string,
  houseImageUrl: string[],
  city: string,
  state: string,
  maxGuests: number
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

const sections = [
  {
    id: "photos",
    title: "Photo Tour",
    subtitle: "12 Photos",
    icon: Camera,
  },
  {
    id: "title",
    title: "Title",
    subtitle: "Cozy Mountain Villa",
    icon: Type,
  },
  {
    id: "guests",
    title: "Guests",
    subtitle: "Up to 6 guests",
    icon: Users,
  },
  {
    id: "description",
    title: "Description",
    subtitle: "Family-friendly villa...",
    icon: FileText,
  },
  {
    id: "location",
    title: "Location",
    subtitle: "Jaipur, Rajasthan",
    icon: MapPin,
  },
  {
    id: "pricing",
    title: "Pricing",
    subtitle: "₹3,500 / night",
    icon: IndianRupee,
  },
  {
    id: "status",
    title: "Status",
    subtitle: "INACTIVE",
    icon: Info,
  },
];

export default function EditSidebar({ listing, setOpenEditBar }: { listing: Listing | undefined, setOpenEditBar:  React.Dispatch<React.SetStateAction<boolean>> }) {
  listing && (
    sections[0].subtitle = `${listing.houseImageUrl.length} Photos`,
    sections[1].subtitle = listing.title,
    sections[2].subtitle = `Up to ${listing.maxGuests} guests`,
    sections[3].subtitle = listing && listing.description!,
    sections[4].subtitle = `${listing.city}, ${listing.state}`,
    sections[5].subtitle = `${listing.price} / night`,
    sections[6].subtitle = `${listing.status}`
  )

  const searchParams = useSearchParams();
  const router = useRouter();

  const active = searchParams.get("section") || "photos";

  return (
    <aside className="lg:w-100 relative">
      <div className="space-y-4 flex gap-4">
        <div className="max-lg:hidden">
          <ArrowLeft onClick={() => router.replace("/host/listing")} size={35} className="bg-gray-200 rounded-full p-1" />
        </div>
        <div onClick={() => setOpenEditBar(false)} className="absolute top-1 right-2 md:hidden">
          <X />
        </div>
        <div className="lg:flex-1">
          <h2 className="text-3xl font-semibold">
            Edit Listing
          </h2>
          {sections.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={`?section=${item.id}`}
                onClick={() => setOpenEditBar(false)}
              >
                <div
                  className={`group m-3 shadow-md rounded-2xl max-lg:w-60 p-4 transition-all  hover:shadow-sm ${active === item.id
                    ? "border-black bg-muted"
                    : ""
                    }`}
                >
                  <div className="flex items-start justify-between">

                    <div className="flex gap-4">

                      <div
                        className={`rounded-xl p-3 ${active === item.id
                          ? "bg-black text-white"
                          : "bg-muted"
                          }`}
                      >
                        <Icon size={20} />
                      </div>

                      <div>

                        <h3 className="font-semibold">
                          {item.title}
                        </h3>

                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {item.subtitle}
                        </p>

                      </div>

                    </div>

                    <ChevronRight
                      className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                      size={18}
                    />

                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}