import { useState } from 'react'
import './App.css'

function App() {
  const [modulus, setModulus] = useState<string>('')
  const [operandA, setOperandA] = useState<string>('')
  const [operandB, setOperandB] = useState<string>('')
  const [operandC, setOperandC] = useState<string>('')
  const [operandD, setOperandD] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [activeSection, setActiveSection] = useState<string>('basic')

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

  // Алгоритм Евкліда для знаходження НСД
  const gcd = (a: number, b: number): number => {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

  // Розширений алгоритм Евкліда для знаходження зворотного елемента
  const extendedGcd = (a: number, b: number): [number, number, number] => {
    if (a === 0) return [b, 0, 1]
    const [g, x1, y1] = extendedGcd(b % a, a)
    const x = y1 - Math.floor(b / a) * x1
    const y = x1
    return [g, x, y]
  }

  // Функція Ейлера (Task 5)
  const eulerPhi = (n: number): number => {
    if (n <= 0) return 0
    if (n === 1) return 1
    
    let result = n
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) {
        while (n % i === 0) {
          n /= i
        }
        result -= result / i
      }
    }
    if (n > 1) {
      result -= result / n
    }
    return Math.round(result)
  }

  // Модульне піднесення до степеня (для Ферма)
  const modPow = (base: number, exp: number, mod: number): number => {
    if (mod === 1) return 0
    let result = 1
    base = base % mod
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod
      }
      exp = Math.floor(exp / 2)
      base = (base * base) % mod
    }
    return result
  }

  // Перевірка простоти на основі теореми Ферма (Task 1)
  const handleFermatPrimalityTest = () => {
    const n = parseInt(operandA)
    if (isNaN(n) || n <= 1) {
      setResult('Помилка: введіть число > 1')
      return
    }
    if (n === 2) {
      setResult('Просте')
      return
    }
    if (n % 2 === 0) {
      setResult('Не просте')
      return
    }

    // Тест Ферма з кількома основами
    const bases = [2, 3, 5, 7, 11]
    for (const a of bases) {
      if (a >= n) continue
      if (modPow(a, n - 1, n) !== 1) {
        setResult('Не просте')
        return
      }
    }
    setResult('Просте (ймовірно)')
  }

  // Генерація простого числа p ≤ A (Task 1)
  const handleGeneratePrime = () => {
    const A = parseInt(operandA)
    if (isNaN(A) || A < 2) {
      setResult('Помилка: введіть границю A ≥ 2')
      return
    }

    // Перевіряємо від A вниз до 2
    for (let p = A; p >= 2; p--) {
      if (p === 2) {
        setResult('2')
        return
      }
      if (p % 2 === 0) continue

      let isPrime = true
      const bases = [2, 3, 5, 7, 11]
      for (const a of bases) {
        if (a >= p) continue
        if (modPow(a, p - 1, p) !== 1) {
          isPrime = false
          break
        }
      }
      if (isPrime) {
        setResult(p.toString())
        return
      }
    }
    setResult('Просте число не знайдено')
  }

  // Перевірка взаємної простоти двох пар чисел ()
  const handleCheckCoprimalityPairs = () => {
    const a = parseInt(operandA)
    const b = parseInt(operandB)
    const c = parseInt(operandC)
    const d = parseInt(operandD)

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
      setResult('Помилка: введіть всі чотири числа')
      return
    }

    const gcd1 = gcd(a, b)
    const gcd2 = gcd(c, d)

    const result1 = gcd1 === 1 ? 'взаємно прості' : 'не взаємно прості (НСД=' + gcd1 + ')'
    const result2 = gcd2 === 1 ? 'взаємно прості' : 'не взаємно прості (НСД=' + gcd2 + ')'

    setResult(`Пара (${a}, ${b}): ${result1}; Пара (${c}, ${d}): ${result2}`)
  }

  // Алгоритм Евкліда для НСД (Task 3)
  const handleEuclideanGCD = () => {
    const a = parseInt(operandA)
    const b = parseInt(operandB)

    if (isNaN(a) || isNaN(b)) {
      setResult('Помилка: введіть числа a та b')
      return
    }

    const g = gcd(a, b)
    setResult(`НСД(${a}, ${b}) = ${g}`)
  }

  // Функція Ейлера для двох чисел (Task 4)
  const handleEulerPhiTwo = () => {
    const n1 = parseInt(operandA)
    const n2 = parseInt(operandB)

    if (isNaN(n1) || isNaN(n2) || n1 <= 0 || n2 <= 0) {
      setResult('Помилка: введіть два додатні числа')
      return
    }

    const phi1 = eulerPhi(n1)
    const phi2 = eulerPhi(n2)

    setResult(`φ(${n1}) = ${phi1}; φ(${n2}) = ${phi2}`)
  }

  // Функція Ейлера для одного числа (Task 5)
  const handleEulerPhi = () => {
    const n = parseInt(operandA)

    if (isNaN(n) || n <= 0) {
      setResult('Помилка: введіть додатнє число n')
      return
    }

    const phi = eulerPhi(n)
    setResult(`φ(${n}) = ${phi}`)
  }

  // Зворотний елемент через функцію Ейлера (Task 6)
  const handleMultiplicativeInverse = () => {
    const p = parseInt(modulus)
    const a = parseInt(operandA)

    if (isNaN(p) || p <= 0) {
      setResult('Помилка: модуль p має бути додатнім')
      return
    }
    if (isNaN(a)) {
      setResult('Помилка: введіть число a')
      return
    }

    // Перевірка взаємної простоти
    if (gcd(a, p) !== 1) {
      setResult(`Помилка: числа ${a} та ${p} не взаємно прості`)
      return
    }

    // Використовуємо розширений алгоритм Евкліда
    const [g, x] = extendedGcd(a, p)
    if (g !== 1) {
      setResult('Помилка: зворотний елемент не існує')
      return
    }

    const inverse = mod(x, p)
    setResult(`a⁻¹ = ${inverse}`)
  }

  // Ділення: a / b mod m
  const handleDivision = () => {
    const m = parseInt(modulus)
    const a = parseInt(operandA)
    const b = parseInt(operandB)

    if (!isValidInput(m, a, b)) return

    // Перевірка взаємної простоти b та m
    if (gcd(b, m) !== 1) {
      setResult(`Помилка: числа ${b} та ${m} не взаємно прості`)
      return
    }

    // Знаходимо зворотний елемент b
    const [g, x] = extendedGcd(b, m)
    if (g !== 1) {
      setResult('Помилка: ділення неможливе')
      return
    }

    const bInverse = mod(x, m)
    const res = mod(a * bInverse, m)
    setResult(res.toString())
  }

  // Очищення всіх полів
  const handleClear = () => {
    setModulus('')
    setOperandA('')
    setOperandB('')
    setOperandC('')
    setOperandD('')
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
      
      <div className="section-tabs">
        <button 
          className={activeSection === 'basic' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveSection('basic')}
        >
          Базові операції
        </button>
        <button 
          className={activeSection === 'tasks' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveSection('tasks')}
        >
          Завдання
        </button>
      </div>

      <div className="calculator">
        {activeSection === 'basic' && (
          <>
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
              <button onClick={handleMultiplicativeInverse} className="operation-btn">
                a⁻¹ (a⁻¹ mod m)
              </button>
              <button onClick={handleDivision} className="operation-btn">
                / (a / b mod m)
              </button>
              <button onClick={handleClear} className="clear-btn">
                Clear
              </button>
            </div>
          </>
        )}

        {activeSection === 'tasks' && (
          <>
            <div className="input-group">
              <label htmlFor="modulus-tasks">Модуль (m) / p:</label>
              <input
                id="modulus-tasks"
                type="number"
                value={modulus}
                onChange={(e) => setModulus(e.target.value)}
                placeholder="Введіть модуль"
                min="1"
              />
            </div>

            <div className="input-group">
              <label htmlFor="operandA-tasks">Число a / n / A:</label>
              <input
                id="operandA-tasks"
                type="number"
                value={operandA}
                onChange={(e) => setOperandA(e.target.value)}
                placeholder="Введіть число"
              />
            </div>

            <div className="input-group">
              <label htmlFor="operandB-tasks">Число b / n2:</label>
              <input
                id="operandB-tasks"
                type="number"
                value={operandB}
                onChange={(e) => setOperandB(e.target.value)}
                placeholder="Введіть число"
              />
            </div>

            <div className="input-group">
              <label htmlFor="operandC-tasks">Число c:</label>
              <input
                id="operandC-tasks"
                type="number"
                value={operandC}
                onChange={(e) => setOperandC(e.target.value)}
                placeholder="Введіть число c"
              />
            </div>

            <div className="input-group">
              <label htmlFor="operandD-tasks">Число d:</label>
              <input
                id="operandD-tasks"
                type="number"
                value={operandD}
                onChange={(e) => setOperandD(e.target.value)}
                placeholder="Введіть число d "
              />
            </div>

            <div className="input-group">
              <label htmlFor="result-tasks">Результат:</label>
              <input
                id="result-tasks"
                type="text"
                value={result}
                readOnly
                placeholder="Результат обчислень"
                className="result-input"
              />
            </div>

            <div className="task-section">
              <h3>Завдання 1</h3>
              <div className="buttons-grid">
                <button onClick={handleFermatPrimalityTest} className="operation-btn">
                  Перевірка простоти (Ферма)
                </button>
                <button onClick={handleGeneratePrime} className="operation-btn">
                  Генерація простого ≤ A
                </button>
              </div>
            </div>

            <div className="task-section">
              <h3>Завдання 2</h3>
              <div className="buttons-grid">
                <button onClick={handleCheckCoprimalityPairs} className="operation-btn">
                  Перевірка взаємної простоти пар
                </button>
              </div>
            </div>

            <div className="task-section">
              <h3>Завдання 3</h3>
              <div className="buttons-grid">
                <button onClick={handleEuclideanGCD} className="operation-btn">
                  НСД (алгоритм Евкліда)
                </button>
              </div>
            </div>

            <div className="task-section">
              <h3>Завдання 4</h3>
              <div className="buttons-grid">
                <button onClick={handleEulerPhiTwo} className="operation-btn">
                  φ(n1) та φ(n2)
                </button>
              </div>
            </div>

            <div className="task-section">
              <h3>Завдання 5</h3>
              <div className="buttons-grid">
                <button onClick={handleEulerPhi} className="operation-btn">
                  Функція Ейлера φ(n)
                </button>
              </div>
            </div>

            <div className="task-section">
              <h3>Завдання 6</h3>
              <div className="buttons-grid">
                <button onClick={handleMultiplicativeInverse} className="operation-btn">
                  a⁻¹ в G(p,*) через φ
                </button>
              </div>
            </div>

            <button onClick={handleClear} className="clear-btn">
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default App
