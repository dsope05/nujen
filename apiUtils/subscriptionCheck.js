  const checkSubscription = async (email) => {
    const subs = fetch('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        email,
      })
    }).then(res => res.json())

    const trial = fetch('/api/queryFreeTrialRecord', {
      method: 'POST',
      body: JSON.stringify({
        email,
      })
    }).then(res => res.json());

    return Promise.all([subs, trial]).then(([sub, tri]) => ({
        sub,
        tri,
    }))
}

export default checkSubscription;