'use client';
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";


type Inputs = {
    Name: string,
    Email: string,
    Password: string,
    Username: string
}

export default function signUp() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (userData) => {
        const { data, error } = await authClient.signUp.email({
            email: userData.Email,
            password: userData.Password,
            name: userData.Name,
            username: userData.Username
        }, {
            onRequest: (ctx) => {
                console.log("Loading...");
            },
            onSuccess: (ctx) => {
                redirect("/sign-in");
            },
            onError: (ctx) => {
                console.log(ctx.error.message);
            },
        });
    }

    const handleClick = async () => {
        await authClient.signIn.social({
            provider: "google",
            errorCallbackURL: "/error",
        });
    }

    const handleSignIn = () => {
        router.push("/sign-in");
    }

    const formFields = [
        { name: "Username", label: "Username", type: "text" },
        { name: "Name", label: "Full Name", type: "text" },
        { name: "Email", label: "Email Address", type: "email" },
        { name: "Password", label: "Password", type: "password" },
    ];

    return (
        <>
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="flex w-full max-w-5xl bg-white rounded-2xl overflow-hidden">

                    <div className="w-full bg-emerald-50 lg:w-1/2 flex flex-col px-6 sm:px-10 py-8">
                        <div className="flex flex-col items-center gap-3">
                            <img className="h-20" src="appIcon.svg" alt="App Icon" />
                            <h2 className="text-2xl font-bold text-center">
                                Create an Account
                            </h2>

                            <button onClick={handleClick} className="flex items-center justify-center gap-3 w-full border border-gray-300 p-3 rounded-md font-semibold text-gray-700 hover:bg-gray-50">
                                <img src="googleIcon.svg" alt="" />
                                <div>Create account with Google</div>
                            </button>
                        </div>

                        <div className="flex items-center my-6">
                            <div className="grow border-t border-gray-300"></div>
                            <span className="mx-2 text-xs text-gray-500">OR</span>
                            <div className="grow border-t border-gray-300"></div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            {formFields.map((field) => (
                                <div className="flex flex-col gap-1" key={field.name}>
                                    <label htmlFor={field.name} className="text-sm font-medium">
                                        {field.label}
                                    </label>
                                    <input
                                        id={field.name}
                                        className="border py-2 rounded-md border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                                        type={field.type}
                                        {...register(field.name as keyof Inputs)}
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full bg-blue-700 text-white font-bold py-2 rounded-full hover:bg-blue-800 transition"
                            >
                                Create an Account
                            </button>
                        </form>

                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <span onClick={handleSignIn} className="text-blue-800 underline font-bold cursor-pointer">
                                Login
                            </span>
                        </div>
                    </div>

                    <div className="hidden lg:block lg:w-1/2">
                        <img
                            src="1747377312324.jpg"
                            alt="Signup"
                            className="object-cover w-full h-full"
                        />
                    </div>

                </div>
            </div>
        </>
    );

}
