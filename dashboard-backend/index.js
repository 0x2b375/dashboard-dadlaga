const express = require("express");
const axios = require("axios");
const cors = require("cors");
const port = 3001;
require("dotenv").config();
const app = express();
app.use(express.json());

const loginUrl = process.env.LOGIN_URL;
// const deviceUrl = process.env.DEVICE_URL;
const devicesMononetUrl = process.env.DEVICESMONONET_URL;
const userDataUrl = process.env.USERDATA_URL;
const deleteUrl = process.env.DELETEURL;
const putUrl = process.env.PUTURL;
const statusUrl = process.env.STATUSURL;
const devicesDetailsUrl = process.env.DEVICESDETAIL_URL;


const loginPayload = {
  username: process.env.LOGIN_USERNAME,
  password: process.env.LOGIN_PASSWORD,
};

const companyIdPayload = {
  company_id: process.env.COMPANY_ID,
};

app.use(cors());

app.post("/api/devices", async (req, res) => {
  try {
    const loginResponse = await axios.post(loginUrl, loginPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const accessToken = loginResponse.data.tokens.access;

    const deviceResponse = await axios.post(
      devicesMononetUrl,
      companyIdPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-type": "application/json",
        },
      }
    );

    res.json(deviceResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/api/user", async (req, res) => {
  try {
    const loginResponse = await axios.post(loginUrl, loginPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const accessToken = loginResponse.data.tokens.access;

    await axios.post(userDataUrl, req.body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    res.json({
      status: "success",
      body: "Device user info added successfully",
    });
  } catch (error) {
    console.error("Error:", error);

    if (error.response && error.response.status === 401) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized. Please login again.",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: error.response ? error.response.data : "Internal Server Error",
      });
    }
  }
});

app.post("/api/user/delete", async (req, res) => {
  try {
    const loginResponse = await axios.post(loginUrl, loginPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const accessToken = loginResponse.data.tokens.access;
    await axios.delete(`${deleteUrl}${req.body.device_id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        device_id: req.body.device_id,
      }
    });
    res.json({
      status: "success",
      body: "Device user info successfully deleted",
    });
  } catch (error) {
    console.log(error)
  }
});

app.post("/api/user/edit", async (req, res) => {
  try {
    const loginResponse = await axios.post(loginUrl, loginPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const accessToken = loginResponse.data.tokens.access;
    await axios.put(statusUrl, req.body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    res.json({
      status: "success"
    });
  } catch (error) {
    console.log(error)
  }
});

app.post("/api/device/view", async (req, res) => {
  try {
    const loginResponse = await axios.post(loginUrl, loginPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const accessToken = loginResponse.data.tokens.access;
    const detailResponse = await axios.post(devicesDetailsUrl, {
      device_id:req.body.device_id
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    res.json(detailResponse.data);
  } catch (error) {
    console.log(error)
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
