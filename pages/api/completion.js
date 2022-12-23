import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generatePrompt = (text) => {
  return text;
}

export default async function handler(request, response) {
    const { answers: { answer1, answer2, answer3 }} = JSON.parse(request.body)
    const prompt = generatePrompt(`Generate a story about a person named ${answer1} who goes to ${answer2} and experiences ${answer3}`);
    console.log('prompt', prompt)
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.6,
      max_tokens: 2000,
    });
    response.status(200).json({ result: completion.data.choices[0].text });
};
