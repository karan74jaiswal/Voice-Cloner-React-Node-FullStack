import { createContext, useContext, useState } from "react";

const VoiceContext = createContext({
  text: "",
  inputVoice: null,
  outputVoice: null,
  isLoading: false,
});

function VoiceProvider({ children }) {
  const [text, setText] = useState("");
  const [inputVoice, setInputVoice] = useState(null);
  const [outputVoice, setOutputVoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <VoiceContext.Provider
      value={{
        text,
        setText,
        inputVoice,
        setInputVoice,
        outputVoice,
        setOutputVoice,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

function useVoiceContext() {
  const {
    text,
    setText,
    inputVoice,
    setInputVoice,
    outputVoice,
    setOutputVoice,
    isLoading,
    setIsLoading,
  } = useContext(VoiceContext);
  return {
    text,
    setText,
    inputVoice,
    setInputVoice,
    outputVoice,
    setOutputVoice,
    isLoading,
    setIsLoading,
  };
}

export { VoiceProvider, useVoiceContext };
