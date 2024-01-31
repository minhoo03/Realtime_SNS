// component/timeline.tsx
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Feed from "./feed";

// DB 구조
export interface IFeed {
  id: string;
  photo?: string; // 필수가 아니다
  feed: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [feeds, setFeed] = useState<IFeed[]>([]);
  const fetchFeeds = async () => { // 데이터 페칭
    const feedsQuery = query( // 어떤 쿼리를 원하는지
      collection(db, "feeds"), // feed 컬렉션에서 
      orderBy("createdAt", "desc") // 최신 순으로 (내림차)
    );
    // 스냅샷: 특정 시간에 저장 장치의 상태
    const spanshot = await getDocs(feedsQuery); // 해당 쿼리대로 getDocs
    const feeds = spanshot.docs.map((doc) => { // 쿼리의 스냅샷에 담긴 각 문서 출력 (각 feed)
      const { feed, createdAt, userId, username, photo } = doc.data();
      return {
        feed,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setFeed(feeds); // 얻은 데이터 객체를 setState
  };
  useEffect(() => {
    fetchFeeds(); // 페칭
  }, []);
  return (
    <Wrapper>
      {feeds.map((feed) => (
        <Feed key={feed.id} {...feed} />
      ))}
    </Wrapper>
  );
}