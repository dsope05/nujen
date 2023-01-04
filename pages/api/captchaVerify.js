// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (process.env.ENV === 'dev') {
    res.status(200).json({ success: true })
  } else {
    const { value } = JSON.parse(req.body);
    fetch(process.env.CAPTCHA_URL, {
      method: 'POST',
      body: JSON.stringify({
        secret: process.env.CAPTCHA_SECRET,
        response: value,
      })
    }).then(res => res.json()).then((res) => {
      console.log('res', res)
      if (res.success === true) {
        res.status(200).json({ success: true })
      } else {
        res.status(500).json({ success: false })
      }
    })

  }
}
