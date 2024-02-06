import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { IFeed } from "../components/timeline";
import Feed from "../components/feed";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const Feeds = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL); // 로그인된 유저의 사진 URL을 초기값으로
  const [feeds, setFeeds] = useState<IFeed[]>([]);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 파일 탐색기에서 얻어온 file
    const { files } = e.target;

    // 로그인 상태가 아닌 경우
    if (!user) return;

    // 업로드 된 파일이 있는 경우
    if (files && files.length === 1) {
      const file = files[0];

      // 사진이 저장될 경로 (Storage)
      const locationRef = ref(storage, `avatars/${user?.uid}`);

      // 저장
      const result = await uploadBytes(locationRef, file);

      // 이미지 URL 생성
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);

      // 유저 프로필 업데이트 (auth)
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const fetchFeeds = async () => {
    const feedQuery = query( 
      collection(db, "feeds"), // feeds DB
      where("userId", "==", user?.uid), // 현재 로그인한 계정의 uid와 같은
      orderBy("createdAt", "desc"),
      limit(25)
    );

    const snapshot = await getDocs(feedQuery); // 쿼리대로 DB 조회
    const feeds = snapshot.docs.map((doc) => { // 조회한 결과 재정의
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
    setFeeds(feeds);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "Anonymous"}</Name>

      <Feeds>
        {feeds.map((feed) => (
          <Feed key={feed.id} {...feed} />
        ))}
      </Feeds>
    </Wrapper>
  );
}