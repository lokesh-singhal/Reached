'use client'
import { authClient } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';

export default function DropDown({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  const { data: session, isPending, error } = authClient.useSession();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleLogIn = () => {
    setIsOpen(prev => !prev);
    router.push("/sign-in");
  }

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsLoading(false);
          setIsOpen(false);
          if(pathname === '/'){
            window.location.reload();
          }else{
            router.push("/");
          }
        },
        onError(ctx) {
          toast.error(ctx.error.message, {
            style: {
              background: 'red',
            }
          }),
          setIsLoading(false);
          setIsOpen(false);
        },
        onRequest: () => {
          setIsLoading(true);
        }
      }
    });
  }
  return (
    <>
      {
        session ? (
          <div className='absolute border-white rounded-xl gap-2 py-6 w-2xs shadow-2xl bg-white right-3 mt-4 z-10 flex flex-col justify-start items-start'>
            <button onClick={() => { setIsOpen(prev => !prev); router.push("/wishlist"); }} className='cursor-pointer text-start pl-10 text-[17px] hover:bg-gray-100 w-full py-2'>Wishlist</button>
            <button onClick={() => { setIsOpen(prev => !prev); router.push("/reservations") }} className='cursor-pointer text-start pl-10 text-[17px] hover:bg-gray-100 w-full py-2'>Your Reservations</button>
            <button onClick={() => { setIsOpen(prev => !prev); router.push("/profile") }} className='cursor-pointer text-start pl-10 text-[17px] hover:bg-gray-100 w-full py-2'>Profile</button>
            <div className="w-[80%] h-px bg-gray-300 self-center"></div>
            <button className='cursor-pointer text-start pl-10 text-[17px] hover:bg-gray-100 w-full py-2'>Become a host</button>
            <div className="w-[80%] h-px bg-gray-300 self-center"></div>
            <button
              onClick={handleLogOut} disabled={isLoading} className='cursor-pointer disabled:cursor-not-allowed text-start pl-10 text-[17px] hover:bg-gray-100 w-full py-2'>
              {isLoading ? <Spinner /> : "Logout"}
            </button>
          </div>
        ) : (
          <div className='absolute border-white rounded-xl gap-2 py-6 w-2xs shadow-2xl bg-white right-3 mt-4 z-10 flex flex-col'>
            <button className='cursor-pointer text-[17px] hover:bg-gray-100 pr-22 w-full py-2'>Become a host</button>
            <div className="flex justify-center">
              <div className="w-[80%] h-px bg-gray-300"></div>
            </div>
            <button onClick={handleLogIn} className='cursor-pointer text-[17px] hover:bg-gray-100 pr-20  w-full py-2'>Log in or sign up</button>
          </div>
        )
      }
    </>
  )
}


