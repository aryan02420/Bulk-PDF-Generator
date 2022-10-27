import { useCallback, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import Image from 'next/image'
import reactLogo from '../assets/react.svg'
import tauriLogo from '../assets/tauri.svg'
import nextLogo from '../assets/next.svg'
import { TauriEventCallback, useTauriEvent } from '../hooks/useTauriEvents'
import Counter from '../components/Counter'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')
  const [showComponent, setShowComponent] = useState(false)

  const handler = useCallback<TauriEventCallback<{ message: string }>>((e) => {
    console.log(5, e.detail.payload.message)
    setGreetMsg(e.detail.payload.message)
  }, [])

  useTauriEvent('my-event', handler)

  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  async function emit_event() {
    setGreetMsg(await invoke('emit_event'))
  }
  function toggle_component() {
    setShowComponent((b) => !b)
  }
  async function load_doc() {
    invoke('get_template_source')
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <span className="logos">
          <a href="https://nextjs.org" target="_blank">
            <Image width={144} height={144} src={nextLogo} className="logo next" alt="Next logo" />
          </a>
        </span>
        <span className="logos">
          <a href="https://tauri.app" target="_blank">
            <Image width={144} height={144} src={tauriLogo} className="logo tauri" alt="Tauri logo" />
          </a>
        </span>
        <span className="logos">
          <a href="https://reactjs.org" target="_blank">
            <Image width={144} height={144} src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </span>
      </div>

      <p>Click on the Tauri, Next, and React logos to learn more.</p>

      <div className="row">
        <div>
          <input id="greet-input" onChange={(e) => setName(e.currentTarget.value)} placeholder="Enter a name..." />
          <button type="button" onClick={() => load_doc()}>
            load
          </button>
        </div>
      </div>
      <div className="row">
        <Counter></Counter>
        <button type="button" onClick={() => toggle_component()}>
          toggle
        </button>
        <button type="button" onClick={() => emit_event()}>
          emit
        </button>
        {showComponent && <Counter></Counter>}
      </div>

      <p dangerouslySetInnerHTML={{ __html: greetMsg }}></p>
    </div>
  )
}

export default App
