const bodyParser = require('body-parser')
const app = require('express')()


import Airtable from "airtable"
const airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE)

const allowedFilters = ['Behinderung', 'Thema']
const selectFields = ['Behinderung', 'Thema']
const searchTextFields = [
    'Behinderung',
    'Thema',
    'Heilpädagogische Relevanz',
    'keywords',
    'Film_Titel'
]
let allowedFields = [
    'Behinderung',
    'Thema',
    'Heilpädagogische Relevanz',
    'Herkunft behinderte Person',
    'Film',
    'Geschlecht behinderte Person',
    'Vorschaubild',
    'Länge',
    'Altersgruppe behinderte Person',
    'Clip Nr.',
    'keywords',
    'Inhalt',
    'Film_Titel',
    'Film_Jahr',
    'Film_Land',
    'Film_Inhalt',
    'Film_Weitere_Angaben',
    'Film_Ton'
]

if (process.env.ENABLE_VIDEO === 'TRUE') {
    allowedFields.push('Vimeo-Link');
}
console.log(process.env.ENABLE_VIDEO);


app.use(bodyParser.json())
app.get('/clips', async(req, res) => {
    const conditions = []
    conditions.push("NOT({Clip Nr.} = '')")
    if (req.query.searchText) {
        conditions.push(getSearchTextFormula(req.query.searchText))
    }
    allowedFilters.forEach(filter => {
        if (req.query[filter]) {
            const filterCondition = getFilterFormula(filter, req.query[filter]);
            if (filterCondition) {
                conditions.push(filterCondition)
            }
        }
    });

    const formula = `AND(${conditions.join(', ')})`
    const records = await getRecords("Clips", {
        sort: [{ field: "Clip Nr.", direction: "asc" }],
        filterByFormula: formula
    })

    res.json({ records })
})
app.get('/clips/fields', async(req, res) => {
    const fields = await getUniqueFieldValues(selectFields);
    res.json(fields)
})
app.get('/clips/:id', async(req, res) => {
    const id = req.params.id
    const record = await getSingleRecord("Clips", id)
    res.json(record)
})



const getSearchTextFormula = (text) => {
    const words = text.trim().split(' ')
    const queries = words.map(word => {
        const conditions = searchTextFields.map(field => {
            if (isLookupField(field)) {
                return ` FIND('${word.toLowerCase()}', LOWER(ARRAYJOIN({${field}}), ' '))`
            }
            return ` FIND('${word.toLowerCase()}', LOWER({${field}}))`
        })
        return `OR(${conditions.join(', ')})`
    })

    return `AND(${queries.join(', ')})`
}

const getFilterFormula = (field, value) => {
    return `FIND('${value.toLowerCase()}', LOWER({${field}}))`
}

const getRecords = async(table, options) => {
    const records = await airtableBase(table).select(options).all()
    return records.map(record => { return transformRecord(record) })
}

const getSingleRecord = async(table, id) => {
    const record = await airtableBase(table).find(id)
    return transformRecord(record)
}

const transformRecord = (record) => {
    for (const [key, value] of Object.entries(record.fields)) {
        if (!allowedFields.includes(key)) {
            delete record.fields[key];
            continue;
        } else if (isLookupField(key)) {
            record.fields[key] = value.join(", ")
        }
    }
    return { id: record.id, ...record.fields }
}

const isLookupField = (key) => {
    return key.startsWith('Film_')
}

const getUniqueFieldValues = async(fields) => {
    const records = await airtableBase("Clips").select({
        fields
    }).all()
    return fields.reduce((acc, cur) => {
        const fieldValues = records.map(record => {
            return record.fields[cur]
        });
        const set = new Set(fieldValues);
        acc[cur] = [...set];
        return acc
    }, {})
}

module.exports = app