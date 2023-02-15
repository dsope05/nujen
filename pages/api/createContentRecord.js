import Cors from 'cors'
import { createContentRecord } from "../../airtable/airtable";

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: 'chrome-extension://oaobpbhkggcnanmbffalbodmnedpbiao'
})

function runMiddleware(
  req,
  res,
  fn
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function createContentRecordHandle(req, res) {
  await runMiddleware(req, res, cors)
  const { email, content } = JSON.parse(req.body)
  console.log('email', email)
  console.log('content', content)
  createContentRecord({
    email,
    content,
    res,
  });
  // res.status(200).json({ status: 'ok' });
}