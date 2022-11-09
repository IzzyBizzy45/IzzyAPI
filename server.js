const express = require('express');
const app = express();
const PORT = process.env.PORT || 4545;
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//DB Connection
mongoose.connect(process.env.DATABASE, () => console.log('Connected to Database'));

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

//Import Routes
const helloRoute = require('./routes/hello');
const quotesRoute = require('./routes/quotes');
const cowboyRoute = require('./routes/cowboy');

//Middlewares
app.use('/api/hello', helloRoute);
app.use('/api/quotes', quotesRoute);
app.use('/api/cowboy', cowboyRoute);