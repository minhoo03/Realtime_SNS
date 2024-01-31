// timeline.tsx
// 한 번 프로필 페이지로 이동하고 콘솔 확인
import {
    collection,
    onSnapshot,
    orderBy,
    query,
  } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Feed from "./feed";

import { Unsubscribe } from "firebase/auth";

// DB 구조
export interface IFeed {
  id: string;
  photo?: string; // 필수가 아니다
  feed: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  const [feeds, setFeed] = useState<IFeed[]>([]);


  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchFeeds = async () => { // 데이터 페칭
        const feedsQuery = query( // 어떤 쿼리를 원하는지
          collection(db, "feeds"), // feed 컬렉션에서 
          orderBy("createdAt", "desc") // 최신 순으로 (내림차)
        );

        // 스냅샷: 특정 시간에 저장 장치의 상태
        // onSnapshot 은 구독 취소를 반환한다.
        unsubscribe = await onSnapshot(feedsQuery, (snapshot) => {
            const feeds = snapshot.docs.map((doc) => {
                const { feed, createdAt, userId, username, photo } = doc.data();
    
                return {
                    feed,
                    createdAt,
                    userId,
                    username,
                    photo,
                    id: doc.id,
                };
            })
            setFeed(feeds); // 얻은 데이터 객체를 setState
        })
    
      };

      // 즉, onSnapshot은 실시간 스냅샷을 얻어옴과 동시에
      // 구독 취소 함수를 반환한다.

      // 이 함수에 대한 내용을 unsubscribe 변수에 저장한다.
      // 더 이상 null 아니게 된다.

      // useEffect의 특징인 '언마운트' 상태일 때
      // unsubscribe 함수가 null이 아닌 경우 실행되어 구독을 취소한다.

    fetchFeeds(); // 페칭
    return () => {
        if (unsubscribe) {
            unsubscribe()
            console.log('실행')
        }
        // unsubscribe && unsubscribe();
      };
  }, []);

  return (
    <Wrapper>
      {feeds.map((feed) => (
        <Feed key={feed.id} {...feed} />
      ))}
    </Wrapper>
  );
}