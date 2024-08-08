"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Word {
  english: string;
  japanese: string;
}

const fetchWords = async (): Promise<Word[]> => {
  const response = await fetch('/api/words');
  const data = await response.json();
  return data;
};

const Home = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [page, setPage] = useState(0);
  const [animation, setAnimation] = useState('');
  const [tempWord, setTempWord] = useState<Word | null>(null);

  useEffect(() => {
    const loadWords = async () => {
      const words = await fetchWords();
      const shuffledWords = words.sort(() => Math.random() - 0.5);
      setWords(shuffledWords);
    };
    loadWords();
  }, []);

  const handlePreviousPage = () => {
    setTempWord(words[page === 0 ? words.length - 1 : page - 1]);
    setAnimation(styles.flipLeft);
    setTimeout(() => {
      setPage(page === 0 ? words.length - 1 : page - 1);
      setAnimation('');
      setTempWord(null);
    }, 600);
  };

  const handleNextPage = () => {
    setTempWord(words[page === words.length - 1 ? 0 : page + 1]);
    setAnimation(styles.flipRight);
    setTimeout(() => {
      setPage(page === words.length - 1 ? 0 : page + 1);
      setAnimation('');
      setTempWord(null);
    }, 600);
  };

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>マイ英単語帳</h1>
      <div className={styles.cardContainer}>
        <div
          onClick={handlePreviousPage}
          className={`${styles.card} ${animation === styles.flipLeft ? styles.flipLeft : ''}`}
          style={animation === styles.flipLeft ? { zIndex: 2 } : { zIndex: 1 }}
        >
          <div className={animation === styles.flipLeft ? styles.cardInner : styles.cardInnerFixed}>
            <div className={styles.cardFace}>
              <div className={styles.word}>{words[page].english}</div>
            </div>
            <div className={`${styles.cardFace} ${styles.cardBack}`}>
              <div className={styles.word}>{tempWord ? tempWord.japanese : ''}</div>
            </div>
          </div>
        </div>
        <div className={`${styles.hiddenCard} ${styles.hiddenCardLeft}`}>
          <div className={styles.word}>{animation === styles.flipLeft && tempWord ? tempWord.english : words[page].english}</div>
        </div>
        <div
          onClick={handleNextPage}
          className={`${styles.card} ${animation === styles.flipRight ? styles.flipRight : ''}`}
          style={animation === styles.flipRight ? { zIndex: 2 } : { zIndex: 1 }}
        >
          <div className={animation === styles.flipRight ? styles.cardInner : styles.cardInnerFixed}>
            <div className={styles.cardFace}>
              <div className={styles.word}>{words[page].japanese}</div>
            </div>
            <div className={`${styles.cardFace} ${styles.cardBack}`}>
              <div className={styles.word}>{tempWord ? tempWord.english : ''}</div>
            </div>
          </div>
        </div>
        <div className={`${styles.hiddenCard} ${styles.hiddenCardRight}`}>
          <div className={styles.word}>{animation === styles.flipRight && tempWord ? tempWord.japanese : words[page].japanese}</div>
        </div>
      </div>
      <div className={styles.pageInfo}>
        Word {page + 1} / {words.length}
      </div>
    </div >
  );
};

export default Home;