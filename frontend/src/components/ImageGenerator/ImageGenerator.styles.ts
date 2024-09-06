import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  font-family: Arial, sans-serif;
`;

export const DisplayContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 40px;
  color: #333;
`;

export const Form = styled.form`
  margin-bottom: 20px;
`;

export const InputButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  height: 60px;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  flex-grow: 1;
  min-width: 400px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 20px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #cf6794;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    background-color: #cc417d;
  }

  &:disabled {
    background-color: #8ae3ae;
    cursor: not-allowed;
  }
`;

export const DebugModeLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
`;

export const Checkbox = styled.input`
  margin-right: 10px;
  cursor: pointer;
`;

export const ErrorLabel = styled.p`
  color: red;
  margin-bottom: 20px;
`;

export const ImagesContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: space-between;
`;

export const ImageContainer = styled.div`
  margin-bottom: 20px;
`;

export const ImageTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #444;
`;

export const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
