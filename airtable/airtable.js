const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

export function createNewsletterRecord(email, chatGPTResponse) {
  base('v.5').create([
    {
      "fields": {
        "Email": email,
        "Newsletter #1": chatGPTResponse,
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });
}