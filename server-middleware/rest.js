const bodyParser = require('body-parser')
const app = require('express')()


import Airtable from "airtable"
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);

app.use(bodyParser.json())
app.get('/clips', async(req, res) => {
    let filter = "NOT({Clip Nr.} = '')";
    if (req.query.text) {
        filter = (`AND(${filter}, ${getSearchTextFormula(req.query.text)})`)
    }
    const records = await getRecords("Clip-Datenbank", {
        sort: [{ field: "Clip Nr.", direction: "asc" }],
        filterByFormula: filter
    });

    res.json({ records });
})
app.get('/clips/:id', async(req, res) => {
    const id = req.params.id;
    const record = await getSingleRecord("Clip-Datenbank", id);
    res.json(record);
})

const searchTextFields = [
    'Behinderung',
    'Thema',
    'Heilpädagogische Relevanz',
    'keywords',
    'Film_Titel'
]

const getSearchTextFormula = (text) => {
    const words = text.trim().split(' ');
    const queries = words.map(word => {
        const conditions = searchTextFields.map(field => {
            if (isLookupField(field)) {
                return ` FIND('${word.toLowerCase()}', LOWER(ARRAYJOIN({${field}}), ' '))`
            }
            return ` FIND('${word.toLowerCase()}', LOWER({${field}}))`
        })
        return `OR(${conditions.join(', ')})`;
    })

    return `AND(${queries.join(', ')})`
}

const getRecords = async(base, options) => {
    const records = await airtable(base).select(options).all();
    return records.map(record => { return transformRecord(record) });
}

const getSingleRecord = async(base, id) => {
    const record = await airtable(base).find(id);
    return transformRecord(record);
}

const transformRecord = (record) => {
    for (const [key, value] of Object.entries(record.fields)) {
        if (isLookupField(key)) {
            record.fields[key] = value.join(", ")
        }
    }
    return { id: record.id, ...record.fields };
}

const isLookupField = (key) => {
    return key.startsWith('Film_')
}

module.exports = app