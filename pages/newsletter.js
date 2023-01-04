import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/newsletter.module.css'
import { useRouter } from 'next/router'
import { selectCaptchaState, setCaptchaState } from "../store/captchaSlice";
import { selectFormDataState, setFormDataState } from "../store/formDataSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

export default function Newsletter({ switchRenderNewsletter }) {
  const [gptNewsletter, updateGPTNewsletter] = useState({})
  const authState = useSelector(selectCaptchaState);
  const formDataState = useSelector(selectFormDataState);
  useEffect(() => {
    fetch('/api/completion', {
      method: 'POST',
      body: JSON.stringify(formDataState)
    }).then(res => res.json()).then((chatGPTResponse) => {
      updateGPTNewsletter(chatGPTResponse)
    })
  }, [])
  console.log('authSTATE newlsetter', authState)
  console.log('form Data State newsletter', formDataState)

  const router = useRouter()
  const goBack = () => {
    router.push('/')
  }

  return (
    <>
    <div className={styles.header}>
       <h3 onClick={goBack} style={{ cursor: 'pointer', marginLeft: '40px', color: '#333', fontSize: '24px' }}>
            Nujen
        </h3>
    </div>
      <main className={styles.newsletterMain}>
        <div className={styles.newsletterCenter}>
          { Object.keys(gptNewsletter).length > 0 ? (
          <div>
          <h1 className={styles.title}>
            {gptNewsletter?.title}
          </h1>
          <div className={styles.paper}>
            <h2 className={styles.newsletterFirstSectionHeader}>
              Quick Letter
            </h2>
            <p style={{ lineHeight: 1.5, fontSize: 18 }}>
              { gptNewsletter.intro }
            </p>
            <h2 className={styles.newsletterSectionHeader}>
              Community Updates
            </h2>
            <p style={{ lineHeight: 1.5, fontSize: 18 }}>
              { gptNewsletter.updates }
            </p>
            <h2 className={styles.newsletterSectionHeader}>
              3-2-1: Learn, Celebrate & Do
            </h2>
            <p style={{ lineHeight: 1.5, fontSize: 18, marginBottom: '10px' }}>
              1. &quot;{formDataState?.article1Title}&quot; by {formDataState?.article1Author}
              <p>
                { gptNewsletter?.article1?.response }
              </p>
            </p>
            <p style={{ lineHeight: 1.5, fontSize: 18, marginBottom: '10px' }}>
              2. &quot;{formDataState?.article2Title}&quot; by {formDataState?.article2Author}
              <p>
                { gptNewsletter?.article2?.response }
              </p>
            </p>
            <p style={{ lineHeight: 1.5, fontSize: 18, marginBottom: '10px' }}>
              3. &quot;{formDataState?.article3Title}&quot; by {formDataState?.article3Author}
              <p>
                { gptNewsletter?.article3?.response }
              </p>
            </p>
            <h2 className={styles.newsletterSectionHeader}>
              Celebrate
            </h2>
            <p style={{ lineHeight: 1.5, fontSize: 18, marginBottom: '10px' }}>
              1. {formDataState?.member1Name} {formDataState?.member1TwitterHandle}
              <p>
                { gptNewsletter?.celebrate1?.response }
              </p>
            </p>
            <p style={{ lineHeight: 1.5, fontSize: 18, marginBottom: '10px' }}>
              2. {formDataState?.member2Name} {formDataState?.member2TwitterHandle}
              <p>
                { gptNewsletter?.celebrate2?.response }
              </p>
            </p>
            <h2 className={styles.newsletterSectionHeader}>
              Do
            </h2>
            <p style={{ lineHeight: 1.5, fontSize: 18, marginBottom: '10px' }}>
              Q of the Day: &quot;{ gptNewsletter?.question }&quot;. Tag {formDataState?.companyTwitterHandle} to be featured!
            </p>
          </div>
          </div>
        ) : (
        <div className={styles.loadingSpinner}>
          <CircularProgress />
        </div>
        )}
        </div>
      </main>
    </>
  )
}
