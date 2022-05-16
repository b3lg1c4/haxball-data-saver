const express = require('express');
const server = express();
const { WebSocketServer } = require('ws');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


const WEB_SOCKET_PORT = 7072;
const HTTP_SERVER_PORT = 7073;

const socket = new WebSocketServer({ port: WEB_SOCKET_PORT });

socket.on("connection", (conn) => {

    conn.on("message", async (msg) => {

        const registrofutsal = msg.toString();

        await fs.writeFile("registrofutsal.json", registrofutsal, (err) => {
            if (err) throw err;
        });


    });

});

server.get("/", async (req,res) => {
    res.redirect("localhost:3000/top25");
});

server.get("/top25", async (req, res) => {

    res.sendFile(path.join(__dirname,"registrofutsal.json"));
});

server.listen(HTTP_SERVER_PORT, (req, res) => {
    console.clear();
    console.log("haxball-data-saver 1.0.0");
});

