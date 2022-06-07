import React from 'react'

interface SvgContainerProps extends React.SVGProps<SVGSVGElement> {
  id?: string,
  children: React.ReactNode
  className?: string
}

const SVGContainer = ({ id, className = '', children, ...rest }: SvgContainerProps) => (
  <svg className={`tl-positioned-svg ${className}`} {...rest}>
    <g className="tl-centered-g" id={id}>
      {children}
    </g>
  </svg>
)
export default SVGContainer
