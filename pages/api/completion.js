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
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 1,
  });
};

export default async function handler(request, response) {
  /*if (process.env.ENV === "") {
    return response.status(200).json(gptMockResponse);
  }*/
  const appState = JSON.parse(request.body);
  const formData = appState.formDataState;
  const tweets = appState.tweets;
  //console.log('tweetsxxx', JSON.stringify(tweets))
  const tweetsx = JSON.stringify(tweets)

  const promptForHTML = `My name is ${formData.firstName}, and I’m the ${formData.title} of ${formData.company}. I’m writing a weekly newsletter for ${formData.readers}, where I feature this week's ${formData.tagline}.

The purpose of the newsletter is: ${formData.purpose}.

We're going to write this newsletter, in my own writing style, in HTML. But first, you must understand the format. Here are each of the separate sections we need - each needs their own unique, catchy and relevant title (h1 in HTML):

1. Title
2. Quick Letter
3. ${formData.tagline}
4. Outro

Here are clear instructions on what how to title, as well as what to include in each of the sections:

Title: Needs a unique and catchy title for the newsletter (h1 in HTML)

Quick Letter: Needs a quick, personal intro that gives a new insight about how the week's been going for me (p in HTML). No title needed.

${formData.tagline}: Needs a title that is relevant (h1 in HTML). Content includes the ${formData.tagline} this week, which I will get from the list of tweets - (${formData.numOfTweets} tweets to be exact). Each of the ${formData.tagline} will have a subtitle that includes the author’s username as well as the title of their tweet (h2 in HTML). Each subtitle needs to be linked to the only URL in the tweet. Each of the tweets will also have a unique response from me that is max 2-3 sentences long and doesn't use too many exclamation marks (p in HTML).

Outro:  Needs a title that wraps up the newsletter (h1 in HTML). Content is a quick, personable outro with a call to action that inspires members to be featured in the newsletter. It also includes instructions on how to be featured: mention or tag ${formData.keyword}. Because this is an email-type of newsletter, you'll need to include my own, unique signature goodbye.

Here is the list of tweets: ${tweetsx}

Now you're ready. Write the newsletter, in my own writing style, in HTML.`;
console.log('prompt for html', promptForHTML)

  const newsletterHTMLResponse = await completionApi(`${promptForHTML}`);
//console.log('HTML response', newsletterHTMLResponse)
  const newsletterHTML = newsletterHTMLResponse.data.choices[0].text;
//console.log('HTML', newsletterHTML)
  response.status(200).json(newsletterHTML);
}
