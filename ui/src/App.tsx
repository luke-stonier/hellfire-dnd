import { useState } from 'react'
import './App.css'
import './fonts.css'
// import { Link } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div>
            <div className='border border-primary' style={{ padding: 2, marginBottom: 4 }}></div>
            <div className='d-flex align-items-center justify-content-center'>
                <h1 className={'display-1 fw-bold text-primary my-0'}>HELLFIRE D</h1>
                <span className={'text-primary fw-bold display-4 my-0 d-block'}>n</span>
                <h1 className={'display-1 fw-bold text-primary my-0'}>D</h1>
            </div>
            <div className='border border-primary' style={{ padding: 2, marginTop: 4 }}></div>
        </div>

        <div className='border border-primary mt-2 p-1 rounded-3'>
            <div className='d-flex align-items-center justify-content-center'>
                {/*<Link to='/login'>Login</Link>*/}
            </div>
        </div>
        
      <div className="w-50 mx-auto d-flex flex-column gap-2 mt-4 p-3 rounded-4 border border-info">
          <button className='btn btn-primary d-flex align-items-center justify-content-center' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-secondary' onClick={() => setCount((count) => count + 1)}><span>count is {count}</span></button>
          <button className='btn btn-success' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-danger' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-warning' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-info' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <button className='btn btn-dark' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
      <button className='btn btn-light' onClick={() => setCount((count) => count + 1)}>count is {count}</button>
      </div>
    </>
  )
}

export default App
