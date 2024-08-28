// pages/index.tsx

import React from 'react';
import Head from 'next/head';
import TaskBoard from '@/components/taskBoard';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Task Board</title>
        <meta name="description" content="Task Board Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <TaskBoard />
      </main>
    </>
  );
}
