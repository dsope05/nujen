import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../magic/UserContext";
import Newsletter from "./newsletter";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Button from "@mui/material/Button";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import { magic } from '../magic/magic';

const inter = Inter({ subsets: ["latin"] });

const callChatGPT = async (answers) => {
  const res = await fetch("/api/completion", {
    method: "POST",
    body: JSON.stringify({ answers }),
  }).then((res) => res.json());
  return res.result;
};

export default function Home() {
  const [user, setUser] = useContext(UserContext);
  const [answers, updateAnswer] = useState({
    answer1: "",
    answer2: "",
    answer3: "",
  });
  const [snackBar, showSnackBar] = useState(false);
  const [subscribed, updateSubscribed] = useState(false);
  const router = useRouter();

  const snackAction = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => showSnackBar(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const handleLogin = (e) => {
    if (user?.issuer) {
      magic.user.logout().then(() => {
        setUser({ user: null });
        showSnackBar(true);
      });
    } else {
      router.push("login");
    }
  };
  const handleClick = (e) => {
    if (user?.issuer) {
      router.push("form");
    } else {
      router.push("login");
    }
  };
  const answerQuestion = (e, q) => {
    updateAnswer({ ...answers, [q]: e.target.value });
  };
  return (
    <>
      <Head>
        <title>Nujen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Analytics />
      <div className={styles.header}>
        <h3
          style={{
            cursor: "pointer",
            marginLeft: "40px",
            color: "lavender",
            fontSize: "24px",
          }}
        >
          nujen
        </h3>
        { !subscribed && (
          <a 
            href={process.env.STRIPE_CHECKOUT_URL}
            style={{ marginLeft: 'auto' }}
            target="_blank"
            rel="noreferrer"
          >
          <Button
            variant="text"
            sx={{
              marginRight: "20px",
              color: "lavender",
              border: '1px solid lavender'
            }}
          >
            Pricing
          </Button>
          </a>
        )}
        <Button
          variant="outlined"
          sx={{
            marginRight: "20px",
            color: "lavender",
            border: "1px solid lavender",
          }}
          onClick={handleLogin}
        >
          {user?.issuer && 'Logout' || 'Login'}
        </Button>
        <Snackbar
          open={snackBar}
          autoHideDuration={4000}
          onClose={() => showSnackBar(false)}
          message="Logged out!"
          action={snackAction}
        />
      </div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Grow your brand community
        </h1>
        <h3 className={styles.description}>
        Connect your company&apos;s Twitter and get engaging newsletters in seconds
        </h3>
        <div className={styles.homepageBtnContainer}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#EC524C",
              color: "white",
              marginTop: "10px",
              fontFamily: "Nunito Sans",
            }}
            onClick={handleClick}
          >
            Get started for free{" "}
          </Button>
          <Button
            variant="text"
            sx={{
              marginTop: "10px",
              padding: "12px",
              fontFamily: "Nunito Sans",
            }}
          >
            <a
              href="https://www.loom.com/share/edadf0c9dc4a46a5a05378b60950d27e"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", color: "#333" }}
            >
              View Demo
            </a>
          </Button>
        </div>
      </main>
      <div className={styles.whySection}>
        <div className={styles.whyLeft}>
          Why <span className={styles.purple}>nujen?</span>
          <ul className={styles.whyNujenList}>
            <li className={styles.bulletList}>
              Save time
              <p className={styles.bulletDesc}>
                Cut newsletter writing time by 90% so that you can spend more
                time creating value or fostering deeper bonds among members.
              </p>
            </li>
            <li className={styles.bulletList}>
              Customize
              <p className={styles.bulletDesc}>
                Create a newsletter that aligns with your brand identity.
              </p>
            </li>
            <li className={styles.bulletList}>
              Nurture & Scale Community
              <p className={styles.bulletDesc}>
                Help members feel belonging, and drive awareness by sending
                newsletters worth reading, sharing and engaging with.
              </p>
            </li>
          </ul>
        </div>
        <div className={styles.whyRight}>
          <div className={styles.imageContainer}>
            <Image
              src="/newsletter1.jpg"
              alt="Picture of the newsletter"
              width={275}
              height={350}
            />
            <Image
              src="/newsletter2.jpg"
              alt="Picture of the newsletter"
              width={275}
              height={350}
            />
          </div>
          <Button
            variant="text"
            sx={{
              padding: "10px",
            }}
            className={styles.viewNewsletterBtn}
          >
            <a
              href="https://www.canva.com/design/DAFWAjyKI90/_5d2RsYq0aunDcz7yidgdg/view?website#4"
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: "#333",
                fontFamily: "Nunito Sans",
              }}
            >
              View Sample Newsletter
            </a>
          </Button>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerText}>
          <h1 className={styles.footerTitle}>Ready to get started?</h1>
          <h3 className={styles.footerDescription}>
            Generate your first newsletter with nujen 💌
          </h3>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              backgroundColor: "#EC524C",
              padding: "10px",
              color: "white",
              marginTop: "10px",
              fontFamily: "Nunito Sans",
            }}
          >
          Get started for free
          </Button>
        </div>
      </div>
      <div className={styles.subscribe}>
        <a
          rel="noreferrer"
          target="_blank"
          href="https://sunny-composer-9928.ck.page/bb8f06e58f"
          data-size="large"
        >
          Subscribe to our nujen-generated newsletter!
        </a>
      </div>
    </>
  );
}
