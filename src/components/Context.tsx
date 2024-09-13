import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the types for your context
interface MusicContextType {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  likedMusic: string[]; // Assuming likedMusic is an array of strings (update type as needed)
  setLikedMusic: Dispatch<SetStateAction<string[]>>;
  pinnedMusic: string[]; // Assuming pinnedMusic is an array of strings (update type as needed)
  setPinnedMusic: Dispatch<SetStateAction<string[]>>;
  resultOffset: number;
  setResultOffset: Dispatch<SetStateAction<number>>;
}

// Create a default context value (optional but useful for avoiding undefined errors)
const defaultContext: MusicContextType = {
  isLoading: false,
  setIsLoading: () => {},
  likedMusic: [],
  setLikedMusic: () => {},
  pinnedMusic: [],
  setPinnedMusic: () => {},
  resultOffset: 0,
  setResultOffset: () => {}
};

// Create the context
export const MusicContext = createContext<MusicContextType>(defaultContext);

// Define the props for the ContextProvider
interface ContextProviderProps {
  children: ReactNode;
}

// Create the context provider component
export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [likedMusic, setLikedMusic] = useState<string[]>([]);
  const [pinnedMusic, setPinnedMusic] = useState<string[]>([]);
  const [resultOffset, setResultOffset] = useState(0);

  return (
    <MusicContext.Provider
      value={{
        isLoading,
        setIsLoading,
        likedMusic,
        setLikedMusic,
        resultOffset,
        setResultOffset,
        pinnedMusic,
        setPinnedMusic,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
