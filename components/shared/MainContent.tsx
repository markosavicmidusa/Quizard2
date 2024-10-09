"use client"

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getCommercials } from "@/data/controller";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { Model, Document } from "mongoose";

import QuizMetadataModel, { IQuizMetadata } from "@/lib/models/quiz_metadata.model";
import MostPopularQuizes from "../forms/MostPopularQuizes";
import { getMostPopular50Quizzes, getRequestedQuizes } from "@/lib/actions/quiz.actions";
import Quiz from "../cards/Quiz";
import RecentlyAdded from "../forms/RecentlyAdded";
import MostClicked from "../forms/MostClicked";
import MostFinished from "../forms/MostFinished";
import Hangman  from "../games/Hangman";
import TicTacToe from "../games/TicTacToe";

export default function MainContent() {
 
  const commercials = getCommercials()
  const pathname = usePathname()

  const [currentCommercialIndex, setCurrentCommercialIndex] = useState(0);
  const [quizzes, setQuizzes] = useState<IQuizMetadata[]>([]);

  const [welcome, setWelcome] = useState("Quizard")
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    //console.log("Component Mounted"); // Log when the component is mounted
  
    const interval = setInterval(() => {
      setCurrentCommercialIndex((prevIndex) => (prevIndex + 1) % commercials.length);
      //console.log("Log inside setInterval"); // Log each time the interval function is executed
    }, 10000);
  
    return () => {
      //console.log("Component Unmounted"); // Log when the component is unmounted
      clearInterval(interval);
    };
  }, [commercials.length]);

  useEffect(() => {

    const fetchQuizzes = async () => {
        try {
          let fetchedQuizzes: IQuizMetadata[] | []  
          
          fetchedQuizzes= await getRequestedQuizes(pathname);
          setQuizzes(fetchedQuizzes);
           
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    fetchQuizzes();
}, [pathname]);

  useEffect(() => {
    
    setWelcome(() => {
      switch(pathname){
        case '/':
          return 'QuizHUB'
        case '/sports':
          return 'QuizHUB Sports'
        case '/popular':
          return 'QuizHUB Popular'
        case '/fun':
          return 'QuizHUB Fun'
        case '/science':
          return 'QuizHUB Science'
        case '/other':
          return 'QuizHUB Other'
        default:
          setShowWelcome(false)
          return ''
      }
    })
  },[pathname])
 
 
  return (
    <div className="h-100 flex flex-col flex-grow w-full ">
    {showWelcome &&
      (<div className="flex flex-col flex-wrap items-center w-full  p-5 shadow-md hover:shadow-lg rounded-lg bg-zinc-700">
        <h1 className="text-lg font-bold text-blue-500 mb-4 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            Welcome to <span className="text-purple-600">{welcome}</span>
        </h1>
      </div>)}
      {/* Block 0: RequestedQuizes */}
      {showWelcome && pathname != '/' && (<div className="flex flex-col flex-wrap items-center w-full p-5 mb-10 bg-zinc-900 shadow-md hover:shadow-lg rounded-lg">
          <h3 className="text-xl font-bold mb-4">{pathname.substring(1).toUpperCase()}</h3>
          <div className="overflow-y-scroll max-h-64 w-full">
            <ul className="flex flex-wrap gap-4 items-center justify-center">
                {quizzes.map((quiz) => (
                    <Quiz key={quiz.id} quiz={quiz}/>
                ))}
            </ul>
        </div>
       </div>)}
      
       {/* Block 1: Most Popular Quizes */}
       <div className="flex flex-col flex-wrap items-center w-full p-5 mt-10 shadow-md hover:shadow-lg rounded-lg">
          <h3 className="text-xl font-bold mb-4">Most Popular Quizzes</h3>
          <MostPopularQuizes />
       </div>

       {/* Block 3: Commercial */}
       <div className="flex flex-grid p-10 justify-center w-full lg:hidden xl:hidden shadow-md hover:shadow-lg rounded-lg bg-zinc-900">
          <Link href={`${commercials[(currentCommercialIndex+0)%commercials.length].link}`} className="flex flex-col items-center">
              <h3>{`${commercials[(currentCommercialIndex+0)%commercials.length].label}`}</h3>
              <Image
                src={`/commercial/${commercials[(currentCommercialIndex+0)%commercials.length].picturePath}`}
                alt="Commercial Image"
                width={200}  // Set your desired fixed width
                height={120} // Set your desired fixed height
              
              />
          </Link>     
         
       </div>

       {/* Block 2: Small Game */}
       <div className="flex flex-col p-10 items-center justify-center w-full h-2/8 shadow-md hover:shadow-lg rounded-lg bg-zinc-700">
         <Hangman/>
         
       </div>

        {/* Block 3: Commercial */}
        <div className="flex flex-grid p-10 items-center justify-center w-full lg:hidden xl:hidden shadow-md hover:shadow-lg rounded-lg">
            <Link href={`${commercials[(currentCommercialIndex+2)%commercials.length].link}`}>
                <h3>{`${commercials[(currentCommercialIndex+2)%commercials.length].label}`}</h3>
                <Image
                  src={`/commercial/${commercials[(currentCommercialIndex+2)%commercials.length].picturePath}`}
                  alt="Commercial Image"
            
                  width={200}  // Set your desired fixed width
                  height={120} // Set your desired fixed height
                 
                />
             </Link>
          </div>
      
       {/* Block 4: RecentlyAdded Quizes */}
                 
       <div className="flex flex-col flex-wrap items-center w-full p-5 mt-10 shadow-md hover:shadow-lg rounded-lg bg-zinc-900">
        <h3 className="text-xl font-bold mb-4">Recently Added Quizzes</h3>
          <RecentlyAdded/>
        </div>

       {/* Block 5: Small Game */}
       <div className="flex flex-col p-10 items-center justify-center w-full h-2/8 shadow-md hover:shadow-lg rounded-lg bg-zinc-700">
         <TicTacToe/>
       </div>

       {/* Block 6: Commercial */}
       <div className="flex flex-grid p-10 justify-center w-full lg:hidden xl:hidden shadow-md hover:shadow-lg rounded-lg">
          <Link href={`${commercials[(currentCommercialIndex+4)%commercials.length].link}`} className="flex flex-col items-center">
              <h3>{`${commercials[(currentCommercialIndex+4)%commercials.length].label}`}</h3>
              <Image
                src={`/commercial/${commercials[(currentCommercialIndex+4)%commercials.length].picturePath}`}
                alt="Commercial Image"
                width={200}  // Set your desired fixed width
                height={120} // Set your desired fixed height
              
              />
          </Link>     
         
       </div>

      {/* Block 7: Most Clicked Quizes */}
      <div className="flex flex-col flex-wrap items-center w-full p-5 mt-10 shadow-md hover:shadow-lg rounded-lg bg-zinc-900">
         <h3 className="text-xl font-bold mb-4">Trending Quizes</h3>
         <MostClicked/>
       </div>

       {/* Block 8: Small Game */}
       <div className="flex flex-col p-10 items-center justify-center w-full h-2/8 shadow-md hover:shadow-lg rounded-lg bg-zinc-700">
         <Hangman/>
         
       </div>

       {/* Block 9: Commercial */}
       <div className="flex flex-grid p-10 justify-center w-full lg:hidden xl:hidden shadow-md hover:shadow-lg rounded-lg">
          <Link href={`${commercials[(currentCommercialIndex+5)%commercials.length].link}`} className="flex flex-col items-center">
              <h3>{`${commercials[(currentCommercialIndex+5)%commercials.length].label}`}</h3>
              <Image
                src={`/commercial/${commercials[(currentCommercialIndex+5)%commercials.length].picturePath}`}
                alt="Commercial Image"
                width={200}  // Set your desired fixed width
                height={120} // Set your desired fixed height
              
              />
          </Link>     
         
       </div>

      {/* Block 7: Most Finished Quizes */}
      <div className="flex flex-col flex-wrap items-center w-full p-5 mt-10 shadow-md hover:shadow-lg rounded-lg">
         <h3 className="text-xl font-bold mb-4">Most Interesting</h3>
         <MostFinished/>
       </div>

       {/* Block 8: Small Game */}
       <div className="flex flex-col p-10 items-center justify-center w-full h-2/8 shadow-md hover:shadow-lg rounded-lg bg-zinc-700">
         <TicTacToe/>
       </div>

       {/* Block 9: Commercial */}
       <div className="flex flex-grid p-10 justify-center w-full lg:hidden xl:hidden rounded-lg">
          <Link href={`${commercials[(currentCommercialIndex+6)%commercials.length].link}`} className="flex flex-col items-center">
              <h3>{`${commercials[(currentCommercialIndex+6)%commercials.length].label}`}</h3>
              <Image
                src={`/commercial/${commercials[(currentCommercialIndex+6)%commercials.length].picturePath}`}
                alt="Commercial Image"
                width={200}  // Set your desired fixed width
                height={120} // Set your desired fixed height
              
              />
          </Link>     
         
       </div>

      {/* Block 7: Random Quizes */}
      <div className="flex flex-col flex-wrap items-center w-full p-5 shadow-md hover:shadow-lg rounded-lg bg-zinc-900">
          <h3 className="text-xl font-bold mb-4">Most Popular Quizzes</h3>
          <MostPopularQuizes />
       </div>

       {/* Block 9: Commercial */}
       <div className="flex flex-grid p-10 justify-center w-full lg:hidden xl:hidden shadow-md hover:shadow-lg rounded-lg ">
          <Link href={`${commercials[(currentCommercialIndex+2)%commercials.length].link}`} className="flex flex-col items-center">
              <h3>{`${commercials[(currentCommercialIndex+2)%commercials.length].label}`}</h3>
              <Image
                src={`/commercial/${commercials[(currentCommercialIndex+2)%commercials.length].picturePath}`}
                alt="Commercial Image"
                width={200}  // Set your desired fixed width
                height={120} // Set your desired fixed height
              
              />
          </Link>     
         
       </div>
    </div>
  );
}
