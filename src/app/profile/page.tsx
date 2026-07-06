

export default function Profile() {
  return (
    <>
      <div className="flex w-full h-[calc(100vh-100px)]">
        <div className="lg:w-[35%] lg:flex flex-col items-center pt-20  hidden">
          <div className="w-80">
            <h1 className="text-4xl mb-10 font-bold">Profile</h1>
            <div className="flex items-center gap-5 bg-gray-200 p-3 rounded-2xl">
              <div><img className="rounded-full bg-red-600 h-10 w-10" src="kk/png" alt="" /></div>
              <div className="text-xl font-semibold">About Me</div>
            </div>
          </div>
        </div>
        <div className="lg:w-2 lg:bg-gray-200 max-md:hidden"></div>
        <div className="lg:w-[65%]  w-full">
          <div className="flex flex-col sm:p-20 sm:pl-40 p-10 gap-8">
            <div className="text-4xl font-semibold">About Me</div>
            <div className="w-full">
              <div className="bg-gray-100 w-100 flex flex-col items-center py-8 rounded-xl shadow-2xl">
                <img className="h-30 w-30 rounded-full bg-blue-700" src="ll/png" alt="" />
                <h1 className="text-4xl mt-2 font-semibold">Lokesh</h1>
                <p>Guest</p>
              </div>
            </div>
            <div className="w-full h-px bg-gray-500"></div>
            <div className="w-80 flex gap-5 p-4 rounded-xl hover:bg-gray-100 items-center cursor-pointer">
              <img className="h-6" src="review.svg" alt="" />
              <p className="text-xl">Show reviews I've written</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
