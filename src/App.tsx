import { useState } from 'react'
import './App.css'

function App() {
  const [modulus, setModulus] = useState<string>('')
  const [operandA, setOperandA] = useState<string>('')
  const [operandB, setOperandB] = useState<string>('')
  const [result, setResult] = useState<string>('')

  // Функція для обчислення модуля (залишку)
  const mod = (value: number, m: number): number => {
    return ((value % m) + m) % m
  }

  // Додавання: a + b mod m
  const handleAddition = () => {
    const m = parseInt(modulus)
    const a = parseInt(operandA)
    const b = parseInt(operandB)

    if (!isValidInput(m, a, b)) return

    const res = mod(a + b, m)
    setResult(res.toString())
  }

  // Віднімання: a - b mod m
  const handleSubtraction = () => {
    const m = parseInt(modulus)
    const a = parseInt(operandA)
    const b = parseInt(operandB)

    if (!isValidInput(m, a, b)) return

    const res = mod(a - b, m)
    setResult(res.toString())
  }

  // Множення: a * b mod m
  const handleMultiplication = () => {
    const m = parseInt(modulus)
    const a = parseInt(operandA)
    const b = parseInt(operandB)

    if (!isValidInput(m, a, b)) return

    const res = mod(a * b, m)
    setResult(res.toString())
  }

  // Зворотний по додаванню: -a mod m
  const handleAdditiveInverse = () => {
    const m = parseInt(modulus)
    const a = parseInt(operandA)

    if (!isValidInput(m, a)) return

    const res = mod(-a, m)
    setResult(res.toString())
  }

  // Піднесення в ступінь: a^b mod m (з циклом для уникнення переповнення)
  const handleExponentiation = () => {
    const m = parseInt(modulus)
    const a = parseInt(operandA)
    const b = parseInt(operandB)

    if (!isValidInput(m, a, b)) return

    let P = 1 // початкове значення добутку
    for (let i = 1; i <= b; i++) {
      P = mod(P * a, m) // множимо на a та обчислюємо залишок
    }
    setResult(P.toString())
  }

  // Зворотний по множенню: a^-1 mod m (поки не реалізовано)
  const handleMultiplicativeInverse = () => {
    setResult('Не реалізовано')
  }

  // Ділення: a / b mod m (поки не реалізовано)
  const handleDivision = () => {
    setResult('Не реалізовано')
  }

  // Очищення всіх полів
  const handleClear = () => {
    setModulus('')
    setOperandA('')
    setOperandB('')
    setResult('')
  }

  // Валідація вводу
  const isValidInput = (m: number, a: number, b?: number): boolean => {
    if (isNaN(m) || m <= 0) {
      setResult('Помилка: модуль має бути додатнім числом')
      return false
    }
    if (isNaN(a)) {
      setResult('Помилка: введіть коректне значення a')
      return false
    }
    if (b !== undefined && isNaN(b)) {
      setResult('Помилка: введіть коректне значення b')
      return false
    }
    return true
  }

  return (
    <div className="calculator-container">
      <h1>Калькулятор залишків</h1>
      
      <div className="calculator">
        <div className="input-group">
          <label htmlFor="modulus">Модуль (m):</label>
          <input
            id="modulus"
            type="number"
            value={modulus}
            onChange={(e) => setModulus(e.target.value)}
            placeholder="Введіть модуль"
            min="1"
          />
        </div>

        <div className="input-group">
          <label htmlFor="operandA">Операнд a:</label>
          <input
            id="operandA"
            type="number"
            value={operandA}
            onChange={(e) => setOperandA(e.target.value)}
            placeholder="Введіть a"
          />
        </div>

        <div className="input-group">
          <label htmlFor="operandB">Операнд b:</label>
          <input
            id="operandB"
            type="number"
            value={operandB}
            onChange={(e) => setOperandB(e.target.value)}
            placeholder="Введіть b"
          />
        </div>

        <div className="input-group">
          <label htmlFor="result">Результат (c):</label>
          <input
            id="result"
            type="text"
            value={result}
            readOnly
            placeholder="Результат обчислень"
            className="result-input"
          />
        </div>

        <div className="buttons-grid">
          <button onClick={handleAddition} className="operation-btn">
            + (a + b mod m)
          </button>
          <button onClick={handleSubtraction} className="operation-btn">
            - (a - b mod m)
          </button>
          <button onClick={handleMultiplication} className="operation-btn">
            * (a * b mod m)
          </button>
          <button onClick={handleAdditiveInverse} className="operation-btn">
            -a (-a mod m)
          </button>
          <button onClick={handleExponentiation} className="operation-btn">
            ^ (a^b mod m)
          </button>
          <button onClick={handleMultiplicativeInverse} className="operation-btn disabled">
            a⁻¹ (a⁻¹ mod m)
          </button>
          <button onClick={handleDivision} className="operation-btn disabled">
            / (a / b mod m)
          </button>
          <button onClick={handleClear} className="clear-btn">
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
