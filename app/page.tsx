"use client"

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getCommercials } from "@/data/controller";
import Link from "next/link";
import { useRouter } from 'next/router';

import { usePathname } from 'next/navigation'
import MainContent from "@/components/shared/MainContent";


export default function Home() {
 
  const commercials = getCommercials()
  const pathname = usePathname()
  // adding comment

  const [currentCommercialIndex, setCurrentCommercialIndex] = useState(0);
 
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
 
 
  return (
    <MainContent/>
  );
}
