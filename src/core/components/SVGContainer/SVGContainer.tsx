import * as React from 'react'

interface SvgContainerProps extends React.SVGProps<SVGSVGElement> {
  id?: string,
  children: React.ReactNode
  className?: string
}

const SVGContainer = React.forwardRef<SVGSVGElement, SvgContainerProps>(({ id, className = '', children, ...rest }: SvgContainerProps, ref) => (
  <svg className={`tl-positioned-svg ${className}`} ref={ref} {...rest}>
    <g className="tl-centered-g" id={id}>
      {children}
    </g>
  </svg>
))
export default SVGContainer
