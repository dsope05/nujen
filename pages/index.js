import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react';
import Newsletter from './newsletter';

const inter = Inter({ subsets: ['latin'] })

const callChatGPT = async (answers) => {
  console.log('call gpt', answers)
  const res = await fetch('/api/completion', {
    method: 'POST',
    body: JSON.stringify({ answers })
  }).then(res => res.json())
  console.log('res', res)
  return res.result
}

export default function Home() {
  const [answers, updateAnswer] = useState({
    answer1: '',
    answer2: '',
    answer3: '',
  })
  const [newsletter, saveNewsletter] = useState('')

  const [renderNewsletter, switchRenderNewsletter] = useState(false)

  const router = useRouter()
  const handleClick = (e) => {
    callChatGPT(answers).then((response) => {
      saveNewsletter(response);
      switchRenderNewsletter(true)
    })
  }
  const answerQuestion = (e, q) => {
    updateAnswer({ ...answers, [q]: e.target.value })
  }
  return (
  <>
    { renderNewsletter && <Newsletter newsletter={newsletter} switchRenderNewsletter={switchRenderNewsletter} /> }
    { !renderNewsletter &&
      <>
      <Head>
        <title>Create Next App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className={styles.header}>
        <h3 style={{ cursor: 'pointer', marginLeft: '40px', color: '#333', fontSize: '24px' }}>
            Nujen
        </h3>
          <button className={styles.headerBtn} onClick={handleClick}>
            Generate Your First Newsletter Free
          </button>
        </div>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Your fave newsletter generator.
          </h1>
          <h3 className={styles.description}>
            whether it's a personal, community, or company newsletter, nujen can make it for you.
          </h3>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <button className={styles.btn} onClick={handleClick}>
              Generate Your First Newsletter Free
            </button>
            <button className={styles.btnSmall} onClick={handleClick}>
              View Demo
            </button>
          </div>
        </main>
        <div className={styles.whySection}>
          <div className={styles.whyLeft}>
              Why Nujen?
            <ul className={styles.whyNujenLi5st}>
              <li>

              </li>
              <li>

              </li>
              <li>

              </li>

            </ul>
          </div>
          <div className={styles.whyRight}>
            Image Placeholder
          </div>

        </div>
        <div className={styles.footer}>
          <div className={styles.footerText}>
            <h1 className={styles.footerTitle}>
              Ready to get started?
            </h1>
            <h3 className={styles.footerDescription}>
              Automate your newsletter creation with Nujen
            </h3>
          </div>
          <div style={{ marginLeft: 'auto'}}>
            <button className={styles.footerBtn}>
              Generate Newsletter
            </button>
          </div>
        </div>
    </>
}
</>
  )
}
