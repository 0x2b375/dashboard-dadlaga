/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
const NotFoundPage = () => {
  const {darkMode} = useStateContext()

  return (
    <div className={`flex flex-col items-center justify-center h-screen text-gray-700 dark:text-neutral-300 ${darkMode && 'dark'}`}>
      <img src="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/404%20NotFound.png?raw=true" alt="" className='md:w-800' draggable={false} loading='lazy'/>
      <p className="text-lg mb-5 ">Уучлаарай, таны хайсан хуудас олдсонгүй</p>
      <Link to="/" className="text-gray-900 dark:text-neutral-100 hover:underline">
          Нүүр хуудас-руу буцах
      </Link>
  </div>
  )
}

export default NotFoundPage