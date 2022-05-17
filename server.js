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
const RANKING_MAX_NUM_ALLOWED = 500;

const socket = new WebSocketServer({ port: WEB_SOCKET_PORT });

socket.on("connection", (conn) => {

    conn.on("message", async (msg) => {

        const registrofutsal = msg.toString();

        await fs.writeFile("registrofutsal.json", registrofutsal, (err) => {
            if (err) throw err;
        });


    });

});

server.get("/", async (req, res) => {
    res.redirect(`/ranking/100`);
});

server.get("/ranking", async (req, res) => {
    res.redirect(`/ranking/100`);
});

server.get("/ranking/:num", async (req, res) => {

    let num = parseInt(req.params.num);

    if (Number.isInteger(num) && (num > 0 && num <= RANKING_MAX_NUM_ALLOWED)) {

        try {

            let registrofutsal = JSON.parse(await fs.readFileSync(path.join(__dirname, "registrofutsal.json"), "utf-8"));
            
            /*FILTERS--------------------------------------------------*/
            registrofutsal = registrofutsal.map((player, pos) => (
                {
                    pos: pos + 1,
                    name: player.name,
                    elo: player.elo,
                    pg: player.stats[0],
                    goals: player.stats[2],
                    assists: player.stats[3],
                    shutouts: player.stats[4]
                })
            );
            registrofutsal = registrofutsal.slice(0,num);
            /*FILTERS--------------------------------------------------*/

            res.send(registrofutsal);

        } catch (err) {
            res.status(500).send({ error: "error handling registrofutsal.json file" });
        }

    }
    else {
        res.status(400).send({ error: "num must be an integer between 1 and 500" });
    };


});

server.listen(HTTP_SERVER_PORT, (req, res) => {
    console.clear();
    console.log("haxball-data-saver 2.0.0");
});

