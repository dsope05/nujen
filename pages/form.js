import { useState, useContext, useEffect } from "react";
import styles from "../styles/sign-up.module.css";
import StepWizard from "react-step-wizard";
import dynamic from "next/dynamic";
import Stepper from "../components/form-wizard/stepper";
import { useRouter } from "next/router";
import { UserContext } from "../magic/UserContext";

export default function Signup() {
  const [user, setUser] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    !user?.issuer && router.push('/login');
  })
  
  const goBack = () => {
    router.push("/");
  };
  return (
    <>
      { user?.issuer && (
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
          nujen
        </h3>
      </div>
      <div className={styles.main}>
        <Stepper />
      </div>
      </>
      )}
    </>
  );
}
