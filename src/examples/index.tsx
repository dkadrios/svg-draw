import './wdyr'
import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import type { TDDocument } from 'types'
import SvgDraw from '../SvgDraw'
import defaultPageData from './exampleState'
import './styles.css'

const SvgDrawExample = () => {
  const [doc, setDoc] = useState({ page: defaultPageData } as TDDocument)
  const exportRef = useRef<() => TDDocument>(null)

  /*
  const onTransmit = () => {
    if (!exportRef.current) return
    const document = exportRef.current()
    setDoc(document)
  }
   */

  return (
    <SvgDraw data={doc} ref={exportRef} />
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
