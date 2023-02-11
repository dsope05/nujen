import styles from "../styles/header.module.css";
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
          color: "#452c63",
          fontSize: "24px",
        }}
      >
        nujen
      </h3>
    </div>
  );
};

export default Header;