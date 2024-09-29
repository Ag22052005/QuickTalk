import { createContext, useContext, useState } from "react";

export const TabSwitchContext = createContext({})

export const useTabSwitchContext =()=>{
  return useContext(TabSwitchContext)
}
const TabSwitchContextProvider = ({children})=>{
  const [currentTab,setCurrentTab] = useState('sidebar')
  return(
    <TabSwitchContext.Provider value = {{currentTab,setCurrentTab}}>
      {children}
    </TabSwitchContext.Provider>
  )
}
export default TabSwitchContextProvider