const router = require('express').Router();
const Quote = require('../model/Quotes');
const verify = require('../middleware/verify');

router.get('/', async (req, res) => {
    const totalQuotes = (await Quote.where().count().countDocuments());
    const quoteUsed = Math.floor(Math.random()*(totalQuotes-1)+1);
    console.log(`[Quotes] Quote number to use from Random was: ${quoteUsed} out of ${totalQuotes} total Quotes`)
    const quoteToUse = await Quote.findOne({id: quoteUsed});
    res.send({quote: quoteToUse.quote});
});

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const num = +id;
    if(isNaN(num)) return res.status(400).send('Bad Request')
    const quoteExist = await Quote.findOne({id: num});
    if (!quoteExist) return res.status(404).send('Unknown Quote Number');
    console.log(`[Quotes] Recieved Request for Quote ${num}`);
    const quote = quoteExist.quote;
    res.send({quote: quote});
});

router.post('/newquote', verify, async (req, res) => {
    const newID = (await Quote.where().count().countDocuments()) + 1;
    console.log('new id is %d', newID);
    const quote = new Quote({
        quote: req.body.quote,
        id: newID
    });
    try {
        await quote.save();
        res.send(`Sucessfully Saved Quote as ${newID}`)
        console.log(`[Quotes] Setup a new Quote under ${newID}`);
    } catch(err) {
        res.status(500).send(err)
    }
});

module.exports = router;