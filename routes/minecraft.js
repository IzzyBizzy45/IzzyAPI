const router = require('express').Router();
const MinecraftPing = require('../modules/minecraftPing');

router.get('/getminecraftserver', (req, res) => {
    const address = req.query.address || "empty"
    const port = req.query.port || 25565
    if (address == "empty") {
        res.status(400).send({error: "Include an IP or domain of the server you like to get details of!"});
        return;
    }
    MinecraftPing.ping(address, port, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(result);
    })
});

module.exports = router;