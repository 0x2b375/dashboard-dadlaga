/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Button from '../components/Button';
import { earningData } from '../data/dummy';
import Map from '../data/map';


const years = [
  new Date(1990, 0, 1),
  new Date(1991, 0, 1),
  new Date(1992, 0, 1),
  new Date(1993, 0, 1),
  new Date(1994, 0, 1),
  new Date(1995, 0, 1),
  new Date(1996, 0, 1),
  new Date(1997, 0, 1),
  new Date(1998, 0, 1),
  new Date(1999, 0, 1),
  new Date(2000, 0, 1),
  new Date(2001, 0, 1),
  new Date(2002, 0, 1),
  new Date(2003, 0, 1),
  new Date(2004, 0, 1),
  new Date(2005, 0, 1),
  new Date(2006, 0, 1),
  new Date(2007, 0, 1),
  new Date(2008, 0, 1),
  new Date(2009, 0, 1),
  new Date(2010, 0, 1),
  new Date(2011, 0, 1),
  new Date(2012, 0, 1),
  new Date(2013, 0, 1),
  new Date(2014, 0, 1),
  new Date(2015, 0, 1),
  new Date(2016, 0, 1),
  new Date(2017, 0, 1),
  new Date(2018, 0, 1),
];

const FranceGDPperCapita = [
  28129, 28294.264, 28619.805, 28336.16, 28907.977, 29418.863, 29736.645, 30341.807,
  31323.078, 32284.611, 33409.68, 33920.098, 34152.773, 34292.03, 35093.824,
  35495.465, 36166.16, 36845.684, 36761.793, 35534.926, 36086.727, 36691, 36571,
  36632, 36527, 36827, 37124, 37895, 38515.918,
];

const UKGDPperCapita = [
  26189, 25792.014, 25790.186, 26349.342, 27277.543, 27861.215, 28472.248, 29259.764,
  30077.385, 30932.537, 31946.037, 32660.441, 33271.3, 34232.426, 34865.78,
  35623.625, 36214.07, 36816.676, 36264.79, 34402.36, 34754.473, 34971, 35185, 35618,
  36436, 36941, 37334, 37782.83, 38058.086,
];

const GermanyGDPperCapita = [
  25391, 26769.96, 27385.055, 27250.701, 28140.057, 28868.945, 29349.982, 30186.945,
  31129.584, 32087.604, 33367.285, 34260.29, 34590.93, 34716.44, 35528.715,
  36205.574, 38014.137, 39752.207, 40715.434, 38962.938, 41109.582, 43189, 43320,
  43413, 43922, 44293, 44689, 45619.785, 46177.617,
];

const Home = () => {
  return (
    <div className="mt-12">
      <div className="flex flex-wrap justify-center flex-col gap-5 m-8">
        <div className="mt-12 flex bg-table-bg rounded-2xl">
              <LineChart
              xAxis={[
                {
                  id: 'Years',
                  data: years,
                  scaleType: 'time',
                  valueFormatter: (date) => date.getFullYear().toString(),
                },
              ]}
              series={[
                {
                  id: 'France',
                  label: 'Хүйтэн',
                  data: FranceGDPperCapita,
                  stack: 'total',
                  area: true,
                  showMark: false,
                },
                {
                  id: 'Germany',
                  label: 'Халуун',
                  data: GermanyGDPperCapita,
                  stack: 'total',
                  area: true,
                  showMark: false,
                },
                {
                  id: 'United Kingdom',
                  label: 'Нийт',
                  data: UKGDPperCapita,
                  stack: 'total',
                  area: true,
                  showMark: false,
                },
              ]}
              width={1000}
              height={500}
              margin={{ left: 70 }}
            />
        </div>
        <div className='rounded-2xl'>
          <Map className=''/>
        </div>


      {/* <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-400">Test</p>
            <p className="text-2xl">63,448.78</p>
          </div>
        </div>
        <div className="mt-6">
          <Button 
            color='white' 
            bgColor='black' 
            text='download' 
            borderRadius='10px' 
            size='md'
          />
        </div>
      </div> */}   
      {/* <div className='flex m-3 flex-wrap justify-center gap-3 items-center'>
        {earningData.map((item) => (
          <div key={item.title} className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl'>
            <button type="button" style={{color:item.iconColor, backgroundColor: item.iconBg}} 
            className='text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl'>
              {item.icon}
            </button>
            <p className='mt-3'>
              <span className='text-lg font-semibold'>
                {item.amount}
              </span>
              <span className={`text-sm text-${item.pcColor}  ml-2`}>
                {item.percentage}
              </span>
            </p>
            <p className='text-sm text-gray-400 mt-1'>
              {item.title}
            </p>
          </div>
        ))}
      </div> */}
      </div>
    </div>
  );
};

export default Home;
