import '../styles/globals.css'
import { wrapper } from "../store/store";
import { useEffect, useState } from 'react'
  import { useRouter } from "next/router";
import { magic } from '../magic/magic';
import { UserContext } from '../magic/UserContext';

const App = ({ Component, pageProps }) => {
  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => setUser(userData));
      } else {
        setUser({ user: null });
      }
    });
  }, []);
  
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default wrapper.withRedux(App)
