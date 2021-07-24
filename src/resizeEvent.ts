type Handler = (...args: any[]) => any
type ListenerHandler = (element: Element, fn: Handler) => void

// interface IResizeEvent {
//   addResizeListener: (element: Element, fn: Handler) => void
//   removeResizeListener: (element: Element, fn: Handler) => void
// }

interface IMapValue {
  ob: ResizeObserver
  handlers: Handler[]
}

export default class ResizeEvent {
  // private isIE : boolean
  private observerMap: Map<Element, IMapValue> = new Map()

  private resizeHandler: ResizeObserverCallback = entries => {
    for (let entry of entries) {
      const listeners = this.observerMap.get(entry.target)?.handlers || []
      if (listeners.length) {
        listeners.forEach(fn => {
          fn()
        })
      }
    }
  }

  readonly addResizeListener: ListenerHandler = (el, fn) => {
    if (!this.observerMap.has(el)) {
      this.observerMap.set(el, {
        ob: new ResizeObserver(this.resizeHandler),
        handlers: [fn],
      })
      this.observerMap.get(el)?.ob.observe(el)
    } else {
      this.observerMap.get(el)?.handlers.push(fn)
    }
  }
  readonly removeResizeListener: ListenerHandler = (el, fn) => {
    if (!el || !this.observerMap.has(el)) return
    const { handlers, ob } = this.observerMap.get(el)!
    handlers.splice(handlers.indexOf(fn), 1)
    if (!handlers.length) {
      ob.disconnect()
    }
  }
}
