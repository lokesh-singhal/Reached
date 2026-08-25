'use client'
import { Users, IndianRupee } from "lucide-react";
import { useFormContext, useFormState } from "react-hook-form";


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

export default function PropertyDetails() {
  const {
    register, control
  } = useFormContext<ListingForm>();
  const { errors } = useFormState({ control })
  return (
    <section className="">
      <div>
        <h2 className="text-xl font-semibold">
          Property details
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Tell guests about your property and set its basic details.
        </p>
      </div>

      <div className="mt-6 space-y-5">

        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium"
          >
            Property title
          </label>

          <input
            {...register("title", {
              required: "Property title is required"
            })}
            placeholder="e.g. Modern 2BHK Apartment"
            className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>

          <textarea
            {...register("description", {
              required: "Property description is required"
            })}
            rows={5}
            placeholder="Describe your property, its amenities, and what makes it special..."
            className="w-full resize-none rounded-lg border bg-background px-3 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">

          <div>
            <label
              htmlFor="maxGuests"
              className="mb-2 block text-sm font-medium"
            >
              Maximum guests
            </label>

            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="number"
                {...register("maxGuests", {
                  required: "Maximum guests is required",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "At least 1 guest is required"
                  },
                  max: {
                    value: 10,
                    message: "Maximum guest never be greater than 10"
                  }
                })}
                placeholder="4"
                className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
            {errors.maxGuests && (
              <p className="mt-1 text-sm text-red-500">
                {errors.maxGuests.message}
              </p>
            )}
            <p className="mt-1.5 text-xs text-muted-foreground">
              How many guests can stay at the property?
            </p>
          </div>
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium"
            >
              Price per night
            </label>

            <div className="relative">
              <div>
                <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="number"
                  {...register("price", {
                    required: "Property price is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Price must be greater than 0",
                    },
                  })}
                  placeholder="2500"
                  className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
            {errors.price && (
              <p className="mt-1 min-h-5 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
            <p className="mt-1.5 text-xs text-muted-foreground">
              The amount guests will pay for one night.
            </p>
          </div>
        </div>

      </div>
    </section >
  );
}