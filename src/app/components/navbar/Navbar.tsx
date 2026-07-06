'use client'
import { HtmlHTMLAttributes, useEffect, useRef, useState } from 'react'
import DropDown from '../DropDown'

const Navbar = () => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

    }
  }, [])

  return (
    <div >
      <div className='flex w-full h-[12%] bg-gray-200 p-6 px-10 justify-between items-center '>
        <div className='flex justify-center items-center'>
          <img className='h-18' src="appIcon.svg" alt="App Logo" />
          <span className='text-2xl'>Reached</span>
        </div>
        <div className='flex border w-[40%] border-gray-100 shadow-2xl bg-white rounded-full justify-between items-center relative'>
          <input className='hover:bg-gray-500 p-6 px-8 rounded-full  focus:outline-none focus:shadow focus:border-0 focus:bg-gray-100' type="text" placeholder='Add Destination' />
          <input className='hover:bg-gray-500 p-6 px-8 rounded-full focus:outline-none focus:shadow focus:border-0 focus:bg-gray-100' type="text" placeholder='Add Dates' />
          <div className='flex justify-center items-center right-2  rounded-full'>
            <input className=' p-6 px-8 hover:bg-gray-500 rounded-full focus:outline-none focus:shadow focus:border-0 focus:bg-gray-100' type="text" placeholder='Add Guests' />
            <button className='cursor-pointer h-14 w-14 rounded-full bg-green-500 absolute right-2 flex items-center justify-center'><img className='h-10 w-10' src="search.svg" alt="" /></button>
          </div>
        </div>
        <div className='flex gap-4 items-center justify-center pr-3'>
          <div className='text-[18px]'>Become a host</div>
          <div className='h-10 w-10 rounded-full bg-green-500'><img src="/png" alt="" /></div>
          <div ref={dropDownRef} className='relative'>
            <button onClick={() => setIsOpen(prev => !prev)}>
              <img className='h-8 cursor-pointer' src="bar.svg" alt="" />
            </button>
            {isOpen && <DropDown isOpen={isOpen} setIsOpen={setIsOpen} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
