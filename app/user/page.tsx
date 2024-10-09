"use client";

import Quiz from "@/components/cards/Quiz";
import MainContent from "@/components/shared/MainContent";
import GetQuizMetadataListByUserId from "@/lib/actions/quiz.actions";
import { GetUserByClerkID } from "@/lib/actions/user/user.actions";
import { IQuizMetadata } from "@/lib/models/quiz_metadata.model";
import { IUser } from "@/lib/models/user/user.model";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
 
export default function Page() {
 
    const { isLoaded, isSignedIn, user } = useUser();
    const [DbUser, setDbUser] = useState<IUser|null>(null)
    const [QuizMetadata, setQuizMetadata] = useState<IQuizMetadata[]|null>(null)
    const [QuizMetadataLoaded, setQuizMetadataLoaded] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            //console.log("USER: ", user)
            if (user && user.id) { // Check if user and user.id are defined
                const dbUser = await GetUserByClerkID(user.id);
                setDbUser(dbUser);   
            }
        }
        fetchUser()
    },[user])

    useEffect(()=>{
        
    const fetchQuizesMetadata= async ()=>{
      //console.log("fetchQuizesMetadata-DbUser", DbUser)
      
        try {
            const quizMetadataByUserId = await GetQuizMetadataListByUserId(DbUser?.id)
            //console.log("quizMetadataByUserId", quizMetadataByUserId)
            if(quizMetadataByUserId){
                setQuizMetadataLoaded(true)
                setQuizMetadata(quizMetadataByUserId)
            }
        } catch (error) {
           // console.log("GetQuizMetadataListByUserId/useEffect/user-page error:", error)
        }
    }

        fetchQuizesMetadata()
    },[DbUser])


    if (!isLoaded || !isSignedIn) {
      return null;
    }

    return (
        <section className="max-w-4xl mx-auto px-6 py-8 rounded-lg shadow-lg">
  <h1 className="text-3xl font-bold text-center mb-8 text-slate-300">
    Welcome, {user.firstName}!
  </h1>
  <div className="flex flex-col gap-8 text-slate-300">
    <div className="p-6 rounded-lg shadow-md bg-zinc-700">
      <h2 className="text-xl font-semibold mb-4">Your Account Details</h2>
      {DbUser ? (
        <div>
          <p><span className="font-semibold">Email:</span> {DbUser.email}</p>
          <p><span className="font-semibold">Name:</span> {DbUser.name}</p>
          <p><span className="font-semibold">Surname:</span> {DbUser.surname}</p>
        </div>
      ) : (
        <div>User data not available</div>
      )}
    </div>
    <div className="bg-zinc-700 p-6 rounded-lg shadow-md items-center">
      <h2 className="text-xl font-semibold mb-4">Your Quizzes List</h2>
      {QuizMetadataLoaded ? (
        <div className="overflow-y-scroll max-h-64 w-full">
          <ul className="flex flex-wrap gap-4 items-center justify-center">
            {QuizMetadata?.map((quiz) => (
              <div key={quiz.id}>
                <Quiz quiz={quiz} />
                <p className={`text-sm mt-1 ${quiz.active === 1 ? 'text-green-500' : quiz.active === 0 ? 'text-blue-500' : 'text-red-500'}`}>
                  {quiz.active === 1 ? 'Active' : quiz.active === 0 ? 'Pending' : 'Rejected'}
                </p>
            </div>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-gray-700">Loading quizzes...</div>
      )}
    </div>
  </div>

  <MainContent />
</section>

      );
    
}
