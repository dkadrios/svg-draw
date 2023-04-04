import './wdyr'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import type { TDDocument } from 'types'
import SvgDraw from '../SvgDraw'
import defaultPageData from './exampleState'
import './styles.css'

const SvgDrawExample = () => {
  const [doc, setDoc] = useState({ page: defaultPageData } as TDDocument)
  const onInteract = (d: TDDocument) => {
    setDoc(d)
  }

  return (
    <SvgDraw data={doc} onChange={onInteract} />
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') || document.body)
root.render((
  <React.StrictMode>
    <div className="tldraw_example">
      <SvgDrawExample />
    </div>
  </React.StrictMode>
))
