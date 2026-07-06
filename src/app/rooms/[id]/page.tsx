'use client'
import PaymentForm from '@/app/components/PaymentForm'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Listing {
  _id?: string,
  description?: string,
  title: string,
  houseImageUrl: string[],
  city: string,
  state: string,
  maxGuests: number
  host:{
    name: string,
    email: string,
  },
  price: number
}

export default function RoomPage() {
  const params = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing>();
  useEffect(() => {
    const particularListing = async () => {
      const data = await fetch(`/api/listings/${params.id}`);
      const res = await data.json();
      setListing(res);
    }

    particularListing();
  }, [params])

  return (
    <>
      <div className='flex mx-50 my-10 gap-20'>
        <div className='flex flex-col gap-5 w-1/2'>
          <div className=''>
            <h1 className='text-4xl font-semibold'>{listing?.title}</h1>

          </div>
          <div className=''>
            <img className='w-[40vw]' src={listing?.houseImageUrl[0]} alt="" />
          </div>
          <div className='flex flex-col'>
            <span className='text-3xl font-semibold'>{listing?.description} in {listing?.city}, {listing?.state}</span>
            <span className='text-2xl'>{listing?.maxGuests} guests • 4.5 rating</span>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='h-10 w-10 rounded-full bg-gray-300'>
              <img  src="profile.svg" alt="" />
            </div>
            <div className='flex flex-col'>
              <span className='font-semibold'>Hosted by {listing?.host.name}</span>
              <span>{listing?.host.email}</span>
            </div>
          </div>
        </div>
        <div className='w-1/2'>
          <div className='min-h-[60vh] bg-gray-200 rounded-2xl mt-15 p-6 pr-15'>
            <PaymentForm listingId = {listing?._id} price = {listing?.price} maxGuests = {listing?.maxGuests} />
          </div>
        </div>
      </div>
    </>
  )
}

