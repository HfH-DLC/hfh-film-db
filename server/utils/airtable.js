import Airtable from "airtable";
const config = useRuntimeConfig();

const airtableBase = new Airtable({
  apiKey: config.airtableApiKey,
}).base(config.airtableBase);

const allowedFilters = ["Behinderung", "Thema"];
const selectFields = ["Behinderung", "Thema"];
const searchTextFields = [
  "Behinderung",
  "Thema",
  "Heilpädagogische Relevanz",
  "keywords",
  "Film_Titel",
];
let allowedFields = [
  "Behinderung",
  "Thema",
  "Heilpädagogische Relevanz",
  "Herkunft behinderte Person",
  "Film",
  "Geschlecht behinderte Person",
  "Vorschaubild",
  "Länge",
  "Altersgruppe behinderte Person",
  "Clip Nr.",
  "keywords",
  "Inhalt",
  "Film_Titel",
  "Film_Jahr",
  "Film_Land",
  "Film_Inhalt",
  "Film_Weitere_Angaben",
  "Film_Ton",
];
if (config.enableVideo === true) {
  allowedFields.push("Vimeo-Link");
}

const getAllowedFilters = () => {
  return allowedFilters;
};

const getSearchTextFormula = (text) => {
  const words = text.trim().split(" ");
  const queries = words.map((word) => {
    const conditions = searchTextFields.map((field) => {
      if (isLookupField(field)) {
        return ` FIND('${word.toLowerCase()}', LOWER(ARRAYJOIN({${field}}), ' '))`;
      }
      return ` FIND('${word.toLowerCase()}', LOWER({${field}}))`;
    });
    return `OR(${conditions.join(", ")})`;
  });

  return `AND(${queries.join(", ")})`;
};

const getFilterFormula = (field, value) => {
  return `FIND('${value.toLowerCase()}', LOWER({${field}}))`;
};

const getRecords = async (table, options) => {
  const records = await airtableBase(table).select(options).all();
  return records.map((record) => {
    return transformRecord(record);
  });
};

const getSingleRecord = async (table, id) => {
  const record = await airtableBase(table).find(id);
  return transformRecord(record);
};

const transformRecord = (record) => {
  for (const [key, value] of Object.entries(record.fields)) {
    if (!allowedFields.includes(key)) {
      delete record.fields[key];
      continue;
    } else if (isLookupField(key)) {
      record.fields[key] = value.join(", ");
    }
  }
  return { id: record.id, ...record.fields };
};

const isLookupField = (key) => {
  return key.startsWith("Film_");
};

const getUniqueFieldValues = async () => {
  const records = await airtableBase("Clips")
    .select({
      fields: selectFields,
    })
    .all();
  return selectFields.reduce((acc, cur) => {
    const fieldValues = records.map((record) => {
      return record.fields[cur];
    });
    const set = new Set(fieldValues);
    acc[cur] = [...set];
    return acc;
  }, {});
};

export default {
  getAllowedFilters,
  getSearchTextFormula,
  getFilterFormula,
  getRecords,
  getSingleRecord,
  getUniqueFieldValues,
};
