import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/newsletter.module.css'
import { useRouter } from 'next/router'
import { selectCaptchaState, setCaptchaState } from "../store/captchaSlice";
import { selectFormDataState, setFormDataState } from "../store/formDataSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Newsletter({ switchRenderNewsletter }) {
  const [gptNewsletter, updateGPTNewsletter] = useState({})
  const authState = useSelector(selectCaptchaState);
  const formDataState = useSelector(selectFormDataState);
  useEffect(() => {
    fetch('/api/completion', {
      method: 'POST',
      body: JSON.stringify(formDataState)
    }).then(res => res.json()).then((chatGPTResponse) => {
      console.log('chatGPTResponse', chatGPTResponse)
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
          <h1 className={styles.title}>
            Title
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
            <p style={{ lineHeight: 1.5, fontSize: 18 }}>
              { gptNewsletter?.article1?.response }
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
