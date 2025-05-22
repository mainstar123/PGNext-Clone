import React, { useContext, useRef } from "react"
import styled, { ThemeProvider } from "styled-components"
// import AOS from "aos";
import { get, merge } from "lodash"
import Head from "next/head"
import Script from "next/script"

// import Header from "../Header";
// import Footer from "../Footer";
import GlobalContext from "../../context/GlobalContext"
import GlobalStyle from "../../utils/globalStyle"
// the full theme object
import { theme as baseTheme } from "../../utils"

const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 9999999999;
  opacity: 1;
  visibility: visible;
  transition: all 1s ease-out 0.5s;
  &.inActive {
    opacity: 0;
    visibility: hidden;
  }
`

// options for different color modes
const modes = { light: "light", dark: "dark" }

// merge the color mode with the base theme
// to create a new theme object
const getTheme = (mode: string) =>
  merge({}, baseTheme, {
    colors: get(baseTheme.colors.modes, mode, baseTheme.colors),
  })

const Layout = ({ children, pageContext }: any) => {
  const gContext = useContext(GlobalContext)

  const eleRef: any = useRef()

  return (
    <>
      <ThemeProvider
        theme={
          gContext.themeDark ? getTheme(modes.dark) : getTheme(modes.light)
        }
      >
        <div data-theme-mode-panel-active data-theme="light">
          <GlobalStyle />
          <div className="site-wrapper overflow-hidden" ref={eleRef}>
            <div className="main-container pt-1">{children}</div>
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}

export default Layout
