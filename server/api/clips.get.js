import airtableHelpers from "@/server/utils/airtable";
import { isArray } from "@vue/shared";
import {
  FILTERS,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_SELECT,
  SEARCH_TEXT_FIELDS,
} from "~~/consts";

/**
 * Get all clips from airtable filtered by search text and filters
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const records = await getFilteredRecords(query);
  const currentPageRecords = getCurrentPageRecords(records, query);
  const totalPages = Math.ceil(records.length / query.pageSize);
  return {
    records: currentPageRecords,
    pageSize: query.pageSize,
    currentPage: query.currentPage,
    totalPages: totalPages,
    totalRecords: records.length,
  };
});

/**
 * Retrieves the clips via the airtable API if not already cached
 */
async function getFilteredRecords(query) {
  const records = await airtableHelpers.getAllRecords();
  return applyQuery(records, query);
}

/**
 * Filters the records according to the query's currentPage and pageSize parameters
 */
function getCurrentPageRecords(records, query) {
  const startIndex = (query.currentPage - 1) * query.pageSize;
  const endIndex = query.currentPage * query.pageSize;
  return records.slice(startIndex, endIndex);
}

/**
 * Filters the records according to the query.
 */
function applyQuery(records, query) {
  FILTERS.forEach((filter) => {
    if (filter.type === FILTER_TYPE_SELECT) {
      records = applySelectFilter(records, query, filter);
    }
    if (filter.type === FILTER_TYPE_RANGE) {
      records = applyRangeFilter(records, query, filter);
    }
  });
  if (query.searchText) {
    records = applySearchTextQuery(records, query);
  }
  return records;
}

function applySelectFilter(records, query, filter) {
  let queryValue = query[filter.params.value];
  if (queryValue) {
    records = records.filter((record) => {
      queryValue = queryValue.toLowerCase();
      let recordValue = record[filter.field.name];
      if (recordValue) {
        if (isArray(recordValue)) {
          return recordValue
            .map((value) => value.toLowerCase())
            .includes(queryValue);
        }
        return recordValue.toLowerCase() == queryValue;
      }
    });
  }
  return records;
}

function applyRangeFilter(records, query, filter) {
  const start = query[filter.params.start];
  const end = query[filter.params.end];
  if (!(start && end)) {
    return records;
  }
  return records.filter((record) => {
    let recordValue = record[filter.field.name];
    if (recordValue) {
      return start <= recordValue && recordValue <= end;
    }
  });
}

function applySearchTextQuery(records, query) {
  return records.filter((record) => {
    for (let field of SEARCH_TEXT_FIELDS) {
      let value = record[field.name];
      if (typeof value === "number") {
        value = value.toString();
      }
      if (isArray(value)) {
        if (
          value
            .map((element) => element.toLowerCase())
            .includes(query.searchText.toLowerCase())
        ) {
          return true;
        }
      } else if (
        value &&
        value.toLowerCase().includes(query.searchText.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });
}
