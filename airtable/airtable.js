const Airtable = require("airtable");

const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

export function createNewsletterRecord(email, chatGPTResponse, res) {
  base("v.5").create(
    [
      {
        fields: {
          Email: email,
          "Newsletter #1": chatGPTResponse,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        res.status(200).json({ status: "error", err });
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
      res.status(200).json({ status: "ok" });
    }
  );
}

export const createFreeTrialRecord = ({ email, handle }) => {
  base("freeTrial").create(
    [
      {
        fields: {
          email: email,
          twitterHandle: handle,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log("Free trial record created", record.get("email"));
      });
    }
  );
};

export const queryFreeTrialRecord = async ({ email, handle }) => {
  console.log("EMAIL", email);
  return new Promise((res, rej) => {
    base("freeTrial")
      .select({
        maxRecords: 1,
        view: "Grid view",
        filterByFormula: `FIND("${email}", email)`,
      })
      .firstPage(function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        if (records.length === 1) {
          records.forEach(function (record) {
            console.log("Retrieved", record.get("email"));
            const date = record.get("Date");
            let time;
            if (date) {
              time = new Date(date).getTime();
            }
            const now = Date.now();
            console.log("nowww", now - time);
            if (now - time > 2.628e9) {
              return res("inactive");
            }
            return res("active");
          });
        }
        console.log("err", err);
        console.log("records", records);
        return res("noRecord");
      });
  });
};

export function createContentRecord({ email, content, res }) {
  base("content").create(
    [
      {
        fields: {
          email,
          content,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        res.status(200).json({ status: "error", err });
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
      res.status(200).json({ records });
    }
  );
}

export const readContentRecord = async ({ email }) => {
  console.log("EMAIL", email);
  return new Promise((res, rej) => {
    base("content")
      .select({
        maxRecords: 1,
        view: "Grid view",
        filterByFormula: `FIND("${email}", email)`,
      })
      .firstPage(function (err, records) {
        if (records.length === 1) {
          records.forEach(function (record) {
            res(record.get('content'))
          });
        }
        if (err) {
          console.error(err);
          res('noRecord')
          return;
        }
        console.log("err", err);
        console.log("records", records);
        return res("noRecord");
      });
  });
};