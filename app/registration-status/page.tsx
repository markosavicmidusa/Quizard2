"use client"

import MainContent from "@/components/shared/MainContent"
import { GetUserByClerkID, RegisterUser } from "@/lib/actions/user/user.actions"
import { IUser } from "@/lib/models/user/user.model"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useEffect, useState } from "react"
import { UserResource } from "@clerk/types";
import { Flamenco } from "next/font/google"


export default function RegistrationStatus() {
    
    const [successfullRegistration, setSuccessfullRegistration] = useState(false)
    const [loading, setLoading] = useState(true)
    const { user, isSignedIn } = useUser();


    useEffect(() => {
        if (user && user.id && isSignedIn) {
            //console.log("Use effect-Registration:", user);
            const fetchUser = async () => {
                try {
                    const dbUser = await GetUserByClerkID(user.id);
                    if (dbUser) {
                        //console.log("User is already SIGNED UP:", dbUser.id);
                        setSuccessfullRegistration(true);
                        setLoading(false)
                    } else {
                        //console.log("User is NOT SIGNED UP 1-step:");
                        await handleSignUp(user);
                        const dbUserAfterRegistration = await GetUserByClerkID(user.id);
                        if (dbUserAfterRegistration) {
                            setSuccessfullRegistration(true);
                            setLoading(false)
                            //console.log("User is SIGNED UP 2-step: setSuccessfullRegistration(true)");
                        } else {
                            setSuccessfullRegistration(false);
                            setLoading(false)
                            //console.log("User is NOT SIGNED UP 3-step: setSuccessfullRegistration(false)");
                        }
                    }
                } catch (error) {
                    //console.error('Error fetching user:', error);
                    setSuccessfullRegistration(false); // Set registration to false in case of error
                    setLoading(false)
                }
            };
            fetchUser();
        }
    }, [user, isSignedIn]);

  const handleSignUp = async (user : UserResource) => {
    try {
        const newUser: IUser = {
            clerkId: user.id,
            email: user.emailAddresses.toString(),
            name: user.firstName,
            surname: user.lastName,
            sportsClicked: 0,
            popularClicked: 0,
            funClicked: 0,
            scienceClicked: 0,
            otherClicked: 0
        } as IUser

        const response = await RegisterUser(newUser)

      //if (response.id) {
      //  console.log('User registered in database successfully');
      //} else {
      //  console.error('Failed to register user in database');
      //}
    } catch (error) {
      //console.error('Error registering user:', error);
    }
  };

    //border white solid

    return(
        <div className="flex flex-col gap-10">
        {loading ? 
        <div className="flex flex-col items-center p-20 text-blue-500 bg-zinc-700 gap-5">
            <h1 className="text-xl">Loading...</h1>
            <p>Please wait...</p>
        </div> : successfullRegistration ? 
        <div className="flex flex-col gap-10 items-center p-20 bg-zinc-700">
            <h1 className="text-green-500 text-xl">Successfull registration</h1>
            <Link href="/user" className="text-white bg-blue-500 px-4 py-2 cursor-pointer transition-transform transform hover:scale-110 rounded">
                DASHBOARD
            </Link>
        </div> : 
        <div className="flex flex-col gap-10 items-center p-20 bg-zinc-700">
            <h1 className="text-red-500 text-xl">Error registration</h1>
            <Link href="/registration" className="text-white bg-blue-500 px-4 py-2 cursor-pointer transition-transform transform hover:scale-110 rounded">
                REGISTER
            </Link>
        </div>        
        }   
        <MainContent/>
    </div> 
    )
}