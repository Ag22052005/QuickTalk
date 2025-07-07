import { createContext, useContext, useState } from "react";

export const TabSwitchContext = createContext({
  currentTab: "sidebar",
  setCurrentTab: () => {},
});

export const useTabSwitchContext = () => {
  const context = useContext(TabSwitchContext);
  if (!context) {
    throw new Error(
      "useTabSwitchContext must be used within an TabSwitchContextProvider"
    );
  }
  return context;
};
const TabSwitchContextProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState("sidebar");
  return (
    <TabSwitchContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabSwitchContext.Provider>
  );
};
export default TabSwitchContextProvider;
