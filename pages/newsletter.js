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
import { createNewsletterRecord } from "../airtable/airtable";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import newsletterMock from "./mocks/gptMockResponse";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import {CopyToClipboard} from 'react-copy-to-clipboard';


const JoditWrapper = dynamic(() => import('../components/JoditWrapper'), {
  ssr: false
})

export default function Newsletter({ switchRenderNewsletter }) {
  const [gptNewsletter, updateGPTNewsletter] = useState(newsletterMock);
  const [copied, updateCopiedState] = useState(false);
  const authState = useSelector(selectCaptchaState);
  const formDataState = useSelector(selectFormDataState);

  const editNewsletter = (e) => {
    updateGPTNewsletter(e);
  }

  // Generate the nujen newsletter
  const generateNewsletter = async () => {
    /*
    // Twitter Integration
    const tweets = await fetch("/api/tweets", {
      method: "POST",
      body: JSON.stringify({
        twitterHandle: formDataState?.twitterHandle,
        keyword: formDataState?.keyword,
      }),
    }).then((res) => res.json());
    console.log("Curated tweets: ", tweets);
    console.log("Form data state: ", formDataState);

    // GPT-3 Integration
    fetch("/api/completion", {
      method: "POST",
      body: JSON.stringify({ formDataState: formDataState, tweets: tweets }),
    })
      .then((res) => res.json())
      .then((chatGPTResponse) => {
        updateGPTNewsletter(chatGPTResponse);
        createNewsletterRecord(
          formDataState?.email,
          JSON.stringify(chatGPTResponse)
        );
      });
  */
  };
  generateNewsletter();

  const router = useRouter();
  const goBack = () => {
    router.push("/");
  };

  console.log("Nujen Newsletter: ", gptNewsletter);
  console.log("gptNewsletter: ", gptNewsletter);


/*
  */
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

  return (
    <>
      <script
        type="text/javascript"
        src="build/jodit.es2018.min.js"
        async
      ></script>
      <div className={styles.header}>
        <h3
          onClick={goBack}
          style={{
            cursor: "pointer",
            marginLeft: "40px",
            color: "#333",
            fontSize: "24px",
          }}
        >
          Nujen
        </h3>
      </div>
      <main className={styles.newsletterMain}>
        <div className={styles.newsletterCenter}>
          <div className={styles.paper}>
            <h3 className={styles.newsletterWelcome}>
              { `Here's your nujen newsletter!`}
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
                <CopyToClipboard text={gptNewsletter}
                  onCopy={() => updateCopiedState(true)}>
                  <Button
                    variant="outlined"
                  >
                  <span className={styles.roboEmoji}> 🤖 </span>
                  Copy HTML
                  </Button>
                </CopyToClipboard>
              </span>
              <span className={styles.btnSpan}>
                <Button
                  variant="outlined"
                  >
                  <span className={styles.roboEmoji}> 💛 </span>
                    Show us some love
                </Button>
              </span>
              <span className={styles.btnSpan}>
              <Button
                variant="outlined"
                >
                 <span className={styles.roboEmoji}> ⛰️ </span>
                 View our roadmap
                </Button>
              </span>
            </div>
            {Object.keys(gptNewsletter).length > 0 ? (
              <>
                <JoditWrapper editNewsletter={editNewsletter} gptNewsletter={gptNewsletter}/>
                <h1>Copy the HTML 👇</h1>
                <div>{gptNewsletter}</div>
              </>
            ) : (
              <div className={styles.loadingSpinner}>
                <CircularProgress />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
