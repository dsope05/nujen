import { getTwitterUserId, getLikedTweets, getTwitterUserName } from '../../apiUtils/apis';
//import finalTweetsJson from '../mocks/finalTweets.json';

export default async function handler(req, res) {
  if (process.env.ENV === '') {
    res.status(200).json({ success: true });
  } else {
    const { twitterHandle, keyword } = JSON.parse(req.body);

    const { data: { id: userId }} = await getTwitterUserId(twitterHandle);
    const { data: likedTweets } = await getLikedTweets(userId);

    console.log('likedTweets: ', likedTweets.length);

    const tweetsWithKeyword = likedTweets.filter((tweet) => tweet.text.includes(keyword)).filter((res, i) => (i > 10 && i < 20))
    console.log('tweetsWithKeywordLength', tweetsWithKeyword.length)
    /*
    .reduce((acc, tweet) => {
      const newTweets = [...acc, tweet]
      try {
        const string = JSON.stringify(newTweets)
        acc.push(tweet)
      } catch (e) {
        console.log('ERROR', e)
        console.log('error tweet', tweet)
      }
      return acc;
    }, [])
    */
    //console.log('tweetsWithKeyword', tweetsWithKeyword)

    //console.log('tweetsWithKeyword: ', tweetsWithKeyword);
    const authors = await Promise.all(tweetsWithKeyword.map((tweet) => {
      return getTwitterUserName(tweet.author_id)
    }))
    const finalTweets = authors.reduce((acc, { data }, i) => {
      acc[data?.username] = tweetsWithKeyword[i].text;
      return acc;
    }, {})
    // console.log('finalTweets: ', finalTweets)
    res.status(200).json(finalTweets)
  }
}