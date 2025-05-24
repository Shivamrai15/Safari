"use client";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Montserrat  } from "next/font/google"

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
});


const GetStartedPage = () => {

    const router = useRouter();    
  
    return (
    <div className="h-full bg-[url('/assets/2148171661.avif')] sm:bg-[url('/assets/2148751614.avif')] bg-cover bg-no-repeat">
        <div className='h-full flex items-end bg-gradient-to-b from-transparent from-60% to-70% sm:from-50% sm:to-90% to-black/90'>
            <div className='p-6 pb-10 md:p-16 space-y-10'>
                <div className='max-w-lg space-y-2 sm:space-y-6'>
                    <h3 className={`${montserrat.className} text-2xl tracking-wide md:text-5xl font-semibold md:font-bold select-none`}>Enjoy here the best music with us</h3>
                    <p className={`${montserrat.className} text-zinc-300 text-sm md:text-lg select-none`}>What do you want ot hear, enjoy here the best music with us</p>
                </div>
                <Button
                    onClick={()=>router.push("/sign-up")}
                    className='max-w-sm h-14 rounded-full bg-red-600/90 w-full text-white hover:bg-red-600/80 border border-red-600 text-lg font-semibold cursor-default md:cursor-pointer'
                >
                    Get Started
                </Button>
            </div>
        </div>
    </div>
  )
}

export default GetStartedPage