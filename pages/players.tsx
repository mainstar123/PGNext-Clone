import Head from "next/head";
import { useRouter } from "next/router";
import players from "../src/utils/mocks/mockPlayers";
import styles from "../styles/Home.module.scss";

export default function Profiles() {
  const router = useRouter();

  const linkClickHandler = (playerId: number) => {
    router.push(`/players/${playerId}`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Players</title>
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          Click on on the player details to view the Player Highlights clips
          from Drund
        </p>

        <div className={styles.grid}>
          {players?.map((player, index) => (
            <a
              href=""
              key={index}
              className={styles.card}
              onClick={(e) => {
                e.preventDefault();
                linkClickHandler(player.id);
              }}
            >
              <>
                <h2>{player.name} &rarr;</h2>
                <p>Player Id: {player.id}.</p>
              </>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
