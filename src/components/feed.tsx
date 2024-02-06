import { styled } from "styled-components";
import { IFeed } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Feed({ username, photo, feed, userId, id }: IFeed) {
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("선택한 피드를 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "feeds", id)); // feeds DB의 id에 맞는 Document 제거
      if (photo) {
        const photoRef = ref(storage, `feeds/${user.uid}/${id}`); // photo가 존재하는 경우
        await deleteObject(photoRef); // 경로의 파일 제거
      }
    } catch (e) {
      console.log(e);
    } finally {
      // setToast
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{feed}</Payload>
        {user?.uid === userId ? ( // 작성자만 삭제 버튼이 보이도록
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}