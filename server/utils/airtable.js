import { isArray } from "@vue/shared";
import Airtable from "airtable";
const config = useRuntimeConfig();

const airtableBase = new Airtable({
  apiKey: config.airtableApiKey,
}).base(config.airtableBase);

import {
  FILTER_TYPE_RANGE,
  FILTER_TYPE_SELECT,
  FIELDNAMES,
  FILTERS,
  FIELDS,
} from "../../consts";

const searchTextFields = [
  FIELDS.CLIP,
  FIELDS.BEHINDERUNG,
  FIELDS.THEMA,
  FIELDS.RELEVANZ,
  FIELDS.KEYWORDS,
  FIELDS.FILM_TITEL,
];
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

const getSearchTextFormula = (text) => {
  const words = text.trim().split(" ");
  const queries = words.filter(word => word.toLowerCase() != 'clip').map((word) => {
    const conditions = searchTextFields.map((field) => {
      if (field.lookup) {
        return ` FIND('${word.toLowerCase()}', LOWER(ARRAYJOIN({${
          field.name
        }} & ""), ' '))`;
      }
      return ` FIND('${word.toLowerCase()}', LOWER({${field.name}} & ""))`;
    });
  
    return `OR(${conditions.join(", ")})`;
  });

  const formula = `AND(${queries.join(", ")})`;
  return formula;
};

const getFilterFormula = (filter, query) => {
  if (filter.type === FILTER_TYPE_SELECT) {
    const value = query[filter.params.value];
    if (value) {
      return `FIND('${value.toLowerCase()}', LOWER({${filter.field.name}}))`;
    }
  }
  if (filter.type === FILTER_TYPE_RANGE) {
    const start = query[filter.params.start];
    const end = query[filter.params.end];
    if (!(start && end)) {
      return "";
    }
    return `AND({${filter.field.name}}>=${start},{${filter.field.name}}<=${end})`;
  }
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
  applyFallbacks(record);
  for (const [key, value] of Object.entries(record.fields)) {
    if (!allowedFieldNames.includes(key)) {
      delete record.fields[key];
      continue;
    }
    const field = Object.values(FIELDS).find((value) => value.name == key);
    if (!field) {
      continue;
    }
    if (field.unwrapArray) {
      record.fields[key] = value[0];
    }
  }
  return { id: record.id, ...record.fields };
};

const applyFallbacks = (record) => {
  const fields = Object.values(FIELDS).filter((field) => field.fallbackName);
  fields.forEach((field) => {
    const fallbackValue = record.fields[field.fallbackName];
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

const getFiltersWithOptions = async () => {
  const fields = FILTERS.map((filter) => filter.field.name);
  const records = await airtableBase("Clips")
    .select({
      fields,
    })
    .all();
  return FILTERS.reduce((acc, filter) => {
    const options = [];
    records.forEach((record) => {
      let value = record.fields[filter.field.name];
      if (value == undefined) {
        if (!filter.field.fallback) {
          return;
        }
        value = record.fields[filter.field.fallback];
        if (value == undefined) {
          return;
        }
      }
      if (isArray(value)) {
        options.push(...value);
      } else {
        options.push(value);
      }
    });
    const set = new Set(options);
    if (filter.type === FILTER_TYPE_SELECT) {
      acc.push({
        ...filter,
        options: [...set]
          .sort()
          .map((option) => ({ label: option, value: option })),
        value: "",
        defaultValue: "",
      });
    }
    if (filter.type === FILTER_TYPE_RANGE) {
      const values = [...set].sort((a, b) => a - b);
      if (values.length > 0) {
        const min = Math.floor(values[0] / filter.step) * filter.step;
        const max =
          Math.ceil(values[values.length - 1] / filter.step) * filter.step;
        const filterData = {
          ...filter,
          min,
          max,
        };
        acc.push(filterData);
      }
    }
    return acc;
  }, []);
};

export default {
  getSearchTextFormula,
  getFilterFormula,
  getRecords,
  getSingleRecord,
  getFiltersWithOptions,
};
