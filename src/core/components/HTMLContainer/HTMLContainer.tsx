import * as React from 'react'

interface HTMLContainerProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode
}

const HTMLContainer = ({ children, className = '', ...rest }: HTMLContainerProps) => (
  <div
    className={`tl-positioned-div ${className}`}
    draggable={false}
    {...rest}
  >
    <div className="tl-inner-div">{children}</div>
  </div>
)
export default HTMLContainer
