// routes/Home.tsx

import { styled } from "styled-components";
import PostWriteForm from "../components/post-write-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;
// 피드 작성 양식은 고정되어 있으며, 피드들을 스크롤 할 수 있도록

export default function Home() {
  return (
    <Wrapper>
      <PostWriteForm />
      <Timeline />
    </Wrapper>
  );
}