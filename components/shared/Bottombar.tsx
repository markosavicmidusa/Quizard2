import Link from "next/link"
import Image from "next/image"

interface Category{
    label:string
    link:string
    picturePath:string
}

interface BottombarProps{
    categories:Category[]
}


export default function Bottombar({categories}:BottombarProps){
    return (
    
    <main className="flex flex-row gap-4" >
        {categories.map((category, index)=> (
            <Link className="text-white px-4 py-2 cursor-pointer transition-transform transform hover:scale-110" key={index} href={category.link}>
                    <Image
                      src={`/google-icons/${category.picturePath}`}
                      alt="logout"
                      width={27}
                      height={27}
                      style={{
                        filter: 'invert(100%)',
                      }}
                    />
            </Link>
        ))}
        <Link className="text-white px-4 py-2 cursor-pointer transition-transform transform hover:scale-110" href={'/create-quiz'}>
                <Image
                  src={`/google-icons/add.svg`}
                  alt="logout"
                  width={27}
                  height={27}
                  style={{
                    filter: 'invert(100%)',
                  }}
                />
        </Link>
    </main>
    
    )
}
