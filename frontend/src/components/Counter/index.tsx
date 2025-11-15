import { useState } from 'react'
import './index.module.scss'

interface CounterProps {
  initial?: number
}

export default function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial)
  return (
    <div>
      <p>Счётчик: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  )
}
