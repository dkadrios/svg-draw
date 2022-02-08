import React from 'react'
import ReactDOM from 'react-dom'
import SvgDraw from '../SvgDraw'
import defaultPageData from './exampleState'
import './styles.css'

ReactDOM.render(
  <React.StrictMode>
    <div className="tldraw_example">
      <SvgDraw data={defaultPageData} />
    </div>
  </React.StrictMode>,
  document.getElementById('root'),
)
