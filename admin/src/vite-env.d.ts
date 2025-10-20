declare module '*.svg' {
    import * as React from 'react'
  
    export const ReactComponent: React.FunctionComponent<
      React.ComponentProps<'svg'> & { title?: string }
    >
    export default ReactComponent
  }
  
  declare module '*.css' {
    const content: Record<string, string>
    export default content
  }
  
  interface ImportMetaEnv {
    readonly VITE_BACKEND_API_URL: string
    readonly VITE_PLATFORM_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
  declare module '*.png' {
    const content: string
    export default content
  }
  
  declare module '*.jpg' {
    const content: string
    export default content
  }
  
  declare module '*.jpeg' {
    const content: string
    export default content
  }
  
  declare module '*.gif' {
    const content: string
    export default content
  }
  
  /// <reference types="vite/client" />
  /// <reference types="vite-plugin-svgr/client" />
