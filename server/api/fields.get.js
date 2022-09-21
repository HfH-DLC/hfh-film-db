import helpers from "@/server/utils/airtable.js";

export default defineEventHandler(async (event) => {
  const fields = await helpers.getUniqueFieldValues();
  return { fields };
});
