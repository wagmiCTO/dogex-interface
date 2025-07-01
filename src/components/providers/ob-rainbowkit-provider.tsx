'use client'

import type React from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import {
  darkTheme,
  RainbowKitProvider,
  type Theme,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const theme: Theme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    closeButton: 'white',
    closeButtonBackground: 'transparent',
    modalBackdrop: 'rgba(0, 0, 0, 0.8)',
    modalBackground: '#141414',
    modalBorder: '#141414',
    modalTextSecondary: '#787878',
    profileAction: 'transparent',
  },
  radii: {
    ...darkTheme().radii,
    actionButton: '8px',
    connectButton: '8px',
    menuButton: '8px',
    modal: '8px',
    modalMobile: '8px',
  },
  fonts: {
    ...darkTheme().fonts,
    body: 'Rubik, sans-serif',
  },
}

const ObRainbowKitProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RainbowKitProvider theme={theme} modalSize="compact">
      {children}
    </RainbowKitProvider>
  )
}

export default ObRainbowKitProvider
