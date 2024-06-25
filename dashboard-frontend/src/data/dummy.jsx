/* eslint-disable no-unused-vars */
import React from "react";
import {
  AiOutlineCalendar,
  AiOutlineShoppingCart,
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineStock
} from "react-icons/ai";
import {
  FiShoppingBag,
  FiEdit,
  FiPieChart,
  FiBarChart,
  FiCreditCard,
  FiStar,
  FiShoppingCart,
  FiHome
} from "react-icons/fi";
import {
  BsKanban,
  BsBarChart,
  BsBoxSeam,
  BsCurrencyDollar,
  BsShield,
  BsChatLeft,
} from "react-icons/bs";
import { 
  MdOutlineGasMeter, 
  MdOutlinePublic 
} from "react-icons/md";
import { BiColorFill } from "react-icons/bi";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine, RiStockLine } from "react-icons/ri";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import { TiTick } from "react-icons/ti";
import { GiLouvrePyramid } from "react-icons/gi";
import { GrLocation } from "react-icons/gr";
import { TbSum } from "react-icons/tb";
export const links = [
  {
    title: 'Dashboard',
    links: [
      {
        name: 'home',
        icon: <FiHome />,
      },
    ],
  },

  {
    title: 'Pages',
    links: [
      {
        name: 'devices',
        icon: <MdOutlineGasMeter />,
      },
      {
        name: 'map',
        icon: <MdOutlinePublic />,
      },
      {
        name: 'Test',
        icon: <RiContactsLine />,
      },
    ],
  },
  
];
export const earningData = [
  {
    icon: <TbSum />,
    amount: '39,354',
    percentage: '',
    title: 'Test',
    iconColor: 'blue',
    iconBg: 'rgb(194, 194, 194)',
  },
  {
    icon: <BsBoxSeam />,
    amount: '39,354',
    percentage: '',
    title: 'Test',
    iconColor: 'blue',
    iconBg: 'rgb(194, 194, 194)',
  },
  {
    icon: <FiBarChart />,
    amount: '39,354',
    percentage: '',
    title: 'Test',
    iconColor: 'blue',
    iconBg: 'rgb(194, 194, 194)',
  },
  {
    icon: <HiOutlineRefresh />,
    amount: '39,354',
    percentage: '',
    title: 'Test',
    iconColor: 'blue',
    iconBg: 'rgb(194, 194, 194)',
  },
];
