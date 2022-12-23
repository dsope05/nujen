import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

export default function Newsletter({ switchRenderNewsletter, newsletter }) {
  const router = useRouter()
  const goBack = () => {
      switchRenderNewsletter(false)
  }

  return (
    <>
    <div className={styles.header}>
       <h3 style={{ cursor: 'pointer', marginLeft: '50px' }} onClick={goBack}>
           Nujen
       </h3>
    </div>
      <main className={styles.newsletterMain}>
        <div className={styles.newsletterCenter}>
          <h1 className={styles.title}>
            Newsletter 
          </h1>
          <p style={{ lineHeight: 1.5, fontSize: 18 }}>
            { newsletter }
          </p>
        </div>
      </main>
    </>
  )
}
