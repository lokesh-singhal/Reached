"use client";

import { User, Pencil } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { format } from "date-fns";


export default function ProfileSettings() {
    const { data: session } = authClient.useSession();
    if(!session){
        return (
            <div>
                LogIn to get details
            </div>
        )
    }
    return (
        <div className="w-full max-w-8xl mx-auto min-w-0 p-4 sm:p-6 lg:p-16">

            <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr]">

                <aside className="min-w-0 lg:px-20">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Profile
                    </h1>

                    <div className="mt-10">
                        <button
                            className="
                                flex w-full items-center gap-4
                                rounded-xl bg-muted/70
                                px-4 py-3
                                text-left
                                font-medium
                            "
                        >
                            <div className="
                                flex h-10 w-10 shrink-0
                                items-center justify-center
                                rounded-full bg-muted
                            ">
                                <User className="h-5 w-5" />
                            </div>

                            <span>About Me</span>
                        </button>
                    </div>
                </aside>

                <main className="min-w-0">

                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Profile
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Manage your personal information and preferences.
                        </p>
                    </div>

                    <section className="mt-8 rounded-2xl border bg-background p-6 shadow-sm sm:p-8">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-5 min-w-0">

                                <Avatar className="h-24 w-24 shrink-0">
                                    <AvatarImage
                                        // src={user.image}
                                        // alt={user.name}
                                    />

                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        <User className="h-10 w-10" />
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0">
                                    <h3 className="truncate text-2xl font-semibold">
                                        {session?.user.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Host
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div className="my-7 border-t" />

                        <div className="divide-y">

                            <div className="py-5 first:pt-0">
                                <p className="text-sm text-muted-foreground">
                                    Full Name
                                </p>

                                <p className="mt-2 font-medium">
                                    {session?.user.name}
                                </p>
                            </div>

                            <div className="py-5">
                                <p className="text-sm text-muted-foreground">
                                    Email Address
                                </p>

                                <p className="mt-2 wrap-break-word font-medium">
                                    {session?.user.email}
                                </p>
                            </div>

                            <div className="py-5">
                                <p className="text-sm text-muted-foreground">
                                    Member Since
                                </p>

                                <p className="mt-2 font-medium">
                                    {format(session.user.createdAt!, "MMM yy")}
                                </p>
                            </div>

                            <div className="py-5 pb-0">
                                <p className="text-sm text-muted-foreground">
                                    About Me
                                </p>

                                <p className="mt-2 text-sm leading-6">
                                    {"No bio added yet."}
                                </p>
                            </div>

                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}