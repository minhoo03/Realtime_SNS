// post-write-form
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
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

export default function PostWriteForm() {
  const [isLoading, setLoading] = useState(false);
  const [feed, setFeed] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeed(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    // 폼 입력 데이터가 있는 경우 (조건 적합)
    if (!user || isLoading || feed === "" || feed.length > 180) return;
    try {
      setLoading(true);
      // firebase SDK의 addDoc: 새로운 Document 생성
      // db 인스턴스, feeds 콜렉션, [추가할 데이터]
      const doc = await addDoc(collection(db, "feeds"), {
        feed,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });

      // 파일 유무
      if (file) {
        // 한글이 들어갈 것 방지. 경로 변경
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        // const locationRef = ref( // 업로드 된 파일이 저장되는 폴더 명과 파일 명 지정
        //   storage, // 인스턴스
        //   `feeds/${user.uid}-${user.displayName}/${doc.id}` // feeds폴더/유저폴더/파일명
        // );
        const result = await uploadBytes(locationRef, file); // 어떤 파일을 어디에 저장할 것인지 // promise 반환 -> 업로드 결과에 대한 참조가 있다
        const url = await getDownloadURL(result.ref); // 업로드한 이미지 URL 
        await updateDoc(doc, { // 생성한 doc에 photo 업데이트
          photo: url,
        });
      }
      // 리셋
      setFeed(""); 
      setFile(null);

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required // 빈 값 허용하지 않음
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={feed}
        placeholder="What is happening?!"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Feed"}
      />
    </Form>
  );
}