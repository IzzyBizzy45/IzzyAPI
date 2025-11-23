const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvFileName = 'ServicePlans.csv';
const filePath = path.join(__dirname, 'resources', csvFileName);

function getUniqueRecords(records) {
    const seenIds = new Set();
    const uniqueRecords = [];
    for (const record of records) {
        // Only add if we haven't seen this String_Id before
        if (record.String_Id && !seenIds.has(record.String_Id)) {
            seenIds.add(record.String_Id);
            uniqueRecords.push(record);
        }
    }
    return uniqueRecords;
}

router.get('/product/:stringId', (req, res) => {
    const { stringId } = req.params;

    //console.log(stringId)

    if (!stringId) {
        return res.status(400).send({status:"error",message:"Missing StringId from request"});
    }

    // try to read file when requested, to ensure the latest version is provided,
    // as a cron job updates the csv on a weekly basis to ensure that the licencing details are updated automatically
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true
        });

        const uniqueRecords = getUniqueRecords(records);

        const match = uniqueRecords.find(row => row.String_Id === stringId);

        if (match && match.Product_Display_Name) {
            console.log(`[MicrosoftHelper] Recieved Request for product lookup ${stringId}, found ${match.Product_Display_Name}`)
            return res.json({
                status: 'success',
                data: {
                    string_id: stringId,
                    product_display_name: match.Product_Display_Name
                }
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: `No product found for String_Id: '${stringId}'`
            });
        }
    } catch (error) {
        console.error('Error reading CSV file:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error: Could not read data file.'
        });
    }
});

module.exports = router