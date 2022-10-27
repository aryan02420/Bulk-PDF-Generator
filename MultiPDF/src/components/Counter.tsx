import { useCallback, useState } from 'react'
import { TauriEventCallback, useTauriEvent } from '../hooks/useTauriEvents'

function Counter() {
  const [count, setCount] = useState(0)

  const handler = useCallback<TauriEventCallback<{ message: string }>>((e) => {
    setCount(c => c + 1)
  }, [])

  useTauriEvent('click-event', handler)

  return <div>{count}</div>
}

export default Counter
