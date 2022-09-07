import type { NextPage } from 'next';
import Head from 'next/head';
import SwimlanesContainer from '../containers/SwimlanesContainer';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Kanban Board</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className={styles.main}>
        <SwimlanesContainer />
      </main>
    </div>
  );
};

export default Home;
