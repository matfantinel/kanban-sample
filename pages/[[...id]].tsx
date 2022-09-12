import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { resetServerContext } from 'react-beautiful-dnd';
import SwimlanesContainer from '../containers/SwimlanesContainer';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className={styles.container}>
      <Head>
        <title>Kanban Board</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>

      <main className={styles.main}>
        <SwimlanesContainer taskId={id ? parseInt(id as string) : undefined} />
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  resetServerContext();
  return { props: {} };
}

export default Home;
