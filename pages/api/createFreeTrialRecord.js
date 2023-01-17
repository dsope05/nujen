import { createFreeTrialRecord } from "../../airtable/airtable";

export default async function queryFreeTrialRecordHandle(req, res) {
  const { email, handle } = JSON.parse(req.body)
  createFreeTrialRecord({
    email,
    handle,
  });
  res.status(200).json({ status: 'ok' });
}