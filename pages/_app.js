import '../styles/globals.css'
import { wrapper } from "../store/store";
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { magic } from '../magic/magic';
import { UserContext } from '../magic/UserContext';
import { selectSubscriptionStatusState, setSubscriptionStatusState } from "../store/subscriptionStatusSlice";
import { useDispatch, useSelector } from "react-redux";
import checkSubscription from "../apiUtils/subscriptionCheck";

const App = ({ Component, pageProps }) => {
  const [user, setUser] = useState();
  const subscriptionStatus = useSelector(selectSubscriptionStatusState);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const asyncCalls = async () => {
      setUser({ loading: true });
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        const userData = await magic.user.getMetadata();
          setUser(userData)
          if (userData?.email) {
            checkSubscription(userData.email).then(({ sub, tri }) => {
              const subscriptionState = {
                subscription: 'inactive',
                freeTrial: 'inactive',
              };
              if (sub.status === 'active') {
                subscriptionState.subscription = 'active'
              }
              if (tri.status === 'active') {
                subscriptionState.freeTrial = 'active'
              } else if (tri.status === 'noRecord') {
                subscriptionState.freeTrial = 'noRecord'
              }
                dispatch(setSubscriptionStatusState(subscriptionState));
            })
          }
        } else {
          setUser({ user: null });
        }
      }
      asyncCalls();
  }, []);
  
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default wrapper.withRedux(App)
