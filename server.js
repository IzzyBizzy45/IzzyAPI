const express = require('express');
const app = express();
const PORT = process.env.PORT || 4545;
const router =express.Router();

app.use(express.json());
app.use('/', router);
app.set('trust proxy', true);
app.listen(
    PORT,
    () => console.log(`IzzyAPI is listening to requests on port ${PORT}`)
);

router.get('/', (req, res) => {
    res.sendFile(__dirname+'/homeAPI.html');
});

router.get('/hello', (req, res) => {
    res.send({
        text: 'Hello World!'
    }).status(200)
});

router.post('/hello/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        res.status(418).send({message:'We need a name!'});
    }

    res.send ({
        hello: `You've sent the name "${name}" with the ID of ${id}`
    });

});