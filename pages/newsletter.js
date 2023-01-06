import { useState, useEffect } from "react";
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

export default function Newsletter({ switchRenderNewsletter }) {
  const [gptNewsletter, updateGPTNewsletter] = useState({});
  const authState = useSelector(selectCaptchaState);
  const formDataState = useSelector(selectFormDataState);

  useEffect(() => {
    // pass in twitterHandle from formDataState
    const generateNewsletter = async () => {
      const tweets = await fetch('/api/tweets', {
        method: 'POST',
        body: JSON.stringify({ twitterHandle: 'mixednutssss'})
      })
      .then((res) => res.json())

      // pass in tweets to completion API here along with any necessary formData
      fetch('/api/completion', {
        method: 'POST',
        body: JSON.stringify(formDataState)
      }).then(res => res.json()).then((chatGPTResponse) => {
        updateGPTNewsletter(chatGPTResponse)
        createNewsletterRecord(formDataState?.email, JSON.stringify(chatGPTResponse))
      })
    }
    generateNewsletter();
  }, [])

  const router = useRouter();
  const goBack = () => {
    router.push("/");
  };

  console.log("gptNewsletter: ", gptNewsletter);
  return (
    <>
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
            {Object.keys(gptNewsletter).length > 0 ? (
              <>
                <div dangerouslySetInnerHTML={{ __html: gptNewsletter }} />
                <br />
                <br />
                - - -
                <br />
                <br />
                <br />
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
