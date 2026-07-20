'use client'
import AllReviews from '@/app/components/AllReviews'
import PaymentForm from '@/app/components/PaymentForm'
import ShowReservations from '@/app/components/ShowReservations'
import { Images, Star, UserRound } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const MapPlain = dynamic(() => import("@/app/components/MapPlain"), {
  ssr: false,
})

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
}

interface Reviews {
  _id: string,
  comment: string,
  rating: number,
  reviewerId: {
    name: string,
  }
  createdAt: string
}

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing>();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showAllReview, setShowAllReview] = useState(false);
  const [allReviews, setAllReviews] = useState<Reviews[]>([]);
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const checkOverflow = () => {
      if (el) {
        setIsOverflowing(el.scrollHeight > el.clientHeight);
      }
    }

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => {
      observer.disconnect();
    }
  }, [allReviews]);

  useEffect(() => {
    const particularListing = async () => {
      const data = await fetch(`/api/listings/${params.id}`);
      const res = await data.json();
      setListing(res);
    }

    particularListing();
  }, [params])

  useEffect(() => {
    const getAllReviews = async () => {
      try {
        const res = await fetch(`/api/listings/${params.id}/review`);
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setAllReviews(data);
      } catch (error) {
        console.log(error);
      }
    }

    getAllReviews();
  }, [])
  const averageRating: number = allReviews.length > 0 ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length: 0;

  if (!listing) {
    return <div className='mx-auto'>Wait while loading listing...</div>
  }

  return (
    <div className='w-full mt-10 max-w-7xl md:mx-auto px-1 flex flex-col gap-10'>
      <div className='flex flex-col md:flex-row lg:gap-20 gap-10 '>
        <div className='flex flex-col gap-5 md:w-1/2'>
          <div className=''>
            <h1 className='text-4xl font-semibold'>{listing?.title}</h1>

          </div>
          <div className='w-full relative'>
            <img className='aspect-5/4 rounded-xl' src={listing?.houseImageUrl[0]} alt="" />
            <button onClick={() => router.push(`/rooms/${params.id}/all`)} className='absolute bottom-3 right-3 rounded-xl z-10 p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer flex gap-1'>
              <span><Images /></span>
              <span>Show all photos</span>
            </button>
          </div>
          <div className='flex flex-col'>
            <span className='text-3xl font-semibold'>{listing?.description} in {listing?.city}, {listing?.state}</span>
            <span className='text-2xl'>{listing?.maxGuests} guests • {averageRating} rating</span>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='h-10 w-10 rounded-full bg-gray-300'>
              <img src="profile.svg" alt="" />
            </div>
            <div className='flex flex-col'>
              <span className='font-semibold'>Hosted by {listing?.host.name}</span>
              <span>{listing?.host.email}</span>
            </div>
          </div>
        </div>
        <div className='md:w-1/2'>
          <div className='min-h-[50vh] bg-gray-200 rounded-2xl mt-15 p-2 lg:p-6 lg:pr-15'>
            <PaymentForm listingId={listing?._id} price={listing?.price} maxGuests={listing?.maxGuests} />
          </div>
        </div>
      </div>
      <div className='w-full h-px bg-gray-300'></div>
      {allReviews?.length === 0 ? (
        <div className='text-xl font-semibold'>
          No reviews to show
        </div>
      ) : (
        <div>
          <div className='relative'>
            {showAllReview && (
              <div className='fixed inset-0 bg-black/50 z-1001'></div>
            )}
            {showAllReview && (
              <div className='z-1001 fixed rounded-xl bg-gray-100
                              left-0 right-0 bottom-0 top-2
                              sm:top-10 sm:bottom-0 sm:left-5 sm:right-5
                              md:w-1/2 md:h-auto md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 '>
                <AllReviews allReviews={allReviews} setShowAllReview={setShowAllReview} averageRating={averageRating} />
              </div>
            )}
            <h1 className='text-3xl font-semibold mb-8'>⭐{averageRating}●{allReviews.length} Review{allReviews.length > 1 ? "s" : ""}</h1>
            <div className='grid md:grid-cols-2 max-sm:grid-flow-col max-sm:overflow-scroll no-scrollbar'>
              {allReviews.map((review) => (
                <div className='sm:mr-40 px-2 max-sm:w-80'>
                  <div className='flex items-center gap-3'>
                    <UserRound className='w-10 h-10 bg-gray-200 rounded-full' />
                    <p className='sm:text-xl font-semibold'>{review.reviewerId.name.split(" ")[0]}</p>
                  </div>
                  <div className='flex'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star width={15} className={star <= review.rating ? "fill-black" : ""} />
                    ))}
                    <span className='ml-2'>{review.createdAt.split("T")[0]}</span>
                  </div>
                  <div ref={textRef} className='sm:text-xl line-clamp-3'>
                    {review.comment}
                  </div>
                  {isOverflowing && (
                    <button onClick={() => setShowAllReview(true)} className='mt-3 sm:text-xl font-semibold underline cursor-pointer'>Show More</button>
                  )}
                </div>
              ))}
            </div >
            {allReviews.length > 6 && (
              <div className='max-sm:px-4 mt-5'>
                <button onClick={() => setShowAllReview(true)} className='text-xl max-sm:w-full font-semibold bg-gray-200 rounded-xl p-4 px-6 cursor-pointer'>Show all reviews</button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className='w-full h-px bg-gray-300'></div>
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>
          Where you'll be
        </h1>
        <p className='text-2xl'>{listing?.city}, {listing?.state}</p>
        <div className='h-150 mb-20'>
          {listing && <MapPlain listing={listing} />}
        </div>
      </div>
    </div>
  )
}

