import { useState } from 'react';
import styles from '../styles/sign-up.module.css'
import ReCAPTCHA from "react-google-recaptcha";
 
function onChange(value, captchaIsPassed) {
  if (value) {
    captchaIsPassed(true)
  }
}
 
export default function Signup() {
    const [pass, captchaIsPassed] = useState(false);
    let form;
    if (process.env.ENV === 'dev') {
        form = (
                <iframe
                    className="airtable-embed"
                    src="https://airtable.com/embed/shrXf1WSDbKrqsw02?backgroundColor=cyan"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    style={{ background: 'transparent', border: '1px solid #ccc' }}
                >
                </iframe>
        )
    } else if (process.env.ENV === 'prod' && !pass) {
        form = (
                <ReCAPTCHA
                    sitekey={process.env.SITE_KEY}
                    onChange={(value) => onChange(value, captchaIsPassed)}
                />
        )
    } else if (process.env.ENV === 'prod' && pass) {
        form = (
                <iframe
                    className="airtable-embed"
                    src="https://airtable.com/embed/shrXf1WSDbKrqsw02?backgroundColor=cyan"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    style={{ background: 'transparent', border: '1px solid #ccc' }}
                >
                </iframe>
        )
    }
    
    return (
        <div className={styles.main}>
            { form }
        </div>
    )

}