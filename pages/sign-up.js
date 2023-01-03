import { useState } from 'react';
import styles from '../styles/sign-up.module.css'
import StepWizard from "react-step-wizard";
import dynamic from 'next/dynamic'
import Stepper from './form-wizard/stepper';
import { useRouter } from 'next/router'

export default function Signup() {
    const router = useRouter();
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
        <div className={styles.main}>
          <Stepper />
        </div>
      </>
    )

}