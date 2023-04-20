import airtableHelpers from "~~/server/utils/airtable";

/**
 * Gets the clip with the specified id from airtable
 */
export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const record = await airtableHelpers.getSingleRecord(id);
  return record;
});
