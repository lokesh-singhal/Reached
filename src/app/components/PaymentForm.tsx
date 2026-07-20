'use client'
import { divIcon } from "leaflet"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import DateRangePicker from "./DateRangePicker"
import { useState } from "react"
import GuestPopover from "./GuestsPop"
import { Spinner } from "./ui/spinner"
import { toast } from "sonner"

type Inputs = {
    checkInDate: string
    checkOutDate: string
    guest: number
}

type cardProps = {
    price?: number,
    maxGuests?: number,
    listingId?: string
}
const PaymentForm = ({ price, maxGuests, listingId }: cardProps) => {
    const {
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            guest: 1
        }
    });
    const router = useRouter();
    const [showCalendar, setShowCalendar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showGuests, setShowGuests] = useState(false)

    const today = new Date().toISOString().split("T")[0];
    const checkIn = watch("checkInDate");
    const checkOut = watch("checkOutDate");
    const guests = watch("guest");

    const refundDate = checkIn
        ? new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() - 5))
        : null;

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!checkIn || !checkOut) {
            toast.warning("Please enter valid dates", {
                style: {
                    background: "red",
                }
            });
            return;
        }
        try {
            const res = await fetch(`/api/listings/${listingId}/availability`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.available) {
                setIsLoading(true);
                router.push(`/book/${listingId}?checkIn=${data.checkInDate}&checkOut=${data.checkOutDate}&guests=${data.guest}`);
            } else {
                toast.error("Booking not available for this date", {
                    style: {
                        background: 'red',
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <div className="mb-6">
                {!checkIn ? (
                    <div className='text-3xl font-semibold'>Add dates for prices</div>
                ) : (
                    <span className='text-xl'><span className='text-3xl font-semibold underline'>
                        ₹{price && price * ((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}</span>
                        {" "}for {((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                )
                }
            </div>
            <form className='p-4 px-6' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-4 relative'>
                    <div className='grid grid-rows-2 gap-1 border bg-gray-200 border-none relative rounded-xl  overflow-hidden'>
                        <div className='grid grid-cols-2 gap-1 justify-between relative rounded-xl'>
                            <div className='flex flex-col bg-gray-50 p-4'>
                                <label className='text-xl font-semibold mb-2' htmlFor="CHECK-IN">CHECK-IN</label>
                                <button type="button" onClick={() => setShowCalendar(true)} className="text-left cursor-pointer">
                                    {checkIn || "Add Dates"}
                                </button>
                            </div>
                            <div className='flex flex-col bg-gray-50 p-4'>
                                <label className='text-xl font-semibold mb-2' htmlFor="CHECKOUT">CHECK-OUT</label>
                                <button type="button" onClick={() => setShowCalendar(true)} className="text-left cursor-pointer">
                                    {checkOut || "Add Dates"}
                                </button>
                            </div>
                        </div>
                        <div className='bg-gray-50 flex flex-col w-full p-4 py-2'>
                            <label className="text-xl font-semibold mb-2" htmlFor="Guests">Guests</label>
                            <button defaultValue={1} onClick={() => setShowGuests(true)} type="button" className="text-left cursor-pointer">
                                {guests} Guest{guests > 1 ? "s" : ""}
                            </button>
                        </div>
                    </div>
                    {showCalendar && (
                        <div className="absolute right-0 w-190 z-50">
                            <DateRangePicker
                                listingId={listingId}
                                checkInDate={new Date(checkIn)}
                                checkOutDate={new Date(checkOut)}
                                setShowCalendar={setShowCalendar}
                                onSave={(range) => {
                                    setValue(
                                        "checkInDate",
                                        range.from!.toISOString().split("T")[0],
                                        { shouldValidate: true }
                                    );

                                    setValue(
                                        "checkOutDate",
                                        range.to!.toISOString().split("T")[0],
                                        { shouldValidate: true }
                                    );
                                }}
                            />
                        </div>
                    )}
                    {showGuests && (
                        <div className="absolute w-120 right-26 border shadow-xl rounded-2xl overflow-hidden border-black top-25">
                            <GuestPopover
                                showGuests={showGuests}
                                setShowGuests={setShowGuests}
                                maxGuests={maxGuests}
                                onSave={(gue) => {
                                    setValue(
                                        "guest",
                                        gue,
                                        { shouldValidate: true }
                                    );
                                }}

                            />
                        </div>
                    )}
                    {checkIn && (
                        < div className=' text-center bg-gray-100 rounded-md p-1'>
                            {refundDate! > new Date() ? (
                                <div>Free Cancellation before {refundDate?.toISOString().split("T")[0]}</div>
                            ) : (
                                <div>No Cancellation Available</div>
                            )
                            }
                        </div>
                    )}
                    <button disabled={isSubmitting || isLoading} className='bg-green-400 disabled:bg-green-200 disabled:cursor-not-allowed p-3 rounded-full text-xl font-semibold cursor-pointer flex justify-center' type='submit'>
                        {isSubmitting || isLoading === true ? <Spinner className="size-6" /> : "Reserve"}
                    </button>
                    <div className='text-center text-[15px]'>You won't be charget yet</div>
                </div>
                {/* errors will return when field validation fails  */}
                {/* {errors.checkInDate && <span>This field is required</span>} */}
            </form >
        </>
    )
}

export default PaymentForm
