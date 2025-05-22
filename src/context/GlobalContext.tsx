import React, { useEffect, useState } from "react"
import { UserRoleInfo } from "../types/UserRoleInfo"
import { utilService, localStorageService, apiService } from "../services"
import commonAxiosInstance from "../services/api-services/axios/common-axios-instance"
import { API_URLS } from "../constants"
import { TPATokenInput } from "../constants/constants"
import { AxiosResponse } from "axios"

interface GlobalContextProviderType {
  themeDark: boolean
  toggleTheme: () => void
  // signInModalVisible : boolean,
  // toggleSignInModal: () => void,
  visibleOffCanvas: boolean
  toggleOffCanvas: () => void
  closeOffCanvas: () => void
  header: any
  setHeader: any
  footer: any
  setFooter: any
}

const GlobalContext = React.createContext<GlobalContextProviderType>(
  {} as GlobalContextProviderType
)

const GlobalProvider = ({ children }: any) => {
  const [themeDark, setThemeDark] = useState(true)
  // const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [visibleOffCanvas, setVisibleOffCanvas] = useState(false)
  const [header, setHeader] = useState({
    theme: "dark",
    bgClass: "default",
    variant: "primary",
    align: "left",
    isFluid: false,
    reveal: true,
  })
  const [footer, setFooter] = useState({
    theme: "dark",
    style: "style1", //style1, style2
  })

  const toggleTheme = () => {
    setThemeDark(!themeDark)
  }

  const toggleOffCanvas = () => {
    setVisibleOffCanvas(!visibleOffCanvas)
  }

  const closeOffCanvas = () => {
    setVisibleOffCanvas(false)
  }

  return (
    <GlobalContext.Provider
      value={{
        themeDark,
        toggleTheme,
        visibleOffCanvas,
        toggleOffCanvas,
        closeOffCanvas,
        header,
        setHeader,
        footer,
        setFooter,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext
export { GlobalProvider }
