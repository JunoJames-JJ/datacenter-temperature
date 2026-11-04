import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const [cpuLoad, setCpuLoad] = useState(50)
  const [humidity, setHumidity] = useState(45)
  const [outsideTemp, setOutsideTemp] = useState(30)
  const [coolingOn, setCoolingOn] = useState(true)
  const [history, setHistory] = useState([])
  const [isLive, setIsLive] = useState(false) 
  const [rackOffsets] = useState(() =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 30 - 15))
  )

  const calculateTemperature = () => {
    let temp = 18
    temp += cpuLoad * 0.08
    temp += humidity * 0.03
    temp += outsideTemp * 0.1
    if (coolingOn) temp -= 8
    return Number(temp.toFixed(1))
  }

  const temperature = calculateTemperature()

  const getStatus = () => {
    if (temperature < 22) return { label: 'Safe', className: 'status-safe' }
    if (temperature <= 28) return { label: 'Warning', className: 'status-warning' }
    return { label: 'Overheating', className: 'status-danger' }
  }

  const status = getStatus()

  // maps the temperature to a color along a cold -> hot gradient
  const getHeatColor = (temp) => {
    const min = 12, max = 34
    let t = (temp - min) / (max - min)
    t = Math.max(0, Math.min(1, t))
    const hue = 195 - 195 * t // 195 (cyan) down to 0 (red)
    return `hsl(${hue}, 80%, 58%)`
  } 

  const racks = rackOffsets.map((offset, i) => {
    const rackLoad = Math.min(100, Math.max(0, cpuLoad + offset))
    let rackTemp = 18 + rackLoad * 0.08 + humidity * 0.03 + outsideTemp * 0.1
    if (coolingOn) rackTemp -= 8
    return { id: i, load: rackLoad, temp: rackTemp, color: getHeatColor(rackTemp) }
  })

  const heatColor = getHeatColor(temperature)
  const gaugePercent = Math.max(0, Math.min(100, ((temperature - 12) / (34 - 12)) * 100))

  useEffect(() => {
    setHistory((prev) => {
      const newPoint = { time: new Date().toLocaleTimeString(), temp: temperature }
      const updated = [...prev, newPoint]
      return updated.slice(-20)
    })
  }, [temperature])

  const nudge = (value, min, max, maxChange) => {
    const change = (Math.random() * 2 - 1) * maxChange
    let updated = value + change
    if (updated < min) updated = min
    if (updated > max) updated = max
    return Number(updated.toFixed(0))
  }

  useEffect(() => {
    if (!isLive) return
    const interval = setInterval(() => {
      setCpuLoad((prev) => nudge(prev, 0, 100, 8))
      setHumidity((prev) => nudge(prev, 0, 100, 5))
      setOutsideTemp((prev) => nudge(prev, 0, 50, 3))
    }, 1500)
    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow"><span className="pulse-dot" />Thermal Systems</p>
          <h1>Datacenter Temperature Intelligence</h1>
        </div>
        <label className="sim-toggle">
          <span>{isLive ? 'Simulation running' : 'Simulation paused'}</span>
          <span className={`toggle-track ${isLive ? 'on' : ''}`} onClick={() => setIsLive(!isLive)}>
            <span className="toggle-thumb" />
          </span>
        </label>
      </header>

      <div className="hero-grid">
        <div className="panel hero-panel" style={{ boxShadow: `0 0 60px -20px ${heatColor}66` }}>
          <p className="panel-label">Predicted temperature</p>
          <div className="hero-reading" style={{ color: heatColor, textShadow: `0 0 30px ${heatColor}55` }}>
            {temperature}<span className="hero-unit">°C</span>
          </div>
          <div className="gauge">
            <div className="gauge-fill" style={{ width: `${gaugePercent}%`, background: heatColor }} />
          </div>
          <div className="gauge-scale">
            <span>12°C</span>
            <span>34°C</span>
          </div>
          <p className={`status-line ${status.className}`}>{status.label}</p>
        </div>

        <div className="panel chart-panel">
          <p className="panel-label">Temperature history</p>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2330" vertical={false} />
              <XAxis dataKey="time" stroke="#5b6472" fontSize={11} tickLine={false} axisLine={{ stroke: '#1c2330' }} />
              <YAxis stroke="#5b6472" fontSize={11} tickLine={false} axisLine={{ stroke: '#1c2330' }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#11161f', border: '1px solid #1c2330', borderRadius: 8 }} labelStyle={{ color: '#8b95a5' }} />
              <Line type="monotone" dataKey="temp" stroke={heatColor} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div> 

      <div className="panel racks-panel">
        <p className="panel-label">Server racks</p>
        <div className="racks-grid">
          {racks.map((rack) => (
            <div className="rack" key={rack.id}>
              <div
                className="rack-fill"
                style={{ height: `${rack.load}%`, background: rack.color, boxShadow: `0 0 12px ${rack.color}88` }}
              />
              <span className="rack-label">R{rack.id + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel controls-panel">
        <p className="panel-label">Input parameters</p>
        <div className="controls-grid">
          <div className="control-item">
            <div className="control-row">
              <label>CPU load</label>
              <span className="control-value">{cpuLoad}%</span>
            </div>
            <input type="range" min="0" max="100" value={cpuLoad} disabled={isLive} onChange={(e) => setCpuLoad(Number(e.target.value))} />
          </div>

          <div className="control-item">
            <div className="control-row">
              <label>Humidity</label>
              <span className="control-value">{humidity}%</span>
            </div>
            <input type="range" min="0" max="100" value={humidity} disabled={isLive} onChange={(e) => setHumidity(Number(e.target.value))} />
          </div>

          <div className="control-item">
            <div className="control-row">
              <label>Outside temperature</label>
              <span className="control-value">{outsideTemp}°C</span>
            </div>
            <input type="range" min="0" max="50" value={outsideTemp} disabled={isLive} onChange={(e) => setOutsideTemp(Number(e.target.value))} />
          </div>

          <div className="control-item cooling-item">
            <div className="control-row">
              <label>Cooling system</label>
              <span className="control-value">{coolingOn ? 'On' : 'Off'}</span>
            </div>
            <span className={`toggle-track ${coolingOn ? 'on' : ''}`} onClick={() => setCoolingOn(!coolingOn)}>
              <span className="toggle-thumb" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App