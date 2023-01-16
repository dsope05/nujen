import { queryFreeTrialRecord } from "../../airtable/airtable";

export default async function queryFreeTrialRecordHandle(req, res) {
  const { email, handle } = JSON.parse(req.body)

  const status = await queryFreeTrialRecord({
    email,
    handle,
  });
  res.status(200).json({ status });
}