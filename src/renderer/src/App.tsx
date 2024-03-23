import type { Component } from 'solid-js'
import Versions from './components/Versions'
import electronLogo from './assets/kokoslogo.png'

const App: Component = () => {
  const ipcVisualCodeHandle = (): void => window.electron.ipcRenderer.send('VisualCode')
  const ipcScratchHandle = (): void => window.electron.ipcRenderer.send('Scratch')

  return (
    <>
      <img alt="logo" class="logo" src={electronLogo} />
      <div class="creator">Powered by electron-vite</div>
      <div class="text">
        <span class="kokos">Kokos Ai</span> app built with <span class="solid">Solid</span>
        &nbsp;and <span class="ts">TypeScript</span>
      </div>
      <p class="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div class="actions">
        <div class="action">
          <a target="_blank" rel="noreferrer" onClick={ipcScratchHandle}>
            Scratch
          </a>
        </div>
        <div class="action">
          <a target="_blank" rel="noreferrer" onClick={ipcVisualCodeHandle}>
            Visual Code
          </a>
        </div>
      </div>
      <Versions />
    </>
  )
}

export default App
