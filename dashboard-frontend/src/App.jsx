/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {FiSettings} from 'react-icons/fi'
import { Navbar, Footer, Sidebar } from './components'
import { Devices, Area, Bar, Line, Pie, Dashboard, Home } from './pages'
import {useStateContext} from './contexts/ContextProvider'
import './App.css';
import Map from './data/map';
import NotFoundPage from './components/NotFoundPage';
const App = () => {
  const {activeMenu, darkMode} = useStateContext();
  return (
    <BrowserRouter>
      <div className={`flex relative z-0 ${darkMode && 'dark'}`}>
        {activeMenu ? (
          <div className='w-72 fixed sidebar dark:bg-secondary-bg bg-light-bg'>
            <Sidebar/>
          </div>
        ) : (
          <div className='w-0 dark:bg-secondary-bg bg-light-bg'>
            <Sidebar />
          </div>
        )}
        <div className={`dark:bg-main-bg dark:text-neutral-100 bg-light-bg min-h-screen w-full  ${activeMenu ? 'md:ml-72' :'flex-2'}`}>
          <div className='fixed md:static dark:bg-secondary-bg dark:text-neutral-100 navbar w-full bg-light-bg text-gray-500'>
            <Navbar />
          </div>
        
        <div>
          <Routes>
            {/* Dashboard */}
            <Route path='/' element={<Home />}/>
            <Route path='/home' element={<Home />}/>
            {/* Pages */}
            <Route path='/devices' element={<Devices />}/>  
            <Route path='/map' element={<Map />}/> 
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        </div>
      </div>
      
    </BrowserRouter>
)}
export default App