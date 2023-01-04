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
}

export default async function handler(request, response) {
  if (process.env.ENV === 'dev') {
    return response.status(200).json(gptMockResponse);
  }
    const formData = JSON.parse(request.body)
    console.log('formData api', formData)
    const prompt1 = `Hi GPT-3! We need you to help us build a newsletter for a brand community.
    To help us build the newsletter, we're going to do three things:
    learn about the author and how they write, why they are writing the newsletter, and where we can get specific information to help us build the newsletter.

    The author of the newsletter will be ${formData.firstName} ${formData.lastName}. They identify as a ${formData.ethnicity} ${formData.gender}.

    This is ${formData.firstName}'s autobiography: ${formData.autobiography}

    Below is a sample of ${formData.firstName}' writing:

    ${formData.writingSample}

    ${formData.firstName} is writing a newsletter for ${formData.company}'s brand community. The newsletter is about ${formData.topic1}, ${formData.topic2} and ${formData.topic3}. 
    Here is the purpose of the newsletter: ${formData.purpose}

    The newsletter is for: ${formData.readers}.

    `;
    const introPrompt = `write an intro to the newsletter in the style of ${formData.firstName}`;
    const updatesPrompt = `write the Community Updates section of a newsletter. This section will have 3 sub-sections: ${formData.communityS1Title}, ${formData.communityS2Title}, ${formData.communityS3Title}. Below is information for each sub-section.
      ${formData.communityS1Title}:
      ${formData.communityS1Info}

      ${formData.communityS2Title}:
      ${formData.communityS2Info}

      ${formData.communityS3Title}:
      ${formData.communityS3Info}
      
      Create a 2-sentence blurb for each of these sub-sections.`;
   const titlePrompt = `give a good title for this newsletter that ${formData.firstName} would like with no quotations around it`;
   const celebratePrompt1 = `In the newsletter we will acknowledge and celebrate a community member for their contribution and impact. The member we would like to acknowledge is ${formData.member1Name}, here is a list of their contributions:
    - ${formData.member1Contribution}
    - ${formData.member1Impact}

    Write me a two sentence blurb that shows our gratitude for ${formData.member1Name}, in the style of ${formData.firstName}
    `;
   const celebratePrompt2 = `In the newsletter we will acknowledge and celebrate a community member for their contribution and impact. The member we would like to acknowledge is ${formData.member2Name}, here is a list of their contributions:
    - ${formData.member2Contribution}
    - ${formData.member2Impact}

    Write me a two sentence blurb that shows our gratitude for ${formData.member2Name}, in the style of ${formData.firstName}
    `;

   const intro = completionApi(`${prompt1}\n\n${introPrompt}`);
   const celebrate1 = completionApi(`${prompt1}\n\n${celebratePrompt1}`);
   const celebrate2 = completionApi(`${prompt1}\n\n${celebratePrompt2}`);
   const updates = completionApi(`${prompt1}\n\n${updatesPrompt}`);
   const title = completionApi(`${prompt1}\n\n${titlePrompt}`);
   const articlePrompt1 = `Find an article on the internet called "${formData.article1Title}" by ${formData.article1Author}. Give me a 2-sentence summary of the article that can entice people to read it.`
   const articlePrompt2 = `Find an article on the internet called "${formData.article2Title}" by ${formData.article2Author}. Give me a 2-sentence summary of the article that can entice people to read it.`
   const articlePrompt3 = `Find an article on the internet called "${formData.article3Title}" by ${formData.article3Author}. Give me a 2-sentence summary of the article that can entice people to read it.`
   const questionPrompt = `Share a question that we can ask readers to answer via a tweet that aligns with the newsletter's purpose, in the style of ${formData.firstName}`
   const article1 = completionApi(articlePrompt1);
   const article2 = completionApi(articlePrompt2);
   const article3 = completionApi(articlePrompt3);
   const question = completionApi(`${prompt1}\n\n${questionPrompt}`);
   console.log('gpt response here')
   const gptResponse = await Promise.all([intro, updates, article1, article2, article3, title, celebrate1, celebrate2, question]).then(([introResponse, updatesResponse, article1Response, article2Response,
    article3Response, titleResponse, celebrate1Response, celebrate2Response, questionResponse]) => {
     return {
      question: questionResponse.data.choices[0].text,
      title: titleResponse.data.choices[0].text,
      intro: introResponse.data.choices[0].text,
      updates: updatesResponse.data.choices[0].text,
      article1: {
        title: formData.article1Title,
        url: formData.article1Link,
        response: article1Response.data.choices[0].text,
     },
      article2: {
        title: formData.article2Title,
        url: formData.article2Link,
        response: article2Response.data.choices[0].text,
     },
      article3: {
        title: formData.article3Title,
        url: formData.article3Link,
        response: article3Response.data.choices[0].text,
     },
     celebrate1: {
       response: celebrate1Response.data.choices[0].text,
     },
     celebrate2: {
       response: celebrate2Response.data.choices[0].text,
     }
    }})
   response.status(200).json(gptResponse);
};
