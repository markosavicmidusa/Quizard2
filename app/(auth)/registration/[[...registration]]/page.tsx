"use client"

import { SignUp } from "@clerk/nextjs";


export default function Registration() {
  return (
    
    <div className="p-10 flex flex-col justify-center items-center">
      <SignUp/>
    </div>
  );
}
