// GroupContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface GroupContextType {
  groupID: string;
  setGroupID: (id: string) => void;
}


const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return context;
};


export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [groupID, setGroupID] = useState<string>("");

  return (
    <GroupContext.Provider value={{ groupID, setGroupID }}>
      {children}
    </GroupContext.Provider>
  );
};
