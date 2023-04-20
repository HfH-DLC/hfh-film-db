import { isArray } from "@vue/shared";
import Airtable from "airtable";
import NodeCache from "node-cache";
import { FIELDNAMES, FIELDS, TABLE_NAME } from "../../consts";

const config = useRuntimeConfig();

const airtableBase = new Airtable({
  apiKey: config.airtableApiKey,
}).base(config.airtableBase);

const cache = new NodeCache({ stdTTL: 86400 });

/**
 * The fields that may be returned to the client
 */
let allowedFieldNames = [
  FIELDNAMES.BEHINDERUNG,
  FIELDNAMES.THEMA,
  FIELDNAMES.RELEVANZ,
  FIELDNAMES.FILM,
  FIELDNAMES.BILD,
  FIELDNAMES.LAENGE,
  FIELDNAMES.CLIP,
  FIELDNAMES.KEYWORDS,
  FIELDNAMES.INHALT,
  FIELDNAMES.FILM_TITEL,
  FIELDNAMES.FILM_JAHR,
  FIELDNAMES.FILM_LAND,
  FIELDNAMES.FILM_INHALT,
  FIELDNAMES.FILM_WEITERE_ANGABEN,
  FIELDNAMES.FILM_TON,
  FIELDNAMES.FILM_ALTERSGRUPPE,
  FIELDNAMES.FILM_HERKUNFT,
  FIELDNAMES.FILM_GESCHLECHT,
  FIELDNAMES.ALTERSGRUPPE,
  FIELDNAMES.HERKUNFT,
  FIELDNAMES.GESCHLECHT,
];
if (config.enableVideo === true) {
  allowedFieldNames.push(FIELDNAMES.VIDEO);
}

/**
 * Retrieves all records from airtable sorted by Clip Nr.
 * The records are cached.
 */
const getAllRecords = async () => {
  if (!cache.has("all-records")) {
    const options = {
      fields: allowedFieldNames,
      sort: [{ field: FIELDNAMES.CLIP, direction: "asc" }],
      filterByFormula: `NOT({${FIELDNAMES.CLIP}} = '')`,
    };
    const records = await airtableBase(TABLE_NAME).select(options).all();
    const transformedRecords = records.map((record) => {
      return transformRecord(record);
    });
    cache.set("all-records", transformedRecords);
  }
  return cache.get("all-records");
};

/**
 * Retrives a single record from airtable
 */
const getSingleRecord = async (id) => {
  const record = await airtableBase(TABLE_NAME).find(id);
  return transformRecord(record);
};

const transformRecord = (record) => {
  filterFields(record);
  applyFallbackValues(record);
  unwrapArrayValues(record);
  return { id: record.id, ...record.fields };
};

/**
 * Removes fields that are not allowed to be sent to the client
 */
const filterFields = (record) => {
  for (const [key, value] of Object.entries(record.fields)) {
    if (!allowedFieldNames.includes(key)) {
      delete record.fields[key];
      continue;
    }
  }
};

/**
 * Some fields have another field to fall back on if they are empty, defined by a "fallbackFieldName" property.
 * This applies those fallback values for all those fields.
 */
const applyFallbackValues = (record) => {
  const fields = Object.values(FIELDS).filter(
    (field) => field.fallbackFieldName
  );
  fields.forEach((field) => {
    const fallbackValue = record.fields[field.fallbackFieldName];
    if (fallbackValue) {
      const value = record.fields[field.name];
      let useFallback = false;
      if (isArray(value)) {
        useFallback = value.length == 0;
      } else {
        useFallback = value == undefined;
      }
      if (useFallback) {
        record.fields[field.name] = fallbackValue;
      }
    }
  });
};

/**
 * Unwraps array values for fields with the "unwrapArray" property options set to true.
 */
const unwrapArrayValues = (record) => {
  for (const [key, value] of Object.entries(record.fields)) {
    const field = Object.values(FIELDS).find((value) => value.name == key);
    if (!field) {
      continue;
    }
    if (field.unwrapArray) {
      record.fields[key] = value[0];
    }
  }
};

export default {
  getAllRecords,
  getSingleRecord,
};
