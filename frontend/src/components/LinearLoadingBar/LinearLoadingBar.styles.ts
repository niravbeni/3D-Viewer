import styled from "styled-components";
import { keyframes } from "styled-components";

const loadingAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;
export const LoadingBarContainer = styled.div`
  width: 100%;
  height: 5px;
  margin-top: 10px;
  overflow: hidden;
`;

export const LoadingBarProgress = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 2.5px;
  background-color: #8ae3ae;
  animation: ${loadingAnimation} 2s infinite;
  transition: all 0.5s ease-out;
`;
