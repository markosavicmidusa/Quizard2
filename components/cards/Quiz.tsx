import { IQuizMetadata } from "@/lib/models/quiz_metadata.model"
import Image from "next/image"
import Link from "next/link"


export default function Quiz({quiz}:{quiz:IQuizMetadata}){

    return (
        <Link href={`/quizes/${quiz.id}`}>
            <div className="z-0 w-36 h-36 border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                 <div className="relative h-20">
                   <Image
                     src="/quizes/quiz-pic.png"
                     alt={quiz.name}
                     layout="fill"
                     objectFit="cover"
                   />
                 </div>
                 <div className="p-2">
                   <h2 className="text-md font-bold">{quiz.name.substring(0,15)}</h2>
                   <p className="text-xs text-gray-400">{quiz.title.substring(0,15)}...</p>
                 </div>
               </div>
        </Link>

        )
}