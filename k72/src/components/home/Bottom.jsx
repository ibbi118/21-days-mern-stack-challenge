import React from 'react'
import { Link } from 'react-router'

const Bottom = () => {
  return (
    <div className='font-[font2] flex justify-center items-center gap-2'>
        <div className='border-3 rounded-full px-10 h-28 border-white uppercase text-gray-100 hover:border-[#D3FD50] hover:text-[#D3FD50]'>
            <Link className='text-[6vw] mt-1 block' to="/work">Work</Link>
        </div>
        <div className='border-3 rounded-full px-10 h-28 border-white uppercase text-gray-100 hover:border-[#D3FD50] hover:text-[#D3FD50]'>
            <Link className='text-[6vw] mt-1 block' to="/agency">Agency</Link>
        </div>

    </div>
  )
}

export default Bottom