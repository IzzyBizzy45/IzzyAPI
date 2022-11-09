/*
Literaly a joke API call for a random script I made
Still placing in Github as a record of what I've written
*/

const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(418).send(':)')
});

router.get('/ITPerson', (req, res) => {
    const randomChance = Math.floor(Math.random()*100)
    /* % of each response is the following
    10% to respond with a status of stupidshit
    20% to respond with a status of sleeping
    1% for an easter egg of different type
    The other 69% will respond with normalstuff*/

    if (randomChance == 100) {
        res.status(200).send({
            type: 'alien',
            wearing: {
                body: 'normalClothing',
                head: 'nothing'
            },
            status: 'stupidshit',
            chanceRoll: randomChance
        });
    } else if (randomChance <= 99 && randomChance >= 89) {
        res.status(200).send({
            type: 'human',
            wearing: {
                body: 'normalClothing',
                head: 'nothing'
            },
            status: 'stupidshit',
            chanceRoll: randomChance
        });
    } else if (randomChance <= 88 && randomChance >= 69) {
        res.status(200).send({
            type: 'human',
            wearing: {
                body: 'sleepwear',
                head: 'nothing'
            },
            status: 'sleeping',
            chanceRoll: randomChance
        });
    } else {
        res.status(200).send({
            type: 'human',
            wearing: {
                body: 'normalClothing',
                head: 'nothing'
            },
            status: 'normalstuff',
            chanceRoll: randomChance
        });
    }
});

module.exports = router;