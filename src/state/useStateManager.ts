import React from 'react'
import StateManager from './index'

export const StateManagerContext = React.createContext<StateManager>({} as StateManager)

export const useStateManager = () => React.useContext(StateManagerContext)
