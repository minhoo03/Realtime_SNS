import { styled } from "styled-components";
import { IFeed } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

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

const UpdateButton = styled.button`
  background-color: #015bd6;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Form = styled.form`
display: flex;
flex-direction: column;
gap: 10px;
`;

const TextArea = styled.textarea`
  border: 1px solid #e1e1e1;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const CancelBtn = styled.div`
  width: 100%;
  text-align: right;
  cursor: pointer;
`



export default function Feed({ username, photo, feed, userId, id }: IFeed) {

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [feedText, setFeedText] = useState("");
  const [isLoading, setLoading] = useState(false);

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

  const handleChangeUpdateState = () => {
    setIsUpdating(prev => !prev)
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedText(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    // 폼 입력 데이터가 있는 경우 (조건 적합)
    if (!user || isLoading || feed === "" || feed.length > 180) return;
    try {
      setLoading(true);
      await updateDoc(doc(db, "feeds", id), {
        feed: feedText,
        userId: user.uid,
      });

      // 리셋
      setFeedText(""); 
      handleChangeUpdateState()

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>

        {
          isUpdating ?
            <Form onSubmit={onSubmit}>
              <TextArea
                required // 빈 값 허용하지 않음
                rows={5}
                maxLength={180}
                onChange={onChange}
                value={feedText}
                placeholder="What is happening?!"
              />
              <SubmitBtn
                type="submit"
                value={isLoading ? "Updating..." : "Update Feed"}
              />
              <CancelBtn onClick={handleChangeUpdateState}>취소</CancelBtn>
            </Form>
            :
           <Payload>{feed}</Payload>
        }
        
        {user?.uid === userId && !isUpdating ? ( // 작성자만 삭제 버튼이 보이도록
          <div style={{display: "flex", gap: 4}}>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            <UpdateButton onClick={handleChangeUpdateState}>Update</UpdateButton>
          </div>
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