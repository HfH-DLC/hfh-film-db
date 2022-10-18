import helpers from "@/server/utils/airtable";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 });

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  const conditions = [];
  conditions.push("NOT({Clip Nr.} = '')");
  if (query.searchText) {
    conditions.push(helpers.getSearchTextFormula(query.searchText));
  }
  helpers.getAllowedFilters().forEach((filter) => {
    const filterCondition = helpers.getFilterFormula(filter, query);
    if (filterCondition) {
      conditions.push(filterCondition);
    }
  });
  const formula = `AND(${conditions.join(", ")})`;
  let records = cache.get(formula);
  if (!records) {
    records = await helpers.getRecords("Clips", {
      sort: [{ field: "Clip Nr.", direction: "asc" }],
      filterByFormula: formula,
    });
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
