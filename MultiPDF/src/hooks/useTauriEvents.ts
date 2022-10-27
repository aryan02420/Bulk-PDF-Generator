import { useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { publish, subscribe, unsubscribe } from '../utils/events'

import type { Event, EventCallback, EventName } from '@tauri-apps/api/event'

export type TauriEvent<T> = CustomEvent<Event<T>>
export type TauriEventCallback<T> = (e: CustomEvent<Event<T>>) => void

const dispatcher: EventCallback<unknown> = (event) => {
  publish(`tauri:${event.event}`, event)
}

export async function publishTauriEvents(events: EventName[]) {
  const unlisteners = []
  for (const event of events) {
    unlisteners.push(await listen(event, dispatcher))
  }
  return unlisteners
}

export function useTauriEvent<T>(event: EventName, cb: TauriEventCallback<T>) {
  useEffect(() => {
    subscribe(`tauri:${event}`, cb)
    return () => {
      unsubscribe(`tauri:${event}`, cb)
    }
  }, [])
}
