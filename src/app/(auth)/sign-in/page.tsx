'use client';
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { Form, SubmitHandler, useForm } from "react-hook-form"

type Inputs = {
  Username: string,
  Password: string
}

export default function SignIn() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (userData) => {
    const { data, error } = await authClient.signIn.username({
      username: userData.Username,
      password: userData.Password,
    });

    router.push("/dashboard");
  }

  const handleClick = async () => {
    await authClient.signIn.social({
      provider: "google",
      errorCallbackURL: "/error",
    });
  }

  const handleSignUp = () => {
    router.push("/sign-up")
  }

  return (
    <>
      <div className="flex justify-center min-h-[80vh] overflow-hidden">
        <div className="flex max-w-5xl border-0 rounded-2xl bg-emerald-50 w-full  relative">
          <div className="flex flex-col lg:w-1/2 gap-5 px-6 py-8 relative w-full">
            <div className="flex flex-col justify-center items-center gap-1">
              <div>
                <img className="h-20" src="appIcon.svg" alt="App Icon" />
              </div>
              <div className="text-2xl font-bold text-center">Log In</div>
              <h4 className="text-gray-500">Welcome back! Enter your details</h4>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-8">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" htmlFor="Username">Username</label>
                <input className="border py-2 rounded-md border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text" {...register("Username")} placeholder="Enter your username" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium" htmlFor="Username">Password</label>
                <input className="border py-2 rounded-md border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password" {...register("Password")} placeholder="Enter your password" />
                <div className="text-sm text-blue-700 cursor-pointer hover:text-blue-950">Forgot Password?</div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-700 text-white font-bold py-2 rounded-full hover:bg-blue-800 transition"
              >
                Log In
              </button>
            </form>
            <div className="flex items-center mb-6 mt-3">
              <div className="grow border-t border-gray-300"></div>
              <span className="mx-2 text-xs text-gray-500">OR</span>
              <div className="grow border-t border-gray-300"></div>
            </div>
            <div>
              <button onClick={handleClick} className="flex items-center justify-center gap-3 w-full border border-gray-300 p-3 rounded-md font-semibold text-gray-700 hover:bg-gray-50">
                <img src="googleIcon.svg" alt="" />
                <div>Continue with Google</div>
              </button>
              <h4 className="mt-3 text-center text-sm">Don't have account?{" "}
                <span onClick={handleSignUp} className="text-blue-600 underline font-bold cursor-pointer">Sign up</span>
              </h4>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2">
            <img
              src="signupImage.jpg"
              alt="Signup"
              className="object-cover rounded-2xl w-full h-full"
            />
          </div>

        </div>

      </div>


    </>
  );
}