const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require('mongoose');   
const User = require("./models/users.js");
const Employee = require("./models/employees.js");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = "mongodb+srv://aful69:aful690@cluster0.h2pbwen.mongodb.net/?retryWrites=true&w=majority";
// console.log(MONGO_URL);

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/Home", (req, res)=>{
    try {
    let param = {
        param: "index",
    };
    res.render("chambers/index", {param});
}catch{
    res.render("/Home")
}
});

app.get("/about", (req, res)=>{
    try {
        let str = req.path;
        let nOfSlash = str.indexOf("/");
        let param = {
            param: str.substring(nOfSlash+1),
        };
        res.render("chambers/about", {param});
    }catch{
        res.render("/Home")
    }
});

app.get("/faq", (req, res)=>{
    try {
        let str = req.path;
        let nOfSlash = str.indexOf("/");
        let param = {
            param: str.substring(nOfSlash+1),
        };
        res.render("chambers/faq", {param});
    }catch{
        res.render("/Home")
    }
});

app.get("/usage-guides", (req, res)=>{
    try {    
        let str = req.path;
        let nOfSlash = str.indexOf("/");
        let param = {
            param: str.substring(nOfSlash+1),
        };
        res.render("chambers/usage-guides", {param});
    }catch{
        res.render("/Home")
    }
});

app.get("/contact-us", (req, res)=>{
    try {
        let str = req.path;
        let nOfSlash = str.indexOf("/");
        let param = {
            param: str.substring(nOfSlash+1),
        };
        res.render("chambers/contact-us", {param});
    }catch{
        res.render("/Home")
    }
});

app.get("/admin-sign-up", (req, res)=>{
    try {
    res.render("admin/signUp");
    }catch(err){
        res.render("/Home");
    }
});

app.post("/admin-sign-up", async (req, res)=>{
    try {
    let {username, password} = req.body;
    let data = await User.find({username});
    if(!data.length){
        const newUser = new User({username, password});
        await  newUser.save();
        res.redirect("/admin-login");
    }else{
        res.redirect("/Home");
    }
}catch(err){
    res.render("/Home");
}
});

app.get("/admin-login", (req, res)=>{
    try {
    res.render("admin/fillFormByAdmin");
}catch(err){
    res.render("/Home");
}
});

app.get("/register", (req, res)=>{
    try {
        res.render("admin/Register");
    }catch(err){
        res.render("/Home");
    }
});

app.post("/admin-login", async (req, res)=>{
    try {
        let {username, password} = req.body;
        let data = await User.find({username, password});
        // console.log(data);
        if(data.length){
            res.render("admin/PDFform.ejs");
        }else{
            res.redirect("/Home");
        }
    }catch(err){
        res.render("/Home");
    }
});

app.get("/login", (req, res)=>{
    try {
        let str = req.path;
        let nOfSlash = str.indexOf("/");
        let param = {
            param: str.substring(nOfSlash+1),
        };
        res.render("chambers/login.ejs");
    }catch(err){
        res.render("/Home");
    }
    });

app.post("/employee-details", async (req, res) => {
    try{
    let { sid, sname, cr, tel, fax, date, description, dc, noe, name, on, sn } = req.body;
    const newEmployee = new Employee({ sid, sname, cr, tel, fax, date, description, dc, noe, name, on, sn });
    await newEmployee.save();
    // console.log(newEmployee);
    res.redirect(`/show-pdf?_id=${newEmployee._id}`);
    }catch(err){
        res.redirect('/Home');
        // console.log(err);
    }
});
const generateQRCode = require('./public/generateQR.js');
const generatePDF = require('./public/pdf.js');
app.get("/show-pdf", async (req, res) => {
    try{
    const { _id } = req.query;
    let emp = await Employee.findById(_id);
    if (!(emp==null) && typeof emp.description === 'string') {
        // Replace newline characters with HTML line breaks
        emp.description = emp.description.replace(/\n/g, '\n');
    }else {
       throw Error;
    }
    await generateQRCode(req.protocol, req.subdomains, req.query, req.path, 8080, req.hostname, 300);
    await generatePDF("showPDF.ejs", {emp});

    res.render("admin/letter-box.ejs");
    // res.render("admin/showPDF.ejs", {emp});

}catch(err){
    res.redirect("/Home");
}
});
app.get("*", (req,res)=>{
    res.redirect("/Home");
});
app.listen(port, ()=>{
    console.log(`app is listening on port ${port}.`);
})