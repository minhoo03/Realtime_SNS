import { styled } from "styled-components";
import PostWriteForm from "../components/post-write-form";

const Wrapper = styled.div``;

export default function Home() {
  return (
    <Wrapper>
      <PostWriteForm />
    </Wrapper>
  );
}