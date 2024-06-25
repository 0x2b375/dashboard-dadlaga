/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {FiSettings} from 'react-icons/fi'
import { Navbar, Footer, Sidebar, ThemeSettings } from './components'
import { Devices, Area, Bar, Line, Pie, Dashboard, Home } from './pages'
import {useStateContext} from './contexts/ContextProvider'
import './App.css';
import Map from './data/map';

const App = () => {
  const {activeMenu} = useStateContext();
  return (
    <BrowserRouter>
      <div className='flex relative dark:bg-main-dark-bg transition-all duration-300'>
        {activeMenu ? (
          <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-slate-600 transition-all duration-300'>
            <Sidebar/>
          </div>
        ) : (
          <div className='w-0 dark:bg-secondary-dark-bg transition-all duration-300'>
            <Sidebar />
          </div>
        )}
        <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full dark:text-white ${activeMenu ? 'md:ml-72' :'flex-2'}`}>
          <div className='fixed md:static dark:bg-main-dark-bg navbar w-full bg-slate-600 text-white'>
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
          </Routes>
        </div>
        </div>
      </div>
      
    </BrowserRouter>
)}
export default App