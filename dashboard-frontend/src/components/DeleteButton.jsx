/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// DeleteButtonWithConfirmation.jsx
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';

const DeleteButton = ({ selectedDevice, setData, handleClose, accept, reject }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = () => {
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
        reject('Хүсэлт амжилтгүй боллоо.');
        console.error('Error', error);
      });

    handleCloseDialog();
    handleClose();
  };

  return (
    <>
      <Button sx={{
        '&:hover': {
          backgroundColor: '#2196f3', 
          color: '#ffffff',
        },
        color: 'red'
      }} onClick={handleClickOpen}>
        <MdDelete className='rounded-xl text-xl' />
      </Button>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Устгах уу?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Та энэ ${selectedDevice.device_user_id} төхөөрөмжийн хэрэглэгчийн мэдээллийг устгахдаа итгэлтэй байна уу?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Устгах
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Цуцлах
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButton;
