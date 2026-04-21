import React from 'react'
import Video from './Video'

const HomeHero = () => {
  return (
    <div>
        <div className='text-[12vw] leading-[9vw] font-thin tracking-tighter text-center text-gray-100 font-[font1] capitalize flex items-center justify-center mt-5'>
            The Spark for
        </div>
        <div  className='text-[12vw] leading-[9vw] font-thin tracking-tighter text-center text-gray-100 font-[font1] capitalize flex items-center justify-center'>
            all <div className='w-[16vw] h-[9vw] rounded-full overflow-hidden'><Video/></div> thing
        </div>
        <div className='text-[12vw] leading-[9vw] font-thin tracking-tighter text-center text-gray-100 font-[font1] capitalize flex items-center justify-center'>
            creative
        </div>
        <div className='w-[20vw]  ml-[76%] mt-[-2vw] mb-5'>
            <p className='text-sm leading-[1.6] text-gray-100 font-[font-2] font-bold'>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;K72 is an agency that builds brands from every angle. Today, tomorrow and years from now. We think the best sparks fly when comfort zones get left behind and friction infuses our strategies, brands and communications with real feeling. We’re transparent, honest and say what we mean, and when we believe in something, we’re all in.


            </p>
        </div>
    </div>
  )
}

export default HomeHero