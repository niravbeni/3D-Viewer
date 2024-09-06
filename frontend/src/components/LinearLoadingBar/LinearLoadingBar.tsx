import { FC } from "react";
import { LinearLoadingBarProps } from "./LinearLoadingBar.types";
import {
  LoadingBarContainer,
  LoadingBarProgress,
} from "./LinearLoadingBar.styles";

const LinearLoadingBar: FC<LinearLoadingBarProps> = ({ isLoading }) => {
  return (
    <LoadingBarContainer>
      {isLoading && <LoadingBarProgress />}
    </LoadingBarContainer>
  );
};

export default LinearLoadingBar;
