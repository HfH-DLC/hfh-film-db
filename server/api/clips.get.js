import helpers from "@/server/utils/airtable";

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  const conditions = [];
  conditions.push("NOT({Clip Nr.} = '')");
  if (query.searchText) {
    conditions.push(helpers.getSearchTextFormula(query.searchText));
  }
  helpers.getAllowedFilters().forEach((filter) => {
    if (query[filter]) {
      const filterCondition = helpers.getFilterFormula(filter, query[filter]);
      if (filterCondition) {
        conditions.push(filterCondition);
      }
    }
  });
  const formula = `AND(${conditions.join(", ")})`;
  const records = await helpers.getRecords("Clips", {
    sort: [{ field: "Clip Nr.", direction: "asc" }],
    filterByFormula: formula,
  });

  return { records };
});