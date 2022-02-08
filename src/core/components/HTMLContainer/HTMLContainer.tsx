import * as React from 'react'

interface HTMLContainerProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode
}

const HTMLContainer = React.forwardRef<HTMLDivElement, HTMLContainerProps>(({ children, className = '', ...rest }, ref) => (
  <div
    className={`tl-positioned-div ${className}`}
    draggable={false}
    ref={ref}
    {...rest}
  >
    <div className="tl-inner-div">{children}</div>
  </div>
))
export default HTMLContainer
