/* eslint-disable no-unused-expressions */
import * as React from 'react'
import ReactDOM from 'react-dom'
import styled, { StyleSheetManager } from 'styled-components'
import { ISandboxProps } from './typings'
import { useEffect, useRef, useState } from 'react'

const getDefaultSrcDoc = (head = '', body = '') => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>PageFly Sandbox</title>
${head}
</head>
<body>${body}</body>
</html>`

function Sandbox(props: ISandboxProps) {
  const { style, disableVendorPrefixes, children, getRef, head, body } = props
  const [doc, setDoc] = React.useState<Document | null>(null)
  const frame = React.useRef<HTMLIFrameElement>(null)
  const handleIframeLoad = () => {
    setDoc(frame.current?.contentDocument ?? null)
  }
  React.useEffect(() => {
    const currentFrame = frame.current
    currentFrame?.addEventListener('load', handleIframeLoad, true)
    getRef && getRef(frame)
    return () => {
      currentFrame?.removeEventListener('load', handleIframeLoad, true)
    }
  }, [])
  return (
    <StyledIframe
      style={style}
      ref={frame}
      srcDoc={getDefaultSrcDoc(head, body)}
    >
      {doc
        ? ReactDOM.createPortal(
            <StyleSheetManager
              target={doc.head}
              disableVendorPrefixes={disableVendorPrefixes}
            >
              {children}
            </StyleSheetManager>,
            doc.body
          )
        : null}
    </StyledIframe>
  )
}

export function SandboxLink(
  props: ISandboxProps & { src: string; rootQuerySelector: string }
) {
  const {
    style,
    disableVendorPrefixes,
    children,
    getRef,
    src,
    rootQuerySelector
  } = props
  const [doc, setDoc] = useState<Document | null>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const handleIframeLoad = () => {
    const currentDoc = frame.current?.contentDocument ?? null

    getRef && getRef(frame)
    if (currentDoc) {
      setDoc(currentDoc)
    }
  }

  useEffect(() => {
    const currentFrame = frame.current
    currentFrame?.addEventListener('load', handleIframeLoad, true)
    return () => {
      currentFrame?.removeEventListener('load', handleIframeLoad, true)
    }
  }, [])

  const root = doc?.querySelector(rootQuerySelector)
  return (
    <iframe
      key={2}
      style={{
        ...style,
        height: '100%',
        border: 'none',
        width: '100%'
      }}
      ref={frame}
      src={src}
      title='Sanbox'
    >
      {root &&
        ReactDOM.createPortal(
          <StyleSheetManager
            target={doc?.head}
            disableVendorPrefixes={disableVendorPrefixes}
          >
            <>{children}</>
          </StyleSheetManager>,
          root
        )}
    </iframe>
  )
}

const StyledIframe = styled.iframe`
  height: 100%;
  border: none;
  width: 100%;
`

export default Sandbox
