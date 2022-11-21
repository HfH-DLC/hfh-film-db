import helpers from "@/server/utils/airtable";
import { isArray } from "@vue/shared";
import NodeCache from "node-cache";
import {
  FIELDNAMES,
  FILTERS,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_SELECT,
} from "~~/consts";

const cache = new NodeCache({ stdTTL: 300 });

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  const conditions = [];
  conditions.push(`NOT({${FIELDNAMES.CLIP}} = '')`);
  if (query.searchText) {
    conditions.push(helpers.getSearchTextFormula(query.searchText));
  }
  FILTERS.filter((filter) => !filter.local).forEach((filter) => {
    const filterCondition = helpers.getFilterFormula(filter, query);
    if (filterCondition) {
      conditions.push(filterCondition);
    }
  });
  const formula = `AND(${conditions.join(", ")})`;
  let records = cache.get(formula);
  if (!records) {
    records = await helpers.getRecords("Clips", {
      sort: [{ field: FIELDNAMES.CLIP, direction: "asc" }],
      filterByFormula: formula,
    });
    records = applyLocalFilters(records, query);
    cache.set(formula, records);
  }

  const startIndex = (query.currentPage - 1) * query.pageSize;
  const endIndex = query.currentPage * query.pageSize;

  const currentPageRecords = records.slice(startIndex, endIndex);
  const totalPages = Math.ceil(records.length / query.pageSize);
  return {
    records: currentPageRecords,
    pageSize: query.pageSize,
    currentPage: query.currentPage,
    totalPages: totalPages,
    totalRecords: records.length,
  };
});

function applyLocalFilters(records, query) {
  FILTERS.filter((filter) => filter.local).forEach((filter) => {
    if (filter.type === FILTER_TYPE_SELECT) {
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
    }
    if (filter.type === FILTER_TYPE_RANGE) {
      const start = query[filter.params.start];
      const end = query[filter.params.end];
      if (!(start && end)) {
        return "";
      }
      records = records.filter((record) => {
        let recordValue = record[filter.field.name];
        if (recordValue) {
          return start <= recordValue && recordValue <= end;
        }
      });
    }
  });
  return records;
}
