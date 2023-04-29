const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const fs = require("fs");
const app = express();
const upload = multer();
const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // Generate a random reference number
  const refNo = CryptoJS.lib.WordArray.random(4)
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  res.render("index", { refNo: refNo });
});

app.post("/submit", async (req, res) => {
  const secretKey = process.env.PAYER_API_SECRET;
  const { amount, title, description, ref_no } = req.body;

  // Create the Signature for the request
  const signaturePayload = `${ref_no}${amount}`;
  const hmac = CryptoJS.HmacSHA256(signaturePayload, secretKey);
  const signature = hmac.toString();

  const requestBodyJson = { amount, title, description, ref_no, signature };

  try {
    const response = await axios.post(
      `${process.env.PAYER_API_HOST}/merchants/v1/transactions`,
      requestBodyJson,
      {
        headers: {
          Authorization: "Token " + process.env.PAYER_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    res.redirect(response.data.url); // Redirect to the URL returned by the API
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

app.post("/result", function (req, res) {
  const status = req.body.status;
  const ref_no = req.body.ref_no;
  const remarks = req.body.remarks;
  const signature = req.body.signature;

  //   // Verify the signature
  //   const signaturePayload = `${ref_no}${status}`;
  //   const hmac = CryptoJS.HmacSHA256(
  //     signaturePayload,
  //     process.env.PAYER_API_SECRET
  //   );
  //   const calculatedSignature = hmac.toString();

  //   if (signature === calculatedSignature) {
  //     console.log("Signature is valid");
  //   } else {
  //     console.log("Signature is invalid");
  //   }

  const data = [
    "Status: " + status,
    "Reference Number: " + ref_no,
    "Remarks: " + remarks,
    "Signature: " + signature,
  ];

  res.render("result", { data: data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
