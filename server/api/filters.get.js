import { isArray } from "@vue/shared";
import { FILTERS, FILTER_TYPE_RANGE, FILTER_TYPE_SELECT } from "~~/consts";
import airtableHelpers from "~~/server/utils/airtable.js";

/**
 * Gets all the filters and their options
 */
export default defineEventHandler(async (event) => {
  const records = await airtableHelpers.getAllRecords();
  const filters = FILTERS.reduce((acc, filter) => {
    const filterData = getFilterData(records, filter);
    if (filterData) {
      acc.push(filterData);
    }
    return acc;
  }, []);
  return { filters };
});

const getFilterData = (records, filter) => {
  const optionsSet = getFilterOptions(records, filter);
  if (filter.type === FILTER_TYPE_SELECT) {
    return {
      ...filter,
      options: [...optionsSet]
        .sort()
        .map((option) => ({ label: option, value: option })),
      value: "",
      defaultValue: "",
    };
  }
  if (filter.type === FILTER_TYPE_RANGE) {
    const values = [...optionsSet].sort((a, b) => a - b);
    if (values.length > 0) {
      const min = Math.floor(values[0] / filter.step) * filter.step;
      const max =
        Math.ceil(values[values.length - 1] / filter.step) * filter.step;
      return {
        ...filter,
        min,
        max,
      };
    }
  }
  return null;
};

/**
 * Retrives a set of all the available options for a filter
 */
const getFilterOptions = (records, filter) => {
  const options = new Set();
  records.forEach((record) => {
    let value = record[filter.field.name];
    if (value == undefined) {
      if (!filter.field.fallback) {
        return;
      }
      value = record[filter.field.fallback];
      if (value == undefined) {
        return;
      }
    }
    if (isArray(value)) {
      options.add(...value);
    } else {
      options.add(value);
    }
  });
  return options;
};
