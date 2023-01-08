export const getTwitterUserId = (twitterHandle) => {
  return fetch(`https://api.twitter.com/2/users/by/username/${twitterHandle}`, {
    headers: {
      'Authorization': `Bearer ${process.env.TWITTER_BEARER}`
    }
  })
  .then((response) => response.json())
  .then((response) => response)
}

export const getLikedTweets = (userId) => {
  return fetch(`https://api.twitter.com/2/users/${userId}/liked_tweets?max_results=100&expansions=author_id&tweet.fields=created_at`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER}`
      }
    })
    .then(res => res.json())
}

export const getTwitterUserName = (userId) => {
  return fetch(`https://api.twitter.com/2/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER}`
      }
    })
    .then((response) => response.json())
    .then((response) => response)
}