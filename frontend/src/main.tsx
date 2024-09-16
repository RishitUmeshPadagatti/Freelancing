import App from './App.tsx'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n.ts'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot> {/* For recoild */}
      <BrowserRouter> {/* For react-router-dom */}
        <I18nextProvider i18n={i18n}> {/* For i18n */}
          <App /> 
        </I18nextProvider>
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>,
)
