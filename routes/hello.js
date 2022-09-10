const router = require('express').Router();

router.get('/', (req, res) => {
    res.send({
        text: 'Hello World!'
    }).status(200)
});

router.post('/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        res.status(418).send({message:'We need a name!'});
    }

    res.send ({
        hello: `You've sent the name "${name}" with the ID of ${id}`
    });
});

module.exports = router;