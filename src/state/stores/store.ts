/* eslint-disable @typescript-eslint/no-explicit-any */
import produce from 'immer'

type CBFunction = (...args: any[]) => void

// TODO: react-redux-like solution for providing services between users and stores
class Store {
  state: any = {}

  listeners: Array<CBFunction> = []

  subscribe(fn: CBFunction) {
    this.listeners.push(fn)
  }

  unsubscribe(fn: CBFunction) {
    this.listeners = this.listeners.filter(item => item !== fn)
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state))
  }

  action(fn: (...args: any[]) => any) {
    this.state = produce(this.state, fn)
    this.notify()
  }
}
export default Store
