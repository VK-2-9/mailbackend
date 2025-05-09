const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//nodemailer .........................................................................................................................

const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(`mongodb+srv://vishalnath:1001@cluster0.cqjjnak.mongodb.net/passkey`)
  .then(() => console.log("db connected"))
  .catch(() => console.log("db not connect"));

const credential = mongoose.model("credential", {}, "bulkmail");

credential
.find()
.then((data) => {console.log("data found")})





app.post("/sendemail", (req, res) => {
  var msg = req.body.msg;
  var emailList = req.body.emailList;
  var sub=req.body.sub;


  credential
  .find()
  .then((data) => {
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    service: "gmail",
  
    auth: {
      user: data[0].toJSON().user,
      pass: data[0].toJSON().pass,
    },
  }); 


  new Promise(async (resolve, reject) => {
    try {
      console.log("mail loop started");
      for (i = 0; i < emailList.length; i++) {
        await transporter.sendMail({
          from: "kokainn29@gmail.com",
          to: emailList[i],
          subject: sub,
          text: msg,
        });
        console.log("mail sent to ", emailList[i]);
      }

      resolve();
    } catch (error) {
      reject();
    }
  })
    .then(() => res.send(true))
    .catch(() => res.send(false));
    
 })
  .catch((err) => console.log(err));

  
});

app.listen(5000, () => {
  console.log("server started");
});
