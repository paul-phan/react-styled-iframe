import { CSSProperties } from 'styled-components'
import * as React from 'react'

/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

interface SvgrComponent extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent }
}



interface ISandboxProps {
  style?: CSSProperties
  disableVendorPrefixes?: boolean
  children: React.ReactElement
  getRef?: (ref: React.RefObject<any>) => void
  head?: string
  body?: string
}
