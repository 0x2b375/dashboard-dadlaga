/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import { FiShoppingCart } from 'react-icons/fi'
import { BsChatLeft } from 'react-icons/bs'
import { RiNotification3Line } from 'react-icons/ri'
import { MdKeyboardArrowDown } from 'react-icons/md'
import {Notification, UserProfile} from '.'
import {useStateContext} from '../contexts/ContextProvider'
import { PiMoonFill } from "react-icons/pi";
import { IoSunny } from "react-icons/io5";


const NavButton = ({title, customFunc, icon, color, dotColor}) => (
  <button content={title} type='button' onClick={customFunc} style={{color}} className='relative flex justify-center items-center text-xl rounded-full p-3 hover:bg-slate-200 hover:text-slate-900'>
    <span style={{background: dotColor}} className='absolute inline-flex w-4 h-4 top-2 right-2'>
    </span>
    {icon}
  </button>
)


const Navbar = () => {
  const {activeMenu, setActiveMenu, isClicked, setisClicked, handleClick, screenSize, setScreenSize, darkMode, setDarkMode} = useStateContext();

  useEffect(()=>{
    const handleResize = () => setScreenSize(window.innerWidth)

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }


  useEffect(()=> {
    if(screenSize<=900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize])


  return (
    <div className='flex justify-between p-2 md:mx-6 relative'>
      <NavButton title='Menu' 
        customFunc={()=>setActiveMenu((prevActiveMenu)=>!prevActiveMenu)} 
        icon={<AiOutlineMenu/>}/>
      <div className='flex'>
          
        <NavButton title='Notification' 
          customFunc={()=>handleClick('notification')} 
          icon={<RiNotification3Line/>}
        />
        <button  type='button' onClick={toggleDarkMode} className='relative flex justify-center items-center text-xl rounded-full p-3 hover:bg-slate-200 hover:text-slate-900'>
        <span className='absolute inline-flex w-4 h-4 top-2 right-2'></span>
         {darkMode ? <IoSunny/> : <PiMoonFill/>}
      </button>
        <div className='flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-200 text-slate-9600 rounded-lg' onClick={()=>handleClick('userProfile')}>
          <img src='https://github.com/adrianhajdin/project_syncfusion_dashboard/blob/main/src/data/avatar.jpg?raw=true' alt="" className='rounded-full w-8 h-8'/>
          <MdKeyboardArrowDown className='text-gray-400 text-14'/>
        </div>
        {/* {isClicked.notification && <Notification/>}
        {isClicked.userProfile && <UserProfile/>} */}
        
      </div>
    </div>
  )
}

export default Navbar