import { isArray } from "@vue/shared";
import Airtable from "airtable";
const config = useRuntimeConfig();

const airtableBase = new Airtable({
  apiKey: config.airtableApiKey,
}).base(config.airtableBase);

import {
  FILTER_FORMAT_TIME,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_SELECT,
} from "../../consts";

const allowedFilters = [
  {
    id: "behinderung",
    field: "Behinderung",
    type: FILTER_TYPE_SELECT,
    params: { value: "behinderung" },
    label: "Behinderung",
  },
  {
    id: "thema",
    field: "Thema",
    type: FILTER_TYPE_SELECT,
    params: { value: "thema" },
    label: "Thema",
  },
  {
    id: "altersgruppe",
    field: "Altersgruppe behinderte Person",
    type: FILTER_TYPE_SELECT,
    params: { value: "altersgruppe" },
    label: "Altersgruppe",
  },
  {
    id: "land",
    field: "Film_Land",
    type: FILTER_TYPE_SELECT,
    params: { value: "land" },
    label: "Produktionsland",
  },
  {
    id: "jahr",
    field: "Film_Jahr",
    type: FILTER_TYPE_RANGE,
    params: { start: "jahr_start", end: "jahr_end" },
    label: "Produktionsjahr",
    startLabel: "Frühstes Jahr",
    endLabel: "Spätestes Jahr",
    step: 1,
  },
  {
    id: "laenge",
    field: "Länge",
    type: FILTER_TYPE_RANGE,
    params: { start: "laenge_start", end: "laenge_end" },
    label: "Länge",
    startLabel: "Mindestlänge",
    endLabel: "Maximallänge",
    step: 10,
    format: FILTER_FORMAT_TIME,
  },
];
const searchTextFields = [
  "Clip Nr.",
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
        return ` FIND('${word.toLowerCase()}', LOWER(ARRAYJOIN({${field}} & ""), ' '))`;
      }
      return ` FIND('${word.toLowerCase()}', LOWER({${field}} & ""))`;
    });
    return `OR(${conditions.join(", ")})`;
  });

  return `AND(${queries.join(", ")})`;
};

const getFilterFormula = (filter, query) => {
  if (filter.type === FILTER_TYPE_SELECT) {
    const value = query[filter.params.value];
    if (value) {
      return `FIND('${value.toLowerCase()}', LOWER({${filter.field}}))`;
    }
  }
  if (filter.type === FILTER_TYPE_RANGE) {
    const start = query[filter.params.start];
    const end = query[filter.params.end];
    if (!(start || end)) {
      return "";
    }
    if (!start) {
      return `{${filter.field}}<=${end}`;
    }
    if (!end) {
      return `{${filter.field}}>=${start}`;
    }
    return `AND({${filter.field}}>=${start},{${filter.field}}<=${end})`;
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

const getFiltersWithOptions = async () => {
  const fields = allowedFilters.map((filter) => filter.field);
  const records = await airtableBase("Clips")
    .select({
      fields,
    })
    .all();
  return allowedFilters.reduce((acc, filter) => {
    const options = [];
    records.forEach((record) => {
      const value = record.fields[filter.field];
      if (value == undefined) {
        return;
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
  getAllowedFilters,
  getSearchTextFormula,
  getFilterFormula,
  getRecords,
  getSingleRecord,
  getFiltersWithOptions,
};
