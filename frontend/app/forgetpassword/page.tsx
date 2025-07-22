'use client'

import { supabase } from "@/lib/supabase";
import { Alert } from "@mui/material";
import { ChevronLeft, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function ForgetPassword() {
    const emailInput = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();
    const [alertMessage, setAlertMessage] = useState(" ");
    const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "warning" | null>(null);
    const router = useRouter();

    useEffect(() => {
        const email = searchParams.get('email');
        if (emailInput.current) emailInput.current.value = email ? email : ''
    }, [searchParams])

    const forgetPassword = async () => {
        if (emailInput.current && emailInput.current.value != '') {
            const { data, error } = await supabase
                .auth
                .resetPasswordForEmail(emailInput.current.value);
            
            if (error) {
                setAlertSeverity("warning");
                setAlertMessage(error.message);
            } else if (data) {
                setAlertSeverity("success");
                setAlertMessage(`Password reset email sent. Please check your inbox at ${emailInput.current.value}.`);
            }

        } else {
            setAlertSeverity("error");
            setAlertMessage("Please enter the email address you'd like to reset your password for.");
        }
    }

    return (
        <Suspense 
            fallback={
                <div className="flex justify-center items-center h-screen w-screen text-gray-500 text-base">
                    Loading...
                </div>
            }
        >
            <div 
                className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1617957743043-91ba3aa22558?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
            >
                <div className="w-[600px] rounded-3xl shadow-xl bg-white p-10 flex flex-row gap-1">
                    <div className="flex items-start justify-start w-[5%] pt-1">
                        <ChevronLeft
                            className="cursor-pointer transition" 
                            onClick={() => router.push('/registration/login')}
                        />
                    </div>

                    <div className="flex flex-col flex-grow w-[95%] pr-7 pt-3">
                        <div className="text-center pt-7 pb-11 text-4xl font-sans font-bold tracking-wider">
                            Confirm Email Address
                        </div>

                        <form action={forgetPassword}>
                            <div className="relative w-full flex items-center pb-3">
                                <UserRound className="absolute left-1 top-5.5 text-gray-500" />
                                
                                <input
                                    id="forgetPasswordEmail"
                                    type="email"
                                    name="forgetPasswordEmail"
                                    placeholder=" "
                                    ref={emailInput}
                                    className="peer w-full border-b-2 border-gray-400 bg-transparent text-base
                                        pl-10 pt-6 pb-1
                                        focus:outline-none focus:border-black" 
                                />

                                <label
                                    htmlFor="forgetPasswordEmail"
                                    className="absolute left-10 text-gray-400 text-sm transition-all 
                                        peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm 
                                        peer-focus:top-2 peer-focus:text-xs 
                                        peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                                >
                                    Email address
                                </label>
                            </div>

                            <div className="pb-0.1">
                                {alertMessage && alertSeverity && (
                                    <div>
                                        <Alert
                                            sx={{
                                                position: "static",
                                                alignItems: "center",
                                                display: "flex",
                                                borderRadius: "12px",
                                            }}
                                            severity={alertSeverity}
                                            className="mb-3"
                                        >
                                            <p id="message">{alertMessage}</p>
                                        </Alert>
                                    </div>
                                )}
                            </div>

                            <div className="pt-3">
                                <button 
                                    type="submit" 
                                    className="bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-95 w-full rounded-3xl text-white font-sans tracking-wide p-2 transition cursor-pointer"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default function Page() {
  return (
    <Suspense 
        fallback={
            <div className="flex justify-center items-center h-screen w-screen text-gray-500 text-base">
                Loading...
            </div>
        }
    >
      <ForgetPassword />
    </Suspense>
  );
}