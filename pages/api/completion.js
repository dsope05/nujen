import { Configuration, OpenAIApi } from "openai";
import gptMockResponse from "../mocks/gptMockResponse.json";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const completionApi = (prompt) => {
  return openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.6,
    max_tokens: 2000,
  });
};

export default async function handler(request, response) {
  /*if (process.env.ENV === "") {
    return response.status(200).json(gptMockResponse);
  }*/
  const formData = JSON.parse(request.body);
  console.log("formData api", formData);
  const promptForHTML = `
  My name is ${formData.firstName} ${formData.lastName}, and I’m the ${formData.title} of ${formData.company}. I’m writing a weekly newsletter for ${formData.readers}, where I feature this week's ${formData.tagline}.
  
  The purpose of the newsletter is to ${formData.purpose}.
  
  The format of the newsletter is as follows:
  
  1. A simple, sweet and sick title that aligns with the purpose of the newsletter (h1 in HTML)
  2. A quick, personal letter that gives a new insight about how the week's been going for me. (p in HTML)
  3. The ${formData.tagline} this week, from the list of tweets I’m about to share. Each one will have a unique response from me that is only 2 sentences long. This section will have a title called ${formData.tagline} (h1 in HTML). Each will have linked subtitles that include the author’s username as well as the title of their tweet, is linked to the tweet, and is concise.
  4. A quick outro with a call to action that inspires members to be featured in the newsletter. It also includes instructions on how to be featured: mention ${formData.companyTwitterHandle} and tag ${formData.hashtag}. This section will have a title that wraps up the newsletter (h1 in HTML).
  
  Each of these steps will have their own section.
  
  The object below is the list of tweets.
  
  { @seemcat: "Got something new ✨\n\nIntroducing the Nights & Weekends Alliance for @_buildspace\n\nJoin virtual co-working with 20+ #NWS2 builders around the world with a single click, anytime, anywhere.\n\nHere's a 30 sec video with light & dark mode. Thoughts? https://t.co/xA0tenHZdB", @dan: "It's launch day, friends! Welcome to Cash'd where you get easy to use tools to find your ideal cannabis strain. I'm excited to launch our first feature: the strain finder. Thank you @_buildspace and #Nws2 for the push to actually do this. \uD83D\uDEA2\n\nCheck out this short demo: https://t.co/Tt6Y4Dz1Yd" }
  
  Write the newsletter, in my own voice, in HTML.`;

  const newsletterHTMLResponse = await completionApi(`${promptForHTML}`);
  const newsletterHTML = newsletterHTMLResponse.data.choices[0].text;
  response.status(200).json(newsletterHTML);
}
