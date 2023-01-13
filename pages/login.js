import EmailForm  from '../components/login/email-form';
import { useState, useContext, useEffect } from 'react';
import { magic } from '../magic/magic';
import { useRouter } from "next/router";
import { UserContext } from '../magic/UserContext';
import styles from "../styles/login.module.css";
import Header from "../components/header";


const Login = () => {
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const router = useRouter();

  // Redirec to /profile if the user is logged in
  useEffect(() => {
    user?.issuer && router.push('/form');
  }, [user]);

  async function handleLoginWithEmail(email) {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered

      // Trigger Magic link to be sent to user
      let didToken = await magic.auth.loginWithMagicLink({
        email,
      });

      // Validate didToken with server
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
      });

      if (res.status === 200) {
        // Set the UserContext to the now logged in user
        let userMetadata = await magic.user.getMetadata();
        await setUser(userMetadata);
        router.push('/form');
      }
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }
  return (
    <>
    <Header />
    <div className={styles.main}>
      <EmailForm disabled={disabled} onEmailSubmit={handleLoginWithEmail} />
      <style jsx>{`
        .login {
          max-width: 20rem;
          margin: 40px auto 0;
          padding: 1rem;
          border: 1px solid #dfe1e5;
          border-radius: 4px;
          text-align: center;
          box-shadow: 0px 0px 6px 6px #f7f7f7;
          box-sizing: border-box;
        }
      `}</style>
    </div>
    </>
  )
}

export default Login;