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
      <div class="text">A cloud-based AI learning platform</div>
      <br />
      <br />
      <div class="bundle glow-on-hover">
        <p class="tip">Explore our offline bundles for enhanced learning experiences.</p>
        <br />

        <div class="actions">
          <div class="action">
            <a target="_blank" rel="noreferrer" onClick={ipcScratchHandle}>
              Explore <span class="apps">Scratch</span>
            </a>
          </div>
          <div class="action">
            <a target="_blank" rel="noreferrer" onClick={ipcVisualCodeHandle}>
              Dive into <span class="apps"> Visual Code</span>
            </a>
          </div>
          <div class="action">
            <a target="_blank" rel="noreferrer" onClick={ipcPythonIdeHandle}>
              Experience <span class="apps">Python IDE</span>
            </a>
          </div>
        </div>
      </div>
      <Versions />
    </>
  )
}

export default App
