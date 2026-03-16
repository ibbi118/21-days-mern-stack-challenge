import React, { useRef } from 'react'
import {motion} from "motion/react"

const App = () => {

const cardsData = [
  {
    id: 1,
    title: "Beach Vacation",
    description: "Enjoy the beautiful sunset and relaxing waves at the beach.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    id: 2,
    title: "Mountain Adventure",
    description: "Explore breathtaking mountain views and fresh air.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  },
  {
    id: 3,
    title: "City Night Life",
    description: "Experience the vibrant lights and energy of the city.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156"
  }
];

const ref = useRef()


  return (
    <div className='relative w-full h-screen bg-zinc-800'>
      <div className="nav w-full  flex justify-center items-center absolute top-5">
        <h2 className='text-lg font-bold text-zinc-500 '>Documents</h2>
      </div>
      <div  className='w-full h-screen flex justify-center items-center z-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <h1 className='text-9xl font-bold text-zinc-500 '>
          Docs.
        </h1>
      </div>

      <div 
      ref={ref}
      className='w-full h-screen absolute z-3 bg-transparent py-3 px-5 '>

       <div
       
     
       
       className="card flex gap-1">
     
     {
      cardsData.map((card,idx)=>{
        return <motion.div 
        drag
        dragConstraints= {ref}
         dragTransition={{
    bounceStiffness: 200, // jitna high, utna zyada stiff
    bounceDamping: 20,    // jitna high, utna zyada damped (smooth stop)
  }}
        
        
        class="bg-zinc-300 rounded-xl shadow-lg w-65 h-85 overflow-hidden">

    <img 
      src={card.image}
      alt="Beach"
      class="w-full h-40 object-cover"
    />

    <div class="p-5">
      <h2 class="text-xl font-semibold mb-2">{card.title}</h2>

      <p class="text-gray-500 mb-4">
        {card.description}
      </p>

      <button class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 font-bold">
        Explore
      </button>
    </div>

       </motion.div>
      })
     }

       </div>

        
      </div>
    </div>
  )
}

export default App
