const express = require('express');
const { GameDig } = require('gamedig');

const app = express();
app.use(express.json());

app.post('/query', async (req, res) => {
    const servers = req.body.servers;
    const results = await Promise.all(servers.map(async server => {
        try {
            const state = await GameDig.query({
                type: server.type, // ex: 'csgo', 'minecraft'
                host: server.ip,
                port: server.port,
                requestRules: true,
                debug:true
            });
            return { success: true, id:server.id,...state };
        } catch (e) {
            return { success: false, id:server.id,connect: server.ip+':'+server.port, error: e.toString() };
        }
    }));
    res.json(results);
});

app.listen(3002, () => console.log("Node new service running on port 3002"));
