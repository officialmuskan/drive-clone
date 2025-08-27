const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const folderRoutes = require('./routes/folder');
const authRoutes = require('./routes/auth');

const imageRoutes = require('./routes/images');
const app = express();
dotenv.config()
// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// console.log(process.env.MONGO_URI)
const connectDatabase = async ()=>{   
    await mongoose.connect(process.env.MONGO_URI)

    console.log("Database connected")
}
connectDatabase()
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);
app.get('/', async (req, res) => {
  res.json("hello");
});

const port = 5000
const server = app.listen(port, ()=>{
    console.log(`server started at ${port}`)
});
