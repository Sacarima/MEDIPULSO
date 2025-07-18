import '../styles/CircularProgress.css'


const CircularProgressbar = ({progress}) => {
    const radius = 50
    const stroke = 10
    const normalizedRadius = radius - stroke * 1
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="progress-container">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="progress-circle"
      >
        <circle
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#00b39be6"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="progress-indicator"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="18px"
          fill="#333"
        >
          {progress}%
        </text>
      </svg>
    </div>
  )
}

export default CircularProgressbar