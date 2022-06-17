import React from 'react'
import type { Inputs } from '../inputs'
import type { TLBounds, TLCallbacks, TLPageState, TLShape } from '../types'
import type { TLShapeUtilsMap } from '../TLShapeUtil'

export interface TLContextType<T extends TLShape> {
  id?: string
  callbacks: Partial<TLCallbacks>
  shapeUtils: TLShapeUtilsMap<T>
  rPageState: React.MutableRefObject<TLPageState>
  rSelectionBounds: React.MutableRefObject<TLBounds | null>
  inputs: Inputs
}

export const TLContext = React.createContext({} as TLContextType<TLShape>)

export function useTLContext() {
  return React.useContext(TLContext)
}
