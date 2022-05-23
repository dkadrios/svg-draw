/* eslint-disable @typescript-eslint/no-explicit-any */
import produce from 'immer'

type CBFunction<T> = (state: T) => void

// TODO: react-redux-like solution for providing services between users and stores
class Store<T extends object> {
  state: T = {} as T

  listeners: Array<CBFunction<T>> = []

  subscribe(fn: CBFunction<T>) {
    this.listeners.push(fn)
  }

  unsubscribe(fn: CBFunction<T>) {
    this.listeners = this.listeners.filter(item => item !== fn)
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state))
  }

  action(fn: (draft: T) => void) {
    this.state = produce(this.state, fn)
    this.notify()
  }
}
export default Store
