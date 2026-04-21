import React from 'react'
import Video from '../components/home/Video'
import HomeHero from '../components/home/HomeHero'
import Bottom from '../components/home/Bottom'

const Home = () => {
  return (
    <div>
    <div className='w-screen h-screen fixed'>
         <Video/>
    </div>
      <div className="front relative w-screen h-screen flex flex-col justify-between">
        <HomeHero/>
        <Bottom/>
      </div>
    </div>
  )
}

export default Home