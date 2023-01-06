import { getTwitterUserId, getLikedTweets, getTwitterUserName } from '../../apiUtils/apis';
//import finalTweetsJson from '../mocks/finalTweets.json';

export default async function handler(req, res) {
  if (process.env.ENV === '') {
    res.status(200).json({ success: true });
  } else {
    const { twitterHandle = 'mixednutssss', hashtag = 'bitcoin' } = JSON.parse(req.body);

    const { data: { id: userId }} = await getTwitterUserId(twitterHandle);
    const { data: likedTweets } = await getLikedTweets(userId);

    const hashtaggedTweets = likedTweets.filter((tweet) => tweet.text.includes(hashtag))
    const authors = await Promise.all(hashtaggedTweets.map((tweet) => {
      return getTwitterUserName(tweet.author_id)
    }))
    const finalTweets = authors.reduce((acc, { data: { username } }, i) => {
      acc[username] = hashtaggedTweets[i].text;
      return acc;
    }, {})
    res.status(200).json(finalTweets)
  }
}