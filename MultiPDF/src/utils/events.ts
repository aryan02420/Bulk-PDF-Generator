type CustomEventName = string
type CustomEventCallback<T extends any[] = any> = (...args: T) => void

export function subscribe(event: CustomEventName, cb: CustomEventCallback) {
  document.addEventListener(event, cb)
}

export function unsubscribe(event: CustomEventName, cb: CustomEventCallback) {
  document.removeEventListener(event, cb)
}

export function once(event: CustomEventName, cb: CustomEventCallback) {
  const handleOnce: typeof cb = (...args) => {
    unsubscribe(event, handleOnce)
    cb(...args)
  }
  subscribe(event, handleOnce)
}

export function publish(event: CustomEventName, detail: Object) {
  document.dispatchEvent(new CustomEvent(event, { detail }))
}
