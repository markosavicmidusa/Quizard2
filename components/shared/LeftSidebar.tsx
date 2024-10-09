"use client"

import { useEffect, useState } from 'react';
import { Commercial } from "@/data/commercials/commercials"
import Image from "next/image";
import Link from 'next/link';



export default function LeftSidebar({commercials}:{commercials: Commercial[]}){
    
    const [currentCommercialIndex, setCurrentCommercialIndex] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentCommercialIndex((prevIndex) => (prevIndex + 1) % commercials.length);
        }, 8000); // Adjust the interval duration as needed
    
        return () => clearInterval(interval);
      }, [commercials]);

    return(
        <div className="flex flex-col inline-center justify-center w-full h-100 gap-8">
            
            <div className="flex flex-col inline-center justify-center h-1/3 w-full p-2">
                 <Link href={`${commercials[(currentCommercialIndex+5)%commercials.length].link}`} className="flex flex-col items-center">
                    <h3>{`${commercials[(currentCommercialIndex+5)%commercials.length].label}`}</h3>
                    <Image
                      src={`/commercial/${commercials[(currentCommercialIndex+5)%commercials.length].picturePath}`}
                      alt="Commercial Image"
                      width={250}  // Set your desired fixed width
                      height={150} // Set your desired fixed height
                      
                    />
                 </Link>     
            </div>
            <div className="flex flex-col inline-center justify-center h-1/3 w-full p-2">
                 <Link href={`${commercials[(currentCommercialIndex+4)%commercials.length].link}`} className="flex flex-col items-center">
                    <h1>{`${commercials[(currentCommercialIndex+4)%commercials.length].label}`}</h1>
                    <Image
                      src={`/commercial/${commercials[(currentCommercialIndex+4)%commercials.length].picturePath}`}
                      alt="Commercial Image"
                      width={250}  // Set your desired fixed width
                      height={150} // Set your desired fixed height
                     
                    />
                 </Link>     
            </div>
            <div className="flex flex-col inline-center justify-center h-1/3 w-full p-2">
                 <Link href={`${commercials[(currentCommercialIndex+3)%commercials.length].link}`} className="flex flex-col items-center">
                    <h1>{`${commercials[(currentCommercialIndex+3)%commercials.length].label}`}</h1>
                    <Image
                      src={`/commercial/${commercials[(currentCommercialIndex+3)%commercials.length].picturePath}`}
                      alt="Commercial Image"
                      width={250}  // Set your desired fixed width
                      height={150} // Set your desired fixed height
                    
                    />
                 </Link>     
            </div>
           {/*<div className="flex flex-col inline-center justify-center h-1/4 w-full p-2 border 1px white">
                 <Link href={`${commercials[(currentCommercialIndex+8)%commercials.length].link}`} className="flex flex-col items-center">
                    <h1>{`${commercials[(currentCommercialIndex+8)%commercials.length].label}`}</h1>
                    <Image
                      src={`/commercial/${commercials[(currentCommercialIndex+8)%commercials.length].picturePath}`}
                      alt="Commercial Image"
                      width={250}  // Set your desired fixed width
                      height={150} // Set your desired fixed height
                    />
                 </Link>     
    </div>*/}
           
        </div>
    ) 
        
}