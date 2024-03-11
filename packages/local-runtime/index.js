class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(name, callback) {
    if (this.event[name]) {
      this.events[name].push(callback)
    } else {
      this.events[name] = [callback]
    }
  }

  emit(name, ...args) {
    if (!this.events[name]) {
      return
    }
    this.events[name].forEach((cb) => {
      cb(...args)
    })
  }

  off(name, callback) {
    if (!this.events[name]) {
      return
    }
    if (callback) {
      this.events[name].filter((item) => item !== callback)
    } else {
      delete this.events[name]
    }
  }
}
