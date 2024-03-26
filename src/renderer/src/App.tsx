import type { Component } from 'solid-js'
import Versions from './components/Versions'
import electronLogo from './assets/kokoslogo.png'

const App: Component = () => {
  const ipcVisualCodeHandle = (): void => window.electron.ipcRenderer.send('VisualCode')
  const ipcScratchHandle = (): void => window.electron.ipcRenderer.send('Scratch')
  const ipcPythonIdeHandle = (): void => window.electron.ipcRenderer.send('PythonIde')

  return (
    <>
      <img alt="logo" class="logo" src={electronLogo} />
      {/* <div class="creator">Powered by electron-vite</div> */}
      <div class="text">
        <span class="kokos">Kokos:</span> A cloud-based AI learning platform.
      </div>
      <p class="tip">Discover Our Offline Bundles</p>
      <div class="actions">
        <div class="action">
          <a target="_blank" rel="noreferrer" onClick={ipcScratchHandle}>
            Explore Scratch
          </a>
        </div>
        <div class="action">
          <a target="_blank" rel="noreferrer" onClick={ipcVisualCodeHandle}>
            Dive into Visual Code
          </a>
        </div>
        <div class="action">
          <a target="_blank" rel="noreferrer" onClick={ipcPythonIdeHandle}>
            Experience Python IDE
          </a>
        </div>
      </div>
      <Versions />
    </>
  )
}

export default App
