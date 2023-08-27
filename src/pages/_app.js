import '../styles/globals.css';
import React, { createContext, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

const GlobalSate = createContext()
export { GlobalSate };

export default function App({ Component, pageProps }) {
  const [selectedData, setSelectedData] = useState('')

  const state = {
    setSelectedData,
    selectedData
  }

  return (
    <GlobalSate.Provider value={state}>
      <Component {...pageProps} />
    </GlobalSate.Provider>
  )
}
