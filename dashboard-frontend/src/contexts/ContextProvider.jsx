/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, {createContext, useContext, useState} from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
}

export const ContextProvider = ({children}) => {

  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setisClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined)
  const [darkMode, setDarkMode] = useState(true)
  const handleClick = (clicked) => {
    setisClicked({ ...initialState, [clicked] : true});
  }
  return (
    <StateContext.Provider
      value={{
        activeMenu, 
        setActiveMenu,
        isClicked,
        setisClicked,
        handleClick,
        screenSize, 
        setScreenSize,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);