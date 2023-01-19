import { createNewsletterRecord } from "../../airtable/airtable";

export default async function createNewsletterRecordHandle(req, res) {
  const { email, gptResponse } = JSON.parse(req.body);

  createNewsletterRecord(email, gptResponse, res);
}
