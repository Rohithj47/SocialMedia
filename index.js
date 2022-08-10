const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require("helmet")
const dotenv = require('dotenv')

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const { Server } = require("socket.io");
const multer = require("multer")
const path = require('path')
const cors = require('cors')

// Add a Http Server 
const http = require('http');

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const server = http.createServer(app);

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
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static('socialmediafrontend/build'));
    app.get('*', (req, res) => {
        const index = path.join(__dirname,'socialmediafrontend', 'build', 'index.html');
        res.sendFile(index);
    });
}

// Add socketio server 
const io = new Server(server, {
    cors:
    {
        origin : "*"
    }
})

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
    console.log('A Client is connected')
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
      });
    
      //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        });
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
})

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})