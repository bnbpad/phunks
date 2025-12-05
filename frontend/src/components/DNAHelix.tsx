import React, { useEffect, useRef } from 'react'

const DNAHelix = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    let animationFrame: number
    let rotation = 0
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 80
      const helixHeight = 300
      const segments = 50
      
      for (let i = 0; i < segments; i++) {
        const y = (i / segments) * helixHeight - helixHeight / 2
        const angle1 = (i / segments) * Math.PI * 4 + rotation
        const angle2 = angle1 + Math.PI
        
        const x1 = centerX + Math.cos(angle1) * radius
        const x2 = centerX + Math.cos(angle2) * radius
        
        const opacity = 1 - Math.abs(y) / (helixHeight / 2)
        
        // Draw strand 1
        ctx.beginPath()
        ctx.arc(x1, centerY + y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`
        ctx.fill()
        ctx.shadowBlur = 10
        ctx.shadowColor = '#00FFFF'
        
        // Draw strand 2
        ctx.beginPath()
        ctx.arc(x2, centerY + y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 0, 128, ${opacity})`
        ctx.fill()
        ctx.shadowBlur = 10
        ctx.shadowColor = '#FF0080'
        
        // Draw connecting lines
        if (i % 3 === 0) {
          ctx.beginPath()
          ctx.moveTo(x1, centerY + y)
          ctx.lineTo(x2, centerY + y)
          ctx.strokeStyle = `rgba(138, 255, 0, ${opacity * 0.5})`
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }
      
      rotation += 0.02
      animationFrame = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ maxHeight: '400px' }}
    />
  )
}

export default DNAHelix
