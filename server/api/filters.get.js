import helpers from "~~/server/utils/airtable.js";

export default defineEventHandler(async (event) => {
  const filters = await helpers.getFiltersWithOptions();
  return { filters };
});
