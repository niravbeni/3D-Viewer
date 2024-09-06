import { FC, useState, FormEvent } from "react";
import { API_URL } from "../../constants/api";
import ThreeDViewer from "../ThreeDViewer/ThreeDViewer";

import {
  Container,
  Title,
  Form,
  Input,
  Button,
  DebugModeLabel,
  Checkbox,
  ErrorLabel,
  ImageContainer,
  ImageTitle,
  Image,
  ImagesContainer,
  InputButtonContainer,
  DisplayContainer,
} from "./ImageGenerator.styles";
import { GeneratedImages } from "./ImageGenerator.types";
import LinearLoadingBar from "../LinearLoadingBar/LinearLoadingBar";

const ImageGenerator: FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugMode, setDebugMode] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [generatedDepthMapUrl, setGeneratedDepthMapUrl] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setGeneratedDepthMapUrl("");
    setGeneratedImageUrl("");

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeneratedImages = await response.json();

      if (data.image && data.depth_map) {
        setGeneratedImageUrl(`data:image/png;base64,${data.image}`);
        setGeneratedDepthMapUrl(`data:image/png;base64,${data.depth_map}`);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const imagesAvailable =
    generatedImageUrl !== "" && generatedDepthMapUrl !== "";

  return (
    <Container>
      <Title>3D Image Viewer</Title>
      <Form onSubmit={handleSubmit}>
        <InputButtonContainer>
          <Input
            type="text"
            placeholder="Enter an image prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </InputButtonContainer>
        <LinearLoadingBar isLoading={isLoading} />
      </Form>
      {imagesAvailable && (
        <DebugModeLabel>
          <Checkbox
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
          />
          Debug
        </DebugModeLabel>
      )}

      {error && <ErrorLabel>{error}</ErrorLabel>}

      <DisplayContainer>
        {debugMode && imagesAvailable && (
          <ImagesContainer>
            <ImageContainer>
              <ImageTitle>Generated Image</ImageTitle>
              <Image src={generatedImageUrl} alt="Generated Image" />
            </ImageContainer>
            <ImageContainer>
              <ImageTitle>Generated Depth Map</ImageTitle>
              <Image src={generatedDepthMapUrl} alt="Generated Depth Map" />
            </ImageContainer>
          </ImagesContainer>
        )}

        {imagesAvailable && (
          <ThreeDViewer
            key={debugMode ? "debug" : "normal"}
            imageUrl={generatedImageUrl}
            depthMapUrl={generatedDepthMapUrl}
            zPosition={5}
          />
        )}
      </DisplayContainer>
    </Container>
  );
};

export default ImageGenerator;
