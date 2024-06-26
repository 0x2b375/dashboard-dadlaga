/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { FaCirclePlus } from "react-icons/fa6";
import { Header } from '../components';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { TbMapPlus } from "react-icons/tb";
import { Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box, Drawer, Collapse, IconButton, useTheme  } from '@mui/material';
import { PiUserCirclePlusFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdOutlineInvertColorsOff } from "react-icons/md";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { MdWaterDrop } from "react-icons/md";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IoIosGlobe } from "react-icons/io";
import DialogContentText from '@mui/material/DialogContentText';
import { BsEyeFill } from "react-icons/bs";
import Map from '../data/map';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { useStateContext } from '../contexts/ContextProvider';
import CloseIcon from '@mui/icons-material/Close'
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog'
import "./device.css"
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DeleteButton from '../components/DeleteButton';
import MapComponent from '../components/MapComponent';
import { FiCreditCard, FiMail, FiUser, FiUsers } from "react-icons/fi";
import Card from '../components/Card';
import { IoMdCheckmark } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { addRequest, resetRequests } from '../../redux/requestSlice';



const Devices = () => {
  const [filteredViewData, setFilteredViewData] = useState([]);
  const [action, setAction] = useState('');
  const [data, setData] = useState([]);
  const [viewData, setViewData] = useState([])
  const [open, setOpen] = React.useState(false);
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [position, setPosition] = useState([47.91885,106.91760]);
  const toast = useRef(null);
  const {darkMode} = useStateContext();
  const [userIdError, setUserIdError] = useState('');
  const [locationError, setLocationError] = useState('false')
  const [formTouched, setFormTouched] = useState(false);
  const dispatch = useDispatch();
  const requestData = useSelector((state) => state.requests.requestData);

  const handleUserIdChange = (e) => {
    const value = e.target.value
    setUserId(value);

    if (!value.trim()) {
      setUserIdError(true);
    } else {
      setUserIdError(false);
    }
  };

  useEffect(() => {
    const latitude = selectedDevice.device_user_geolocation_latitude;
    const longitude = selectedDevice.device_user_geolocation_longitude;

    if (formTouched && latitude === null) {
      setLocationError(true);
    } else {
      setLocationError(false);
    }
  }, [selectedDevice]);

  const getStatus = (status) => {
    return status === 'open' ? <IoMdCheckmark /> : <MdClear />;
  }

  const handleClickOpen = (device) => {
    setOpen(true);
    setSelectedDevice(device);
    setUserId('')
    setPosition([47.91885,106.91760])
    setUserIdError(false)
    setLocationError(false)
    setAction('add')
  };

  const handle3times = (statusValue) => {

    const today = new Date().toISOString().split('T')[0];
    dispatch(resetRequests());
    // if (!requestData[today]) {
    //   dispatch(resetRequests());
    // }
    const requestCount = requestData[today] ? requestData[today].count : 0;

    if (requestCount >= 3) {
      setOpen(false)
      reject('Та өнөөдрийн хязгаартаа хүрсэн байна.')
      return;
    }

    const dataToSend = {
      device_id: selectedDevice.device_id,
      status_value: statusValue,
    };

    axios.post('http://localhost:3001/api/device/status', dataToSend, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        if (response.status === 200) {
          console.log(response.data.response_datetime);
          dispatch(addRequest(response.data.response_datetime));

          if (statusValue === 'open') {
            confirm1('Тоолуурын хаалт нээх хүсэлт илгээхдээ итгэлтэй байна уу?', 'Тоолуурын хаалт нээх хүсэлт амжилттай илгээгдлээ.', 'Хүсэлт амжилтгүй боллоо.');
          } else {
            confirm1('Тоолуурын хаалт хаах хүсэлт илгээхдээ итгэлтэй байна уу?', 'Тоолуурын хаалт хаах хүсэлт амжилттай илгээгдлээ.', 'Хүсэлт амжилтгүй боллоо.');
          }

          setData(prevData => prevData.map(device => device.device_id === selectedDevice.device_id ? { ...device, ...dataToSend } : device));
        }
      })
      .catch(error => {
        reject('Хүсэлт амжилтгүй боллоо.');
        console.error('Error', error);
      });
  };

  const accept = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Баталгаажлаа', detail: msg, life: 3000 });
  }

  const reject = (msg) => {
      toast.current.show({ severity: 'warn', summary: 'Амжилтгүй', detail: msg, life: 3000 });
  }

  const confirm1 = (msg, acceptMsg, rejectMsg) => {
    confirmDialog({
      message: msg,
      header: 'Баталгаажуулалт',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => accept(acceptMsg),
      reject: () => reject(rejectMsg),
      acceptClassName: 'custom-accept-button',
      rejectClassName: 'custom-reject-button',
      acceptLabel: 'Тийм', 
      rejectLabel: 'Үгүй'
    });
    handleClose()
  };

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
  }

  const handleMapVisible = () => {
    setMapVisible(prevMapVisible => ! prevMapVisible)
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedDevice('');
    setMapVisible(false);
    setAction('')
  };

  useEffect(() => {
    axios.post('http://localhost:3001/api/devices')
      .then(response => {
        setData(response.data.body);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }, []);

  const handleView = (device) => {
    setSelectedDevice(device)
    setAction('view')
    axios.post('http://localhost:3001/api/device/view', device,{
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response=> {
        setViewData(response.data.body)
      }).catch(error => {
        console.error('Error', error);
      });
    setOpen(true)
  };

  const handleMap = (device) => {
    setSelectedDevice(device);
    const latitude = device.device_user_geolocation_latitude
    const longitude = device.device_user_geolocation_longitude
    setPosition([latitude, longitude]);
    setOpen(true);
    setAction('map');
  };

  const handleEdit = (device) => {
    setSelectedDevice(device)
    const latitude = device.device_user_geolocation_latitude
    const longitude = device.device_user_geolocation_longitude
    setPosition([latitude, longitude]);
    setUserId(device.device_user_id)
    setOpen(true);
    setAction('edit');
  }

  const filterDataByDate = () => {
    if (startDate && endDate) {
      const filteredData = viewData.filter((dev) => {
        const devDate = new Date(dev.received_datetime);
        return devDate >= new Date(startDate) && devDate <= new Date(endDate);
      });
      setFilteredViewData(filteredData);
    } else {
      setFilteredViewData(viewData);
    }
  };

  useEffect(() => {
    filterDataByDate();
  }, [startDate, endDate, viewData]);
  
  const columns = [
    { field: 'device_id', headerName: 'Төхөөрөмжийн ID', flex:2, headerAlign: 'start',},
    { field: 'serial_number', headerName: 'Дугаар', headerAlign: 'start', flex:2,},
    { field: 'device_type', headerName: 'Төрөл', headerAlign: 'start', flex:1,
      renderCell: (params) => (
        <span className={`text-sm flex justify-center rounded-md p-1 text-neutral-100 ${params.value === 'Халуун' ? 'bg-red-500' : 'bg-blue-400'}`}>{params.value}</span>
      ),
    },
    { field: 'status', headerName: 'Төлөв', headerAlign: 'start', flex:1, 
      renderCell: (params) => (
        <span className='text-xl flex justify-center'>{params.value === 'open' ? <IoMdCheckmark /> : <MdClear />}</span>
      ),
    },
    { field: 'cumulative_flow', headerName: 'Заалт', headerAlign: 'start', flex:1, },
    { field: 'device_user_id', headerName: 'Хэрэглэгчийн ID', headerAlign: 'start', flex:1,},
    { field: 'device_user_geolocation_latitude', headerName: 'Өргөрөг', headerAlign: 'start', flex:1,},
    { field: 'device_user_geolocation_longitude', headerName: 'Уртраг', headerAlign: 'start', flex:1,},
    { field: 'received_datetime', headerName: 'Сүүлд шинэчлэгдсэн хугацаа', headerAlign: 'start', flex:2,},
    {
      field: 'actions',
      headerName: 'Үйлдэл',
      headerAlign: 'start',
      renderCell: (params) => (
        <div className=''>
         {params.row.device_user_id ? (
          <button
            type='button'
            onClick={() => handleMap(params.row)}
            className='m-3 text-gray-main'
          >
            <IoIosGlobe className='rounded-xl dark:hover:text-white hover:text-slate-900 text-xl' />
          </button>
        ) : (
          <button
            type='button'
            onClick={() => handleClickOpen(params.row)}
            className='m-3 text-gray-main'
          >
            <PiUserCirclePlusFill className='rounded-xl dark:hover:text-white text-xl hover:text-slate-900' />
          </button>
        )}
          <button
            type='button'
            className='text-gray-main'
            onClick={() => handleView(params.row)}
          >
            <BsEyeFill className='rounded-xl dark:hover:text-white hover:text-slate-900 text-xl'/>
          </button>
        </div>
      ),
    },
  ];

  const theme = createTheme({
    components: {
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: 'rgba(255, 255, 255, 0.767)',
          },
        },
      },
    },
  });

  return (
    <div className={`${darkMode && 'dark'}`}>
      <div className="p-4 mx-4 max-md:mt-16 max-md:mx-8">
        <p className="text-xl font-semibold mb-2">Settings</p>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card
            title="Account"
            subtitle="Manage profile"
            href="#"
            Icon={FiUser}
          />
          <Card title="Email" subtitle="Manage email" href="#" Icon={FiMail} />
          <Card title="Team" subtitle="Manage team" href="#" Icon={FiUsers} />
          <Card
            title="Billing"
            subtitle="Manage cards"
            href="#"
            Icon={FiCreditCard}
          />
        </div>
      </div>
      <div className='max-sm:m-12 m-8 max-md:mx-12 p-2 flex justify-center flex-col items-center dark:bg-table-bg bg-white rounded-2xl shadow-xl'>
        <div className=''>
            <Toast ref={toast} className='mt-24 md:mt-12'/>
            <ConfirmDialog />    
        </div>
        <createTheme>
          <Box sx={{ overflow: "auto" }}>
            <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
              <DataGrid
                rows={data}
                rowHeight={45}
                autoHeight
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.device_id}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 }, 
                  },
                }}
                pageSizeOptions={[5, 10, 20, 50]} 
                slots={{toolbar: GridToolbar}}
                sx={{
                  '--unstable_DataGrid-radius': '0px',
                  '--DataGrid-rowBorderColor': darkMode ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.167)', 
                  '& .MuiDataGrid-cell': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666',
                    border: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start', 
                  },
                  '& .MuiDataGrid-selectedRowCount': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.867)' : 'rgba(0, 0, 0, 0.9)',
                    fontSize: '1rem'
                  },
                  '& .MuiSelect-icon': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: darkMode ? '#21212d' : 'white',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)',
                  },
                  '& .MuiTablePagination-root': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666',
                  },
                  '& .MuiTablePagination-actions .MuiButtonBase-root': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666',
                  },
                  '& .MuiDataGrid-toolbarContainer': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666',
                  },
                  '& .MuiButtonBase-root': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666',
                  },
                  border: 'none',
                }}
              />
            </Box>
          </Box>
        </createTheme>
        
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth className={`${darkMode && 'dark'}`}>
          <DialogTitle className='dark:text-neutral-100 dark:bg-table-bg bg-white'>{action === 'add' ? 'Төхөөрөмжийн мэдээлэл' : ''}</DialogTitle>
          <DialogContent className='dark:bg-table-bg bg-white'>
            <div className='mt-2'>
              {action === 'add' && (
                <Grid container spacing={2}>
                  <TableContainer>
                    <Table sx={{ minWidth: 500 }} aria-label='simple table'>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Төхөөрөмжийн ID</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Төхөөрөмжийн дугаар</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Төрөл</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Заалт</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Он сар</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.device_id}</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.serial_number}</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.device_type}</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.cumulative_flow}</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.received_datetime}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Grid item xs={12}>
                    <Box display="flex">
                      <TextField
                        margin="dense"
                        required
                        label="Хэрэглэгчийн ID"
                        variant="outlined"
                        style={{ marginRight: '10px' }}
                        value={userId}
                        onChange={handleUserIdChange}
                        error={userIdError}
                        helperText={userIdError ? 'Хэрэглэгчийн ID хоосон байж болохгүй' : ''}
                        sx={{
                          '& .MuiInputBase-input': {
                            color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '& .MuiInputLabel-root': {
                            color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                            },
                            '&:hover fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                            },
                          },
                        }}
                      />
                      <TextField
                        margin="dense"
                        required
                        label="Хаяг"
                        style={{ flex: 1 }}
                        variant="standard"
                        value={`${selectedDevice.device_user_geolocation_latitude || ''} ${selectedDevice.device_user_geolocation_longitude || ''}`}
                        InputProps={{
                          readOnly: true,
                        }}              
                        error={locationError}
                        helperText={locationError ? "Хэрэглэгчийн хаяг хоосон байж болохгүй" : ""}
                        sx={{
                          '& .MuiInputBase-input': {
                            color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },        
                          '& .MuiInputLabel-root': {
                            color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '& .MuiInput-underline:before': {
                            borderBottomColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '&:hover:not(.Mui-disabled):before': {
                            borderBottomColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '&.Mui-focused:after': {
                            borderBottomColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666',
                          },
                        }}     
                      />
                       <Box display="flex" gap="1rem">
                        <button onClick={handleMapVisible}>
                          <p className='p-3 rounded-md text-gray-500 dark:text-neutral-300 hover:text-neutral-100 hover:bg-blue-700 ml-1'>ГАЗРЫН ЗУРАГ</p>
                        </button>
                        <button onClick={()=> {
                          const dataToSend = {
                            device_id: selectedDevice.device_id,
                            device_user_id: userId, 
                            device_user_geolocation_latitude: selectedDevice.device_user_geolocation_latitude,
                            device_user_geolocation_longitude: selectedDevice.device_user_geolocation_longitude,
                          };

                          let hasError = false;
                          
                          if (userId === '') {
                            setUserIdError(true)
                            hasError = true;
                          } else {
                            setUserIdError(false)
                          }

                          if(selectedDevice.device_user_geolocation_latitude === null) {
                            setLocationError(true)  
                            hasError = true;
                          } else {
                            setLocationError(false)
                          }

                          if (hasError) {
                            return;
                          }

                      
                          axios.post('http://localhost:3001/api/user', dataToSend, {
                            headers: {
                              "Content-Type": "application/json",
                            },
                          })
                            .then(response => {
                              accept('Хэрэглэгчийг амжилттай нэмлээ'); 
                              setData(prevData => 
                                prevData.map(device => 
                                  device.device_id === selectedDevice.device_id 
                                    ? { ...device, ...dataToSend } 
                                    : device
                                )
                              );
                            

                            })
                            .catch(error => {
                              reject('Хүсэлт амжилтгүй боллоо.')
                              console.error('Error', error);
                            });
                      
                          handleClose();
                        }}>
                          <p className='p-3 bg-blue-700 rounded-md hover:bg-blue-800 text-neutral-100'>НЭМЭХ</p>
                        </button>
                      </Box>
                      </Box>
                    </Grid>
                  {mapVisible && (
                    <Grid item xs={20}>
                      <MapComponent 
                        position={position} 
                        action={action} 
                        selectedDevice={selectedDevice} 
                        setPosition={setPosition} 
                        setSelectedDevice={setSelectedDevice}  
                      />
                    </Grid>
                  )}
                </Grid>
              )}
              {action === 'map' && (
                <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <div className='dark:text-white'>
                      Газрын зураг
                    </div>

                    <Box display="flex" justifyContent="end">
                      <DeleteButton
                        selectedDevice={selectedDevice} 
                        setData={setData} 
                        handleClose={handleClose}
                        accept={accept}
                        reject={reject}
                      />
                      <Button onClick={() => {
                        handleEdit(selectedDevice)
                      }}  sx={{
                        '&:hover': {
                          backgroundColor: '#2196f3', 
                          color: '#ffffff',
                        },
                      }}>
                        <MdEdit className='rounded-xl text-xl' />
                      </Button>
                    </Box>
                  </Box>
                </Grid>
    
                <Grid item xs={20}>
                  <Box mt={2} height="500px">
                    <MapComponent 
                          position={position} 
                          action={action} 
                          selectedDevice={selectedDevice} 
                          setPosition={setPosition} 
                          setSelectedDevice={setSelectedDevice}  
                        />
                  </Box>
                </Grid>
                
              </Grid>
              )}
              {action === 'edit' && (
                <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between">
                    <div className='dark:text-white text-black'>Газрын зураг</div>
                    <DeleteButton
                        selectedDevice={selectedDevice} 
                        setData={setData} 
                        handleClose={handleClose}
                        accept={accept}
                        reject={reject}
                      />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between">
                      <TextField
                        margin="dense"
                        label="Хэрэглэгчийн ID"
                        variant="outlined"
                        style={{ flex: 1, marginRight: '10px', maxWidth: '200px' }}
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        sx={{
                          '& .MuiInputBase-input': {
                            color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '& .MuiInputLabel-root': {
                            color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                            },
                            '&:hover fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                            },
                          },
                        }}
                      />
                      <TextField
                        margin="dense"
                        label="Хаяг"
                        variant="standard"
                        style={{ flex: 1, maxWidth: '300px' }}
                        value={`${selectedDevice.device_user_geolocation_latitude || ''} ${selectedDevice.device_user_geolocation_longitude || ''}`}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          '& .MuiInputBase-input': {
                            color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },        
                          '& .MuiInputLabel-root': {
                            color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '& .MuiInput-underline:before': {
                            borderBottomColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '&:hover:not(.Mui-disabled):before': {
                            borderBottomColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', 
                          },
                          '&.Mui-focused:after': {
                            borderBottomColor: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666',
                          },
                        }}   
                      />
                        <button onClick={handleMapVisible} ><p className='p-3 ml-2 text-gray-500 text-base dark:text-neutral-300 hover:bg-blue-700 rounded-md hover:text-white'>БАЙРШИЛ ӨӨРЧЛӨХ</p></button>
                      <button onClick={()=> {
                         const dataToSend = {
                          device_id: selectedDevice.device_id,
                          device_user_id: userId,
                          device_user_geolocation_latitude: selectedDevice.device_user_geolocation_latitude,
                          device_user_geolocation_longitude: selectedDevice.device_user_geolocation_longitude,
                        };
  
                    
                        axios.post('http://localhost:3001/api/user/edit', dataToSend, {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        })
                          .then(response => {
                            accept('Хэрэглэгчийн мэдээллийг амжилттай өөрчиллөө.'); 
                            setData(prevData => prevData.map(device => device.device_id === selectedDevice.device_id ? { ...device, ...dataToSend } : device));
                          })
                          .catch(error => {
                            reject('Хүсэлт амжилтгүй боллоо.')
                            console.error('Error', error);
                          });
                    
                        handleClose();
                      }}><p className='text-neutral-100 p-3 dark:text-neutral-300 hover:bg-blue-800 bg-blue-700 rounded-md text-base'>ХАДГАЛАХ</p></button>
                    </Box>
                  </Grid>
    
                  {mapVisible && (
                    <Grid item xs={20}>
                      <Box mt={2} height="500px">
                        <MapComponent 
                          position={position} 
                          action={action} 
                          selectedDevice={selectedDevice} 
                          setPosition={setPosition} 
                          setSelectedDevice={setSelectedDevice}  
                        />
                      </Box>
                    </Grid>
                  )}
                
              </Grid>
              )}
              {action === 'view' && (
                <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <div className='dark:text-white text-black'>Төхөөрөмжийн мэдээлэл</div>
                    <Box display="flex" justifyContent="end">
                      <Button
                        className='mr-4'
                        sx={{
                          '&:hover': {
                            backgroundColor: '#2196f3', 
                            color: '#ffffff',
                          },
                          color:'rgb(59 130 246)',
                          '&.Mui-disabled': {
                          color: darkMode ? 'rgba(255, 255, 255, 0.425)' : '', 
                          },
                        }}
                        onClick={() => handle3times('open')}
                        disabled={!selectedDevice.device_user_id}
                      >
                        <MdWaterDrop className='rounded-xl text-2xl' />
                      </Button>
                      <Button
                        className=''
                        sx={{
                          '&:hover': {
                            backgroundColor: '#2196f3', 
                            color: '#ffffff',
                          },
                          color:'rgb(59 130 246)',
                          '&.Mui-disabled': {
                            color: darkMode ? 'rgba(255, 255, 255, 0.425)' : '', 
                          },
                        }}
                        disabled={!selectedDevice.device_user_id}
                        onClick={() => handle3times('close')}
                      >
                        <MdOutlineInvertColorsOff className='rounded-xl text-2xl' />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <TableContainer>
                      <Table sx={{minWidth:500}} aria-label='simple table'>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Төхөөрөмжийн ID</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Төхөөрөмжийн дугаар</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Төрөл</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Заалт</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Он сар</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.device_id}</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.serial_number}</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.device_type}</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.cumulative_flow}</TableCell>
                          <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{selectedDevice.received_datetime}</TableCell>
                        </TableRow>
                      </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" className="date-box" mt={2}>
                    <Box display="flex" alignItems="center">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start Date"
                        value={startDate ? dayjs(startDate) : null}
                        onChange={(newValue) => setStartDate(newValue ? newValue.toISOString() : '')}
                        slotProps={{
                          textField: {
                            variant: 'outlined',
                            InputLabelProps: { shrink: true },
                            InputProps: {
                              sx: {
                                '& .MuiInputBase-input': {
                                  color: darkMode ? 'rgba(255, 255, 255, 0.767)' : 'rgba(0, 0, 0, 0.767)',
                                },
                                '& .MuiSvgIcon-root': {
                                  color: darkMode ? 'rgba(255, 255, 255, 0.867)' : 'rgba(0, 0, 0, 0.767)',
                                },
                              },
                            },
                            sx: {
                              '& .MuiInputLabel-root': {
                                color: darkMode ? 'rgba(255, 255, 255, 0.767)' : 'rgba(0, 0, 0, 0.767)',
                              },
                              mr: 2,
                              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.467)' : '',
                                },
                            },
                          },
                        }}
                      />
                      <DatePicker
                        label="End Date"
                        value={endDate ? dayjs(endDate) : null}
                        onChange={(newValue) => setEndDate(newValue ? newValue.toISOString() : '')}
                        slotProps={{
                          textField: {
                            variant: 'outlined',
                            InputLabelProps: { shrink: true },
                            InputProps: {
                              sx: {
                                '& .MuiInputBase-input': {
                                  color: darkMode ? 'rgba(255, 255, 255, 0.767)' : 'rgba(0, 0, 0, 0.767)',
                                },
                                '& .MuiSvgIcon-root': {
                                  color: darkMode ? 'rgba(255, 255, 255, 0.867)' : 'rgba(0, 0, 0, 0.767)',
                                },
                              },
                            },
                            sx: {
                              '& .MuiInputLabel-root': {
                                color: darkMode ? 'rgba(255, 255, 255, 0.767)' : 'rgba(0, 0, 0, 0.767)',
                              },
                              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.467)' : '',
                                },
                            },
                          },
                        }}
                      />
                      </LocalizationProvider>
                      <button className='ml-10 dark:text-neutral-200 text-white bg-blue-700 p-2 rounded-md hover:bg-blue-800' onClick={handleReset}>АРИЛГАХ</button>
                    </Box>
                  </Box>
                  <Box className='mt-2'>
                  <TableContainer className='flex justify-center items-center'>
                      <Table sx={{maxWidth:850}} size='small' aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Он сар</TableCell>
                            <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Заалт</TableCell>
                            <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Төлөв</TableCell>
                            <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>Мэдээлэл</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredViewData.map((dev) => (
                              <TableRow key={dev.device_id} sx={{'&:last-child td, &:last-child th': { border: 0 }}}>
                                  <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{dev.received_datetime}</TableCell>
                                  <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{dev.cumulative_flow}</TableCell>
                                  <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{getStatus(dev.status)}</TableCell>
                                  <TableCell sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.767)' : '#465666', borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(0, 0, 0, 0.167)' }}>{dev.battery_status ? `Баттерэй: ${dev.battery_status}V` : 'Баттерэй:'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
              )}
            </div>
          </DialogContent>
          <DialogActions className='dark:bg-table-bg bg-white'>
            <Button onClick={handleClose} sx={{
                        '&:hover': {
                          backgroundColor: '#2196f3', 
                          color: '#ffffff',
                        },
                        color: darkMode ? 'white' : 'black',
                      }}>Хаах</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
    
  );
}

export default Devices;
