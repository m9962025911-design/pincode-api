const express = require("express");
const axios = require("axios");

const app = express();

const API_KEY = "POWER123";

app.get("/", (req, res) => {
    res.send("✅ Pincode API is running");
});

app.get("/pincode", async (req, res) => {
    const code = req.query.code;
    const key = req.query.key;

    if (!key || key !== API_KEY) {
        return res.status(401).json({
            status: "error",
            message: "Invalid API Key"
        });
    }

    if (!code) {
        return res.status(400).json({
            status: "error",
            message: "Missing pincode"
        });
    }

    try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${code}`);
        const data = response.data[0];

        if (data.Status !== "Success") {
            return res.json({
                status: "error",
                message: "Invalid Pincode"
            });
        }

        res.json({
            status: "success",
            pincode: code,
            postOffice: data.PostOffice[0].Name,
            district: data.PostOffice[0].District,
            state: data.PostOffice[0].State,
            region: data.PostOffice[0].Region,
            country: data.PostOffice[0].Country
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
