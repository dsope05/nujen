import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { selectCaptchaState, setCaptchaState } from "../store/captchaSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Newsletter({ switchRenderNewsletter, newsletter }) {
  const authState = useSelector(selectCaptchaState);
  console.log('authSTATE newlsetter', authState)
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
            Newsletter 
          </h1>
          <p style={{ lineHeight: 1.5, fontSize: 18 }}>
            Test Newsletter
          </p>
        </div>
      </main>
    </>
  )
}
