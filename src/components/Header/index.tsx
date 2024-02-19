import styles from "./index.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div>
        <img src={"mascot.svg"} className={styles.logo} />
        <h1 className={styles.title}>Video Transcription</h1>
      </div>
    </header>
  );
};

export default Header;
