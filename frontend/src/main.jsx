import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/opendyslexic'
import './styles/theme.css'
import './index.css'
import App from './App.jsx'

// Aplica el modo dislexia antes de que React renderice para evitar flash
if (localStorage.getItem('lumi-dyslexia') === 'true') {
  document.body.classList.add('dyslexia')
}

// Inyecta filtros SVG de daltonismo y aplica el modo guardado sin flash
;(function () {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none')
  svg.setAttribute('aria-hidden', 'true')
  svg.innerHTML = `<defs>
    <filter id="deuteranopia-filter">
      <feColorMatrix type="matrix"
        values="0.625 0.375 0     0 0
                0.700 0.300 0     0 0
                0     0.300 0.700 0 0
                0     0     0     1 0"/>
    </filter>
  </defs>`
  document.body.appendChild(svg)

  const mode = localStorage.getItem('lumi-daltonismo')
  if (mode && mode !== 'off') {
    document.documentElement.classList.add(`daltonismo-${mode}`)
  }
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
