/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Header } from '../components';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box, Drawer  } from '@mui/material';
import { PiUserCirclePlusFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoIosGlobe } from "react-icons/io";
import DialogContentText from '@mui/material/DialogContentText';
import { BsEyeFill } from "react-icons/bs";
import Map from '../data/map';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const Devices = () => {
  const [action, setAction] = useState('');
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [userId, setUserId] = useState('');

  const [mapVisible, setMapVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [position, setPosition] = useState([47.92262, 106.92618]);

  const handleClickOpen = (device) => {
    setOpen(true);
    setSelectedDevice(device);
    setPosition([47.92262, 106.92618])
    setAction('add')
  };

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

  const handleView = (id) => {
    console.log("View", id);
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


  const columns = [
    { field: 'device_id', headerName: 'Төхөөрөмжийн ID', width: 130, headerAlign: 'start', headerClassName: 'super-app-theme--header',},
    { field: 'serial_number', headerName: 'Дугаар', headerAlign: 'start',},
    { field: 'device_type', headerName: 'Төрөл', headerAlign: 'start',
      renderCell: (params) => (
        <span style={{ color: params.value === 'Халуун' ? 'red' : 'blue' }}>{params.value}</span>
      ),
    },
    { field: 'status', headerName: 'Төлөв', headerAlign: 'start',
      renderCell: (params) => (
        <span>{params.value === 'open' ? 'Нээлттэй' : 'Хаалттай'}</span>
      ),
    },
    { field: 'cumulative_flow', headerName: 'Заалт', headerAlign: 'start',},
    { field: 'device_user_id', headerName: 'Хэрэглэгчийн ID', headerAlign: 'start',},
    { field: 'device_user_geolocation_latitude', headerName: 'Өргөрөг', headerAlign: 'start',},
    { field: 'device_user_geolocation_longitude', headerName: 'Уртраг', headerAlign: 'start',},
    { field: 'received_datetime', headerName: 'Сүүлд шинэчлэгдсэн хугацаа', headerAlign: 'start',},
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
            className='m-3 text-slate-500'
          >
            <IoIosGlobe className='rounded-xl hover:bg-gray-300 text-xl' />
          </button>
        ) : (
          <button
            type='button'
            onClick={() => handleClickOpen(params.row)}
            className='m-3 text-slate-500'
          >
            <PiUserCirclePlusFill className='rounded-xl hover:bg-gray-300 text-xl' />
          </button>
        )}
          <button
            type='button'
            className='text-slate-500'
            onClick={() => handleView(params.row.device_id)}
          >
            <BsEyeFill className='rounded-xl hover:bg-gray-300 text-xl'/>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className='flex flex-col mt-12'>
      <div className='m-2 md:m-8 p-2 md:p-8 flex justify-center flex-col items-center'>
        <div style={{ height: '500',}}>
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
              borderColor: ''
            }}
          />
        </div>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{action === 'add' ? 'Төхөөрөмжийн мэдээлэл' : action === 'map' ? 'Газрын Зураг' : ''}</DialogTitle>
          <DialogContent>
            <div className='mt-2'>
              {action === 'add' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Төхөөрөмжийн ID"
                      fullWidth
                      variant="outlined"
                      value={selectedDevice.device_id}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Дугаар"
                      fullWidth
                      variant="outlined"
                      value={selectedDevice.serial_number}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Төрөл"
                      fullWidth
                      variant="outlined"
                      value={selectedDevice.device_type}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Заалт"
                      fullWidth
                      variant="outlined"
                      value={selectedDevice.cumulative_flow}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Он сар"
                      fullWidth
                      variant="outlined"
                      value={selectedDevice.received_datetime}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between">
                      <TextField
                        margin="dense"
                        label="Хэрэглэгчийн ID"
                        variant="outlined"
                        style={{ flex: 1, marginRight: '10px' }}
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                      />
                      <TextField
                        margin="dense"
                        label="Хаяг"
                        variant="outlined"
                        style={{ flex: 1 }}
                        value={`${selectedDevice.device_user_geolocation_latitude || ''} ${selectedDevice.device_user_geolocation_longitude || ''}`}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between">
                      <Button onClick={handleMapVisible}>ГАЗРЫН ЗУРАГ</Button>
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
                            console.log('Backend Response:', response.data);
                            setData(prevData => [...prevData, dataToSend]);
                          })
                          .catch(error => {
                            console.error('Error', error);
                          });
                    
                        handleClose();
                      }}>НЭМЭХ</Button>
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
                  <Box display="flex" justifyContent="space-between">
                    <Button onClick={() => {
                      const dataToSend = {
                        device_id: selectedDevice.device_id,
                      };

                  
                      axios.post('http://localhost:3001/api/user/delete', dataToSend, {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      })
                        .then(response => {
                          console.log('Backend Response:', response.data);
                          setData(prevData => prevData.filter(device => device.device_id !== selectedDevice.device_id));
                        })
                        .catch(error => {
                          console.error('Error', error);
                        });
                  
                      handleClose();
                    }}>
                      <MdDelete className='rounded-xl hover:bg-gray-300 text-xl' />
                    </Button>
                    <Button onClick={()=> {
                      handleEdit(selectedDevice)
                    }}>
                      <MdEdit className='rounded-xl hover:bg-gray-300 text-xl' />
                    </Button>
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
                          console.log('Backend Response:', response.data);
                          setData(prevData => prevData.filter(item => item.device_id !== selectedDevice.device_id));
                          
                        })
                        .catch(error => {
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
                        variant="outlined"
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
                            console.log('Backend Response:', response.data);
                            setData(prevData => prevData.map(device => device.device_id === selectedDevice.device_id ? { ...device, ...dataToSend } : device));
                          })
                          .catch(error => {
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
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Хаах</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
    
  );
}

export default Devices;
