import styles from "../styles/sign-up.module.css";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const goBack = () => {
    router.push('/');
  };
  return (
    <div className={styles.header}>
      <h3
        onClick={goBack}
        style={{
          cursor: "pointer",
          marginLeft: "40px",
          color: "white",
          fontSize: "24px",
        }}
      >
        nujen
      </h3>
    </div>
  );
};

export default Header;