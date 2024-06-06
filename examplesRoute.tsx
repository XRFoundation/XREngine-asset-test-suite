import React from 'react'
import { Route, Routes } from 'react-router-dom'

import '@etherealengine/client-core/src/world/LocationModule'

const buttonStyle = {
  width: 'auto',
  height: '100%',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  padding: '8px',
  margin: '10px',
  borderStyle: 'solid',
  background: '#969696',
  cursor: 'pointer',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)', // Adds a slight 3D effect with a box-shadow
  wordWrap: 'break-word',
  borderColor: 'rgba(31, 27, 72, 0.85)' // Sets the outline color to rgb(31, 27, 72, 0.85)
} as React.CSSProperties

const Navbar = () => {
  const navbarStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px',
    backgroundColor: 'rgb(31 27 72 / 85%)',
    color: '#e7e7e7'
  }

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  }

  return (
    <div style={navbarStyle}>
      <h1 style={headingStyle}>Examples</h1>
    </div>
  )
}

//@ts-ignore
const metadata = import.meta.glob<any>('./examples/componentExamples.tsx', {
  import: 'metadata',
  eager: true
})

//@ts-ignore
const imports = import.meta.glob<any>('./examples/*.tsx')
const routes = Object.entries(imports).map(([route, lazy]) => [route, React.lazy(lazy), metadata[route]])

const RoutesList = () => {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const path = e.currentTarget.innerText
    window.location.href = `/examples/${path}`
  }

  return (
    <div style={{ pointerEvents: 'all', overflow: 'auto', height: '100vh', background: '#02022d' }}>
      <Navbar />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))',
          gap: '10px',
          padding: '10px'
        }}
      >
        {routes.map(([route, _, metadata]) => {
          const path = route.replace('./examples/', '').replace('.tsx', '')
          const title = metadata?.title ? metadata.title : path
          return (
            <button style={buttonStyle} key={path} onClick={onClick}>
              {title}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const ExampleRoutes = () => {
  return (
    <Routes>
      {routes.map(([route, Page]) => {
        const path = route.replace('./examples', '').replace('.tsx', '')
        return <Route key={path} path={path} element={<Page />} />
      })}
      <Route path={'/'} element={<RoutesList />} />
    </Routes>
  )
}

export default ExampleRoutes
