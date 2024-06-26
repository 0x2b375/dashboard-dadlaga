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
import { Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box, Drawer, Collapse, IconButton  } from '@mui/material';
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
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useStateContext } from '../contexts/ContextProvider';
import CloseIcon from '@mui/icons-material/Close'
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog'
import "./device.css"
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
  
  // useEffect(() => {
  //   const today = new Date().toISOString().split('T')[0];
  //   const storedDate = localStorage.getItem('requestDate');

  //   if (storedDate !== today) {
  //     localStorage.setItem('requestDate', today);
  //     localStorage.setItem('requestCount', '0');
  //   }
  // }, []);
  // const requestCount = parseInt(localStorage.getItem('requestCount'), 10);
  // localStorage.clear()
  // if (requestCount >= 3) {
  //   alert('You have reached the maximum number of requests for today.');
  //   return;
  // }

  const handleClickOpen = (device) => {
    setOpen(true);
    setSelectedDevice(device);
    setUserId('')
    setPosition([47.91885,106.91760])
    setAction('add')
  };

  const handle3times = (statusValue) => {
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
          // const newRequestCount = requestCount + 1;
          // localStorage.setItem('requestCount', newRequestCount.toString());

          console.log(response.data.response_datetime)

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
      header: 'Батгалгаажуулалт',
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

  const handleMapClick = (e) => {
    if (action !== 'map') {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setSelectedDevice((prev) => ({
        ...prev,
        device_user_geolocation_latitude: lat,
        device_user_geolocation_longitude: lng,
      }));
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click: handleMapClick,
    });

    return selectedDevice ? (
      <Marker position={position} />
    ) : null;
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
    { field: 'device_id', headerName: 'Төхөөрөмжийн ID', flex:2, headerAlign: 'start', headerClassName: 'super-app-theme--header',},
    { field: 'serial_number', headerName: 'Дугаар', headerAlign: 'start', flex:2,},
    { field: 'device_type', headerName: 'Төрөл', headerAlign: 'start', flex:1,
      renderCell: (params) => (
        <span style={{ color: params.value === 'Халуун' ? 'red' : 'blue' }}>{params.value}</span>
      ),
    },
    { field: 'status', headerName: 'Төлөв', headerAlign: 'start', flex:1,
      renderCell: (params) => (
        <span>{params.value === 'open' ? 'Нээлттэй' : 'Хаалттай'}</span>
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
            <IoIosGlobe className='rounded-xl hover:text-white text-xl' />
          </button>
        ) : (
          <button
            type='button'
            onClick={() => handleClickOpen(params.row)}
            className='m-3 text-gray-main'
          >
            <PiUserCirclePlusFill className='rounded-xl hover:text-white text-xl' />
          </button>
        )}
          <button
            type='button'
            className='text-gray-main'
            onClick={() => handleView(params.row)}
          >
            <BsEyeFill className='rounded-xl hover:text-white text-xl'/>
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
    <div className='h-screen overflow-auto mt-32 md:mt-8 '>
      <div className='m-2 p-2 sm:m-12 sm:p-12 md:m-8 md:p-8 flex justify-center flex-col items-center bg-table-bg rounded-2xl shadow-xl'>
        <div className=''>
            <Toast ref={toast} className='mt-24 md:mt-12'/>
            <ConfirmDialog />    
        </div>
        <ThemeProvider theme={theme}>
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
                  '& .MuiDataGrid-cell': {
                    color: 'rgba(255, 255, 255, 0.767)',
                    borderTopColor:'rgba(255, 255, 255, 0.10)',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    color:'rgba(255, 255, 255, 0.767)',
                    
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#21212d',
                    
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid rgba(255, 255, 255, 0.10)'
                  },
                  border: 'none',
                }}
              />
            </Box>
          </Box>
        </ThemeProvider>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{action === 'add' ? 'Төхөөрөмжийн мэдээлэл' : ''}</DialogTitle>
          <DialogContent>
            <div className='mt-2'>
              {action === 'add' && (
                <Grid container spacing={2}>
                  <TableContainer>
                      <Table sx={{minWidth:500}} aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Төхөөрөмжийн ID</TableCell>
                            <TableCell>Төхөөрөмжийн дугаар</TableCell>
                            <TableCell>Төрөл</TableCell>
                            <TableCell>Заалт</TableCell>
                            <TableCell>Он сар</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                                <TableCell>{selectedDevice.device_id}</TableCell>
                                <TableCell>{selectedDevice.serial_number}</TableCell>
                                <TableCell>{selectedDevice.device_type}</TableCell>
                                <TableCell>{selectedDevice.cumulative_flow}</TableCell>
                                <TableCell>{selectedDevice.received_datetime}</TableCell>
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
                        onChange={(e) => setUserId(e.target.value)}
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
                      />
                       <Box display="flex" gap="1rem">
                        <Button onClick={handleMapVisible} >
                          <p className='p-3 bg-main-bg rounded-lg hover:bg-slate-200 ml-2'>ГАЗРЫН ЗУРАГ</p>
                        </Button>
                        <Button onClick={()=> {
                          const dataToSend = {
                            device_id: selectedDevice.device_id,
                            device_user_id: userId, 
                            device_user_geolocation_latitude: selectedDevice.device_user_geolocation_latitude,
                            device_user_geolocation_longitude: selectedDevice.device_user_geolocation_longitude,
                          };
                      
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
                          <p className='p-3 bg-main-bg rounded-lg hover:bg-slate-200'>НЭМЭХ</p>
                        </Button>
                      </Box>
                      </Box>
                    </Grid>
                  {mapVisible && (
                    <Grid item xs={20}>
                      <Box mt={2} height="500px">
                        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <LocationMarker />
                        </MapContainer>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
              {action === 'map' && (
                <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <div>
                      Газрын зураг
                    </div>

                    <Box display="flex" justifyContent="end">
                      <Button style={{color: 'red'}} onClick={() => {
                        const dataToSend = {
                          device_id: selectedDevice.device_id,
                        };

                        axios.post('http://localhost:3001/api/user/delete', dataToSend, {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        })
                          .then(response => {
                            accept('Хэрэглэгчийн мэдээллийг амжилттай устгалаа.'); 
                            setData(prevData => 
                              prevData.map(device => 
                                device.device_id === selectedDevice.device_id 
                                  ? { ...device, device_user_id: null, device_user_geolocation_latitude: null, device_user_geolocation_longitude: null }
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
                        <MdDelete className='rounded-xl hover:bg-gray-300 text-xl' />
                      </Button>
                      <Button onClick={() => {
                        handleEdit(selectedDevice)
                      }}>
                        <MdEdit className='rounded-xl hover:bg-gray-300 text-xl' />
                      </Button>
                    </Box>
                  </Box>
                </Grid>
    
                <Grid item xs={20}>
                  <Box mt={2} height="500px">
                    <MapContainer center={position} zoom={20} style={{ height: "100%", width: "100%" }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker />
                    </MapContainer>
                  </Box>
                </Grid>
                
              </Grid>
              )}
              {action === 'edit' && (
                <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between">
                    <div>Газрын зураг</div>
                    <Button style={{color:'red'}} onClick={() => {
                      const dataToSend = {
                        device_id: selectedDevice.device_id,
                      };

                  
                      axios.post('http://localhost:3001/api/user/delete', dataToSend, {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      })
                        .then(response => {
                          accept('Хэрэглэгчийн мэдээллийг амжилттай устгалаа.'); 
                          setData(prevData => 
                            prevData.map(device => 
                              device.device_id === selectedDevice.device_id 
                                ? { ...device, device_user_id: null, device_user_geolocation_latitude: null, device_user_geolocation_longitude: null }
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
                      <MdDelete className='rounded-xl hover:bg-gray-300 text-xl' />
                    </Button>
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
                      />
                        <Button onClick={handleMapVisible} style={{marginLeft: '10px'}}>БАЙРШИЛ ӨӨРЧЛӨХ</Button>
                      <Button onClick={()=> {
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
                      }}>ХАДГАЛАХ</Button>
                    </Box>
                  </Grid>
    
                  {mapVisible && (
                    <Grid item xs={20}>
                      <Box mt={2} height="500px">
                        <MapContainer center={position} zoom={20} style={{ height: "100%", width: "100%" }}>
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <LocationMarker />
                        </MapContainer>
                      </Box>
                    </Grid>
                  )}
                
              </Grid>
              )}
              {action === 'view' && (
                <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <div>Төхөөрөмжийн мэдээлэл</div>
                    <Box display="flex" justifyContent="end">
                      <Button
                        className='mr-4'
                        onClick={() => handle3times('open')}
                        disabled={!selectedDevice.device_user_id}
                      >
                        <MdWaterDrop className='rounded-xl text-blue-500 hover:text-blue-800 text-2xl' />
                      </Button>
                      <Button
                        className=''
                        disabled={!selectedDevice.device_user_id}
                        onClick={() => handle3times('close')}
                      >
                        <MdOutlineInvertColorsOff className='rounded-xl text-blue-500 hover:text-blue-800 text-2xl' />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <TableContainer>
                      <Table sx={{minWidth:500}} aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Төхөөрөмжийн ID</TableCell>
                            <TableCell>Төхөөрөмжийн дугаар</TableCell>
                            <TableCell>Төрөл</TableCell>
                            <TableCell>Заалт</TableCell>
                            <TableCell>Он сар</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                                <TableCell>{selectedDevice.device_id}</TableCell>
                                <TableCell>{selectedDevice.serial_number}</TableCell>
                                <TableCell>{selectedDevice.device_type}</TableCell>
                                <TableCell>{selectedDevice.cumulative_flow}</TableCell>
                                <TableCell>{selectedDevice.received_datetime}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" className="date-box" mt={2}>
                    <Box display="flex" alignItems="center">
                      <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mr: 2 }}
                      />
                      <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <button className='ml-10' onClick={handleReset}>АРИЛГАХ</button>
                    </Box>
                  </Box>
                  <Box className='mt-2'>
                  <TableContainer className='flex justify-center items-center'>
                      <Table sx={{maxWidth:650}} size='small' aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Он сар</TableCell>
                            <TableCell>Заалт</TableCell>
                            <TableCell>Төлөв</TableCell>
                            <TableCell>Мэдээлэл</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredViewData.map((dev) => (
                              <TableRow key={dev.device_id} sx={{'&:last-child td, &:last-child th': { border: 0 }}}>
                                  <TableCell>{dev.received_datetime}</TableCell>
                                  <TableCell>{dev.cumulative_flow}</TableCell>
                                  <TableCell>{dev.status}</TableCell>
                                  <TableCell>battery: {dev.battery_status}V</TableCell>
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
          <DialogActions>
            <Button onClick={handleClose} style={{color:'black'}}>Хаах</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
    
  );
}

export default Devices;
