import { SignIn } from "@clerk/nextjs"


export default function Login(){
    return (
        <div className="p-10 flex flex-col jusity-center items-center">
            <SignIn/>
        </div>
        
    )
    
    
}