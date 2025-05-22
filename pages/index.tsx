import Head from "next/head"
import { useRouter } from "next/router"
import styles from "../styles/Home.module.scss"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>DK Plus Player</title>
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          <a target="_parent" href="https://www.perfectgame.org/">
            -Return to PerfectGame.org-
          </a>
        </p>
      </main>

      {/* Version number with inline style */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          fontSize: "12px",
          color: "white",
        }}
      >
        v1.0.0 20250205
      </div>
    </div>
  )
}
