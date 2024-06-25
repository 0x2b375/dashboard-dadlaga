/* eslint-disable no-unused-vars */
import {Link, NavLink} from 'react-router-dom'
import { MdOutlineCancel } from 'react-icons/md'
import { SiShopware } from 'react-icons/si'
import {links} from '../data/dummy'
import {useStateContext} from '../contexts/ContextProvider'

const Sidebar = () => {
  const {activeMenu, setActiveMenu, screenSize} = useStateContext();

  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <= 900) {
      setActiveMenu(false)
    }
  }

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg bg-slate-200 m-2 text-slate-900';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-slate-200 dark:text-gray-200 hover:bg-slate-200 hover:text-slate-900 m-2';

  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
      {activeMenu && (<>
      <div className="flex justify-between items-center">
        <Link to='/' onClick={handleCloseSideBar} className='items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-200'>
          <SiShopware /> <span className='text-slate-200'>Дадлага</span>
        </Link>
        <button type='button' onClick={() => setActiveMenu((prevActiveMenu)=>!prevActiveMenu)} className='text-xl rounded-full p-3 hover:bg-gray-100 mt-4 block md:hidden'>
          <MdOutlineCancel/>
        </button>
      </div>
      <div className='mt-10'>
        {links.map((item) => ( 
          <div key={item.title}>
            <p className='text-gray-200 m-3 mt-4 uppercase'>
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