import helpers from "@/server/utils/airtable";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const record = await helpers.getSingleRecord("Clips", id);
  return record;
});
