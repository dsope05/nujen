import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react';
import Newsletter from './newsletter';
import { Analytics } from '@vercel/analytics/react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Button from '@mui/material/Button';
import { typographyClasses } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

const callChatGPT = async (answers) => {
  const res = await fetch('/api/completion', {
    method: 'POST',
    body: JSON.stringify({ answers })
  }).then(res => res.json())
  return res.result
}

export default function Home() {
  const [answers, updateAnswer] = useState({
    answer1: '',
    answer2: '',
    answer3: '',
  })
  const router = useRouter()
  const handleClick = (e) => {
    router.push('sign-up')
  }
  const answerQuestion = (e, q) => {
    updateAnswer({ ...answers, [q]: e.target.value })
  }
  return (
  <>
      <Head>
        <title>Create Next App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Analytics />
        <div className={styles.header}>
        <h3 style={{ cursor: 'pointer', marginLeft: '40px', color: '#333', fontSize: '24px' }}>
            Nujen
        </h3>
          <Button variant="outlined" sx={{
             marginRight: '20px',
             marginLeft: 'auto',
             color: '#333',
             padding: '10px',
             border: '1px solid #333',
           }
          } onClick={handleClick}>
            Generate Your First Free Newsletter
          </Button>
        </div>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Your fave newsletter generator.
          </h1>
          <h3 className={styles.description}>
            { "Whether it's a personal, community, or company newsletter, nujen can make it for you."}
          </h3>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <Button variant="contained" sx={{
              backgroundColor: 'green',
              color: 'white',
              marginTop: '10px',
            }} onClick={handleClick}>
              Generate Your First Free Newsletter
            </Button>
            <Button variant="text" sx={{
                 marginTop: '10px',
                 padding: '12px',
            }}>
              <a 
                href="https://www.loom.com/share/edadf0c9dc4a46a5a05378b60950d27e"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none', color: '#333' }}
              >
                View Demo
              </a>
            </Button>
          </div>
        </main>
          <div className={styles.whySection}>
            <div className={styles.whyLeft}>
                Why <span className={styles.green}> Nujen? </span>
              <ul className={styles.whyNujenList}>
                <li className={styles.bulletList}>
                  Save time
                  <p className={styles.bulletDesc}>
                    Cut your newsletter writing time by 90%.
                  </p>
                </li>
                <li className={styles.bulletList}>
               Customize
                  <p className={styles.bulletDesc}>
                    Create a newsletter that aligns with your brand identity and voice.
                  </p>
                </li>
                <li className={styles.bulletList}>
                Build Community
                  <p className={styles.bulletDesc}>
                    Send newsletters worth opening, reading & engaging with, and contributing to.
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
                    padding: '10px',
                  }}
                  className={styles.viewNewsletterBtn}
                >
                  <a
                    href="https://www.canva.com/design/DAFWAjyKI90/_5d2RsYq0aunDcz7yidgdg/view?website#4"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none', color: '#333' }}
                  >
                    View Sample Newsletter
                  </a>
                </Button>
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
            <Button variant="contained" onClick={handleClick} sx={{
                backgroundColor: 'green',
                padding: '10px',
                color: 'white',
                marginTop: '10px',
                }}>
              Generate Your First Free Newsletter
            </Button>
          </div>
        </div>
</>
  )
}
