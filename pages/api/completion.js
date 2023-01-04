import { Configuration, OpenAIApi } from "openai";

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
    //const { answers: { answer1, answer2, answer3 }} = JSON.parse(request.body)
    const prompt1 = `Hi GPT-3! We need you to help us build a newsletter for a brand community.
    To help us build the newsletter, we're going to do three things:
    learn about the author and how they write, why they are writing the newsletter, and where we can get specific information to help us build the newsletter.

    The author of the newsletter will be Maricris Bonzo. She identifies as a Filipino American woman.

    This is Maricris's autobiography: Hi everyone! My name is Maricris Bonzo and I'm the Founder and Head of Community at Women in Web3. 
    I helped build a non-profit called GarageScript back in 2017 that taught AND paid people to code and helped them land jobs through peer-to-peer learning. 
    I later went on to start a Youtube channel where I taught people how to code in Vim, how to learn JavaScript and how to integrate with cool APIs that I found on Hacker News. 
    With my artistic and techie background, I soon became a Developer Advocate for various companies - where I built and deployed lots of full-fledged sample apps with supporting blogs,
    video tutorials or conf. talks to guide other devs on how to build them. As you can see, I'm what you can call a Multi-Passionate Creative. I love to code, create content and build communities.
    Super happy to be able to do all 3 in this wonderful space of web3. Currently, I'm OBSESSED with community building in DAOs, and gathering meaningfully. 
    My dream is to launch the Women in Web3 DAO so that women, esp. underrepresented women, can have a fun and sustainable way to build their dream job in web3 (something I'm currently trying to achieve with Women in Web3 - meta, right?).
    If you ever want to chat with me about Developer Relations, Community Building, or being a Founder in web3, pls feel free to book here: https://calendar.app.google/ZFk7NLN7ygaNe7Wy5.
    I'm also super active on Twitter: https://twitter.com/seemcat.
    Maricris is obsessed about community-first startups and gathering meaningfully.

    Below is a sample of Maricris' writing:

    Guess what? It has officially been one month since I experienced my very first severe anxiety attack 🙃. Because I’ve never really felt anxiety in my life - that is, until I started going HAM at the startup I worked for,
    I knew it was a serious warning sign. My body, mind & soul was done with that hustle life.

    And so, I left my decent paying job to go full-time into web3 and carve my own, more balanced career path 👏.

    One might ask, “Do you regret leaving during the worst bear market of the year?” My answer is nah. I don’t regret finally prioritizing my mental and emotional well-being.

    Besides, I went on to have the most fun time ever being a full-time, Multi-Passionate Entrepreneur in web3. In as little as 4 1/2 weeks, I was able to do the following:

    Attend Permissionless & met incredible ppl in web3 like Bux and Coopahtroopa
    Was accepted to become a Blu3 DAO Scholar (thanks to Harmony & Storj)
    Participated & won bounties for Activate x Wormhole hackathon
    Gave a talk on Crypto Wallets for Get Money Get Paid 2022 Conference
    Connected with amazing Founders of communities for women (Cami, Maggie, Deana, Alejandra, & Novell)
    Attended Graph Day & finally met Kevin Owocki IRL
    Participated in Graph Hack & won 1st place of the Coinbase bounty
    Pitched the WOMEN IN WEB3 Grant at the GR14 DEI Pitch Session


    Maricris is writing a newsletter for Women in Web 3's brand community. The newsletter is about entrepreneurship, venturing with compassion, and web3
    Here is the purpose of the newsletter: To use a weekly newsletter to bring web3 and WOMEN IN WEB3 updates to members of the community in an accessible way.

    The newsletter is for: Members, partners, sponsors and allies of WOMEN IN WEB3.

    `;
    const introPrompt = 'write an intro to the newsletter in the style of Maricris';
    const updatesPrompt = `write the Community Updates section of a newsletter. This section will have 3 sub-sections: Past Events, Upcoming Events and Opportunities. Below are bullet points for each sub-section.

    Past Events:
    - 5 Days of Venturing into the Metaverse
    - Article Club
    - Podcast Club
    - Tea Time
    
    Upcoming Events
    - Podcast Club
    - Article Club
    - Tea Time
    - Book Club
    
    Opportunities
    - Looking for tech founders
    - 66 Days of Content
    - Job Openings
    
    Create a 2-sentence blurb for each of these sub-sections.`;
   const intro = completionApi(`${prompt1}\n\n${introPrompt}`);
   const updates = completionApi(`${prompt1}\n\n${updatesPrompt}`);
   const prompt3 = `Find an article on the internet called "I created social networks within our community Slack" by Rosie Sherry. Give me a 2-sentence summary of the article that can entice people to read it.`
   const article1 = await completionApi(prompt3);
   console.log('gpt response here')
   const gptResponse = await Promise.all([intro, updates, article1]).then(([introResponse, updatesResponse, article1Response]) => {
     return {
      title: 'My Newsletter Title',
      intro: introResponse.data.choices[0].text,
      updates: updatesResponse.data.choices[0].text,
      article1: {
        title: 'I created social networks within our community Slack',
        response: article1Response.data.choices[0].text,
     }
    }})
   response.status(200).json(gptResponse);
};
