import { getTwitterUserId, getLikedTweets, getTwitterUserName } from '../../apiUtils/apis';
//import finalTweetsJson from '../components/mocks/finalTweets.json';

const tweetFilter = ({ likedTweets, mention, hashtag }) => {
  const dateNow = Date.now();
  const filteredTweets = likedTweets.filter((tweet, i) => {
    const createdAt = new Date(tweet?.created_at)?.getTime() || '';
    const timeFilter = (dateNow - createdAt) < 6.048e8;
    const hashtagFilter = hashtag ? tweet.text.includes(hashtag) : true;
    const mentionFilter = mention ? tweet.text.includes(mention) : true;
    return timeFilter && hashtagFilter && mentionFilter;
  })
  return filteredTweets;
}

export default async function handler(req, res) {
  if (process.env.ENV === '') {
    res.status(200).json({ success: true });
  } else {
    const { twitterHandle, hashtag, mention } = JSON.parse(req.body);

    const { data: twitterUser } = twitterHandle ? await getTwitterUserId(twitterHandle) : '';
    const userId = twitterUser?.id;
    const { data: likedTweets } = userId ? await getLikedTweets(userId) : [];


    if (likedTweets) {
      const filteredTweets = tweetFilter({ likedTweets, mention, hashtag });
      const limitedTweets = filteredTweets.filter((tweets, i) => {
        if (i > 20) {
          return false;
        }
        return true;
      })
      
      const authors = await Promise.all(limitedTweets.map((tweet) => {
        return getTwitterUserName(tweet.author_id)
      }))
      const finalTweets = authors.reduce((acc, { data }, i) => {
        acc[data?.username] = limitedTweets[i].text;
        return acc;
      }, {})
      console.log('finalTweets: ', Object.keys(finalTweets).length)
      res.status(200).json(finalTweets)
    } else {
      res.status(500).json({ error: `No liked tweets found for user ${twitterHandle} userId:${userId}`})
    }
  }
}