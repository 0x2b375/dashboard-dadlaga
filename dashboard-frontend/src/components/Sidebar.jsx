/* eslint-disable no-unused-vars */
import {Link, NavLink} from 'react-router-dom'
import { MdOutlineCancel } from 'react-icons/md'
import { SiShopware } from 'react-icons/si'
import {links} from '../data/dummy'
import {useStateContext} from '../contexts/ContextProvider'

const Sidebar = () => {
  const {activeMenu, setActiveMenu, screenSize, darkMode} = useStateContext();

  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <= 900) {
      setActiveMenu(false)
    }
  }

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg bg-slate-200 m-2 text-slate-900';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-500 dark:text-slate-200 hover:bg-gray-200 hover:text-slate-900 m-2';

  return (
    <div className={`ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 z-0 relative ${darkMode && 'dark'}`}>
      {activeMenu && (<>
      <div className="flex justify-between items-center">
        <Link to='/' onClick={handleCloseSideBar} className='items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-slate-200 text-slate-900'>
          <SiShopware /> <span className='text-slate-900 dark:text-slate-200'>Дадлага</span>
        </Link>
        <button type='button' onClick={() => setActiveMenu((prevActiveMenu)=>!prevActiveMenu)} className='text-xl rounded-full p-3 hover:bg-gray-900 text-gray-500 mt-4 block md:hidden'>
          <MdOutlineCancel/>
        </button>
      </div>
      <div className='mt-10'>
        {links.map((item) => ( 
          <div key={item.title}>
            <p className='text-slate-900 dark:text-slate-200 font-semibold m-3 mt-4 uppercase'>
            {item.title}
            </p>
            {item.links.map((link) => (
              <NavLink to={`${link.name}`} key={link.name} 
              onClick={handleCloseSideBar} 
              className={({ isActive }) => 
              isActive ? activeLink : 
              normalLink }
              >
                {link.icon}
                <span className='capitalize'>
                  {link.name}
                </span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
      </>)}
    </div>
  )
}

export default Sidebar