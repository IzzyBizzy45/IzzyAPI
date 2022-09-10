const router = require('express').Router();
const Quote = require('../model/Quotes');
const verify = require('./verify');

router.get('/', async (req, res) => {
    const totalQuotes = (await Quote.where().countDocuments());
    const quoteUsed = Math.floor(Math.random()*(totalQuotes-1)+1);
    const quoteToUse = await Quote.findOne({id: quoteUsed});
    res.send({quote: quoteToUse.quote});
});

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const quoteExist = await Quote.findOne({id: id});
    if (!quoteExist) return res.status(404).send('Unknown Quote Number');
    const quote = quoteExist.quote;
    res.send({quote: quote});
});

router.post('/newquote', verify, async (req, res) => {

    const newID = (await Quote.where().countDocuments()) + 1; 
    const quote = new Quote({
        quote: req.body.quote,
        id: newID
    });
    try {
        await quote.save();
        res.send(`Sucessfully Saved Quote as ${newID}`)
    } catch(err) {
        res.status(500).send(err)
    }
});

module.exports = router;