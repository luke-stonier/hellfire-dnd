import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './fonts.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className={'text-primary'}>Hellfire DnD</h1>
      <div className="card">
          <button className='btn btn-primary' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-secondary' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-success' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-danger' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-warning' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-info' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-dark' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-light' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
