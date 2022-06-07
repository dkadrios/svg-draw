import React, { HTMLProps } from 'react'
import type { TLBounds } from 'core/types'
import { usePosition } from 'core/hooks'

interface ContainerProps extends HTMLProps<HTMLDivElement> {
  id?: string
  bounds: TLBounds
  rotation?: number
  isGhost?: boolean
  isSelected?: boolean
  children: React.ReactNode
}

const Container = ({
  id,
  bounds,
  rotation = 0,
  isGhost = false,
  isSelected = false,
  children,
  ...props
}: ContainerProps) => {
  const rPositioned = usePosition(bounds, rotation)

  return (
    <div
      aria-label="container"
      className={`tl-positioned${isGhost ? ' tl-ghost' : ''}${
        isSelected ? ' tl-positioned-selected' : ''
      }`}
      id={id}
      ref={rPositioned}
      {...props}
    >
      {children}
    </div>
  )
}
export default Container
