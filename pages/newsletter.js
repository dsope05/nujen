import React, { useState, useEffect, useRef, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/newsletter.module.css";
import { useRouter } from "next/router";
import { selectCaptchaState, setCaptchaState } from "../store/captchaSlice";
import { selectFormDataState, setFormDataState } from "../store/formDataSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Header from "../components/header";

const JoditWrapper = dynamic(() => import("../components/JoditWrapper"), {
  ssr: false,
});

export default function Newsletter({ switchRenderNewsletter }) {
  const [gptNewsletter, updateGPTNewsletter] = useState('');
  const [copied, updateCopiedState] = useState(false);
  const [noTweetsError, updateNoTweetsError] = useState(false);
  const [timeoutError, updateTimeoutError] = useState(false);
  const authState = useSelector(selectCaptchaState);
  const formDataState = useSelector(selectFormDataState);

  const editNewsletter = (e) => {
    updateGPTNewsletter(e);
  };

  useEffect(() => {
  // Generate the nujen newsletter
  const generateNewsletter = async () => {
    // Twitter Integration
    const tweets = await fetch("/api/tweets", {
      method: "POST",
      body: JSON.stringify({
        twitterHandle: formDataState?.twitterHandle,
        hashtag: formDataState?.hashtag,
        mention: formDataState?.mention,
      }),
    }).then((res) => res.json());
    console.log("Curated tweets: ", tweets);
    if (!tweets || tweets.error) {
      updateNoTweetsError(true)
    } else {
      const timer = setTimeout(() => {
        updateTimeoutError(true)
      }, 60000)
    // GPT-3 Integration
    fetch("/api/completion", {
      method: "POST",
      body: JSON.stringify({ formDataState: formDataState, tweets: tweets }),
    })
      .then((res) => res.json())
      .then((chatGPTResponse) => {
        clearTimeout(timer);
        console.log('chatGPTResponse for Airtable: ', chatGPTResponse)
        updateGPTNewsletter(chatGPTResponse?.res);
        fetch('/api/createNewsletterRecord', {
          method: 'POST',
          body: JSON.stringify({
            email: formDataState?.email,
            gptResponse: chatGPTResponse?.res
          })
        })
      });
  };
}
  if (!gptNewsletter) {
    generateNewsletter();
  }
}, [])

  const router = useRouter();
  const goBack = () => {
    router.push("/");
  };

  const snackAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => updateCopiedState(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  if (noTweetsError) {
   return(
     <>
      <div className={styles.header}>
        <h3
          onClick={goBack}
          style={{
            cursor: "pointer",
            marginLeft: "40px",
            color: '#452c63',
            fontSize: "24px",
          }}
        >
          nujen
        </h3>
      </div>
      <main className={styles.newsletterMain}>
        <div className={styles.noTweetsCenter}>
          <h1>
            No tweets found for input, please adjust parameters and try again
          </h1>
        </div>
      </main>
     </>
   )
  }

  if (timeoutError) {
   return(
     <>
      <div className={styles.header}>
        <h3
          onClick={goBack}
          style={{
            cursor: "pointer",
            marginLeft: "40px",
            color: '#452c63',
            fontSize: "24px",
          }}
        >
          nujen
        </h3>
      </div>
      <main className={styles.newsletterMain}>
        <div className={styles.timeoutContainer}>
          <h1>
            Sorry, the gpt-3 api timed out. This happens sometimes. Please try again later!
          </h1>
        </div>
      </main>
     </>
   )
  }

  return (
    <>
      <div className={styles.header}>
        <h3
          onClick={goBack}
          style={{
            cursor: "pointer",
            marginLeft: "40px",
            color: '#452c63',
            fontSize: "24px",
          }}
        >
          nujen
        </h3>
      </div>
      <main className={styles.newsletterMain}>
        <div className={styles.newsletterCenter}>
          { Object.keys(gptNewsletter).length > 0 ? (
          <>
          <h1 className={styles.title}>
            {gptNewsletter?.title}
          </h1>
          <div className={styles.paper}>
            <h3 className={styles.newsletterWelcome}>
              {`Your nujen newsletter is ready.`}
            </h3>
            <div className={styles.newsletterButtons}>
              <Snackbar
                open={copied}
                autoHideDuration={4000}
                onClose={() => updateCopiedState(false)}
                message="Copied to clipboard!"
                action={snackAction}
              />
              <span className={styles.btnSpan}>
                <CopyToClipboard
                  text={gptNewsletter}
                  onCopy={() => updateCopiedState(true)}
                >
                  <Button sx={{ border: '1px white'}} variant="text">
                    <span className={styles.roboEmoji}> 🤖 </span>
                    Copy HTML
                  </Button>
                </CopyToClipboard>
              </span>
              <span className={styles.btnSpan}>
                <Button variant="text">
                  <span className={styles.roboEmoji}> 💛 </span>
                  <a
                    className="twitter-share-button"
                    style={{ textDecoration: 'none' }}
                    rel="noreferrer"
                    target="_blank"
                    href="https://twitter.com/intent/tweet?text=🤖%20Generated%20my%20first%20@nujen_ai%20newsletter!%0a%0a<ATTACH_SCREENSHOT_OF_NUJEN>%0a%0acc%20@_buildspace"
                    data-size="large"
                  >
                    Plz Support us
                  </a>
                </Button>
              </span>
              <span className={styles.btnSpan}>
                <Button variant="text">
                  <span className={styles.roboEmoji}> ⛰️ </span>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    style={{ textDecoration: 'none' }}
                    href="https://nujen.canny.io/"
                    data-size="large"
                  >
                    View our roadmap
                  </a>
                </Button>
              </span>
            </div>
            {Object.keys(gptNewsletter).length > 0 ? (
              <JoditWrapper
                editNewsletter={editNewsletter}
                gptNewsletter={gptNewsletter}
              />
            ) : (
              <div className={styles.loadingSpinner}>
                <CircularProgress sx={{ color: 'lavender' }} color="inherit" />
              </div>
            )}
          </div>
          </>
        ) : (
        <div className={styles.loadingSpinner}>
          <h1 style={{ marginBottom: '20px' }}>
            Generating your newsletter
          </h1>
          <h1 style={{ marginBottom: '40px' }}>
            This can take up to 30 seconds...
          </h1>
          <CircularProgress sx={{ color: 'lavender' }} color="inherit" />
        </div>
        )}
        </div>
      </main>
    </>
  );
}
