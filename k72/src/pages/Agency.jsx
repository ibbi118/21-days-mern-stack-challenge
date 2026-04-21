import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import React, { useRef } from 'react'

const Agency = () => {


const imageDivref = useRef(null)
const imageref = useRef(null)
const imageArry = [
  "https://k72.ca/images/teamMembers/Carl_480x640.jpg?w=480&h=640&fit=crop&s=f0a84706bc91a6f505e8ad35f520f0b7",
  'https://k72.ca/images/teamMembers/Olivier_480x640.jpg?w=480&h=640&fit=crop&s=c13569c0753117d04f1a93cf7b446d64',
  'https://k72.ca/images/teamMembers/MEL_480X640.jpg?w=480&h=640&fit=crop&s=07c9bfee89816720b873e6748a276af6',
  'https://k72.ca/images/teamMembers/MEGGIE_480X640_2.jpg?w=480&h=640&fit=crop&s=3604b19f8fc7b40f517954147698d847',
  'https://k72.ca/images/teamMembers/ChantalG_480x640.jpg?w=480&h=640&fit=crop&s=13093769c4a19cecd291ddcccd898991',
  'https://k72.ca/images/teamMembers/Michele_480X640.jpg?w=480&h=640&fit=crop&s=ce85dc6d140947736baa739d0e59dab2',
  'https://k72.ca/images/teamMembers/CAMILLE_480X640_2.jpg?w=480&h=640&fit=crop&s=74317575b2d72fd11c5296615c383e4a',
  'https://k72.ca/images/teamMembers/Michele_480X640.jpg?w=480&h=640&fit=crop&s=ce85dc6d140947736baa739d0e59dab2',
  'https://k72.ca/images/teamMembers/joel_480X640_3.jpg?w=480&h=640&fit=crop&s=1cadbf143b3aa916b1b414464acbb4d6',
  'https://k72.ca/images/teamMembers/MEGGIE_480X640_2.jpg?w=480&h=640&fit=crop&s=3604b19f8fc7b40f517954147698d847',
  'https://k72.ca/images/teamMembers/Olivier_480x640.jpg?w=480&h=640&fit=crop&s=c13569c0753117d04f1a93cf7b446d64',
  'https://k72.ca/images/teamMembers/ChantalG_480x640.jpg?w=480&h=640&fit=crop&s=13093769c4a19cecd291ddcccd898991',
  'https://k72.ca/images/teamMembers/MEL_480X640.jpg?w=480&h=640&fit=crop&s=07c9bfee89816720b873e6748a276af6',
  'https://k72.ca/images/teamMembers/joel_480X640_3.jpg?w=480&h=640&fit=crop&s=1cadbf143b3aa916b1b414464acbb4d6'
]

gsap.registerPlugin(ScrollTrigger)
useGSAP(() => {

  gsap.to(imageDivref.current, {
    scrollTrigger: {
      trigger: imageDivref.current,
      start: "top 19%",
      end: "top -190%",
      pin: true,
      
      markers: true,

      onUpdate : (elm)=>{


        let imageIndex;
        if (elm.progress < 1){
          imageIndex = Math.floor(elm.progress * imageArry.length)
          
        }else{
         imageIndex = imageArry.length-1
        }

        imageref.current.src = imageArry[imageIndex]
        
        
      }
      
    }
  })

})




  return (
    <div>
      <div className="section1">
        <div ref={imageDivref} className='w-[15vw] h-[45vh] bg-amber-200 absolute top-[20%] left-[31%] overflow-hidden rounded-2xl'>
          <img ref={imageref} src="https://k72.ca/images/teamMembers/Carl_480x640.jpg?w=480&h=640&fit=crop&s=f0a84706bc91a6f505e8ad35f520f0b7" alt=""  className='w-full h-full object-cover'/>
        </div>
        <div className=' relative font-font[font-2]'>
          <div className=" pt-[18vw]">
           <h1 className='text-[24.5vw] text-center leading-[23vw] '>SEVEN7Y <br/> TWO</h1>
          </div>
          <div className='w-screen pl-[40vw] pt-6 pr-6'>
            <p className='text-[3.5vw] leading-[3.5vw] text-center font-bold'>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; We’re inquisitive and open-minded, and we make sure creativity crowds out ego from every corner. A brand is a living thing, with values, a personality and a story. If we ignore that, we can achieve short-term success, but not influence that goes the distance. We bring that perspective to every brand story we help tell.
            </p>
          </div>
        </div>
      </div>
      <div className="section2 w-screen h-screen bg-amber-600">
        <div>

        </div>
      </div>

    </div>
  )
}

export default Agency