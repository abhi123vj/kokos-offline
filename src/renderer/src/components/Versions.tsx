import { type Component } from 'solid-js'

const Versions: Component = () => {
  // const [versions] = createSignal(window.electron.process.versions)

  return (
    <ul class="versions">
      <li class="electron-version">Cloud-based AI learning platform</li>
      <li class="chrome-version">AI/Robotics Lab</li>
      <li class="node-version">Textbooks aligned with global standards</li>
    </ul>
  )
}

export default Versions
