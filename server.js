const express = require('express');
const server = express();
const {WebSocketServer} = require('ws');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended:true}));

console.log(process.env);

const wss = new WebSocketServer({ port: 7072 });
let connection;

wss.on("connection",(conn) => {
    connection = conn;
});


server.use((req,res,next) => {
    if(connection) return next();
    res.status(500).send({error:"Socket connection on port 7072 not established"});
});

server.get("/top25", async (req,res) => {

    await connection.send("registrofutsal");
    await connection.on("message", (msg) => {
        res.send(msg.toString());
    });
});

server.listen(process.env.PORT || 80, (req,res) => {
    console.clear();
    console.log("haxball-data-saver 1.0.0");
});

