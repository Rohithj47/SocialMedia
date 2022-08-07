const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require("helmet")
const dotenv = require('dotenv')

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const multer = require("multer")
const path = require('path')
const cors = require('cors')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

mongoose.connect(
    process.env.MONGOURI, () => {
        console.log('connected to DB')
    }
)

//Enable CORS 
app.use(cors());


app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'))
console.log(path.join(__dirname + 'public/images'))
app.use('/images',express.static(path.join(__dirname + '/public/images')));

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "public/images")
    },
    filename: (req,file,cb) => {
        if (req.body.name){
            cb(null, req.body.name)
        }
    }
})

const upload = multer({storage})
app.post('/api/upload',upload.single("file"), (req,res) => {
    try{
        res.status(200).json("File Uploaded successfully")
    }catch(err){
        console.log(err)
    }
})

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static('socialmediafrontend/build'));
    app.get('*', (req, res) => {
        const index = path.join(__dirname,'socialmediafrontend', 'build', 'index.html');
        res.sendFile(index);
    });
}

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})