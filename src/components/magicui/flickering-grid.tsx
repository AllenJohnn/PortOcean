"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color,
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [rgbaPrefix, setRgbaPrefix] = useState<string>("rgba(0, 0, 0,")

  const resolveColor = useCallback((colorValue: string | undefined): string => {
    if (typeof window === "undefined") {
      return "rgb(0, 0, 0)"
    }

    const colorToResolve = colorValue || "var(--foreground)"

    if (colorToResolve.startsWith("var(")) {
      const computed = window.getComputedStyle(document.documentElement).getPropertyValue(colorToResolve.slice(4, -1)).trim()
      if (computed) {
        return computed.startsWith("oklch") || computed.startsWith("#") || computed.startsWith("rgb") ? computed : `rgb(${computed})`
      }
    }

    return colorToResolve
  }, [])

  useEffect(() => {
    const updateRgbaPrefix = () => {
      if (typeof window === "undefined") return
      const resolvedColor = resolveColor(color)
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) return
      ctx.fillStyle = resolvedColor
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
      setRgbaPrefix(`rgba(${r}, ${g}, ${b},`)
    }

    updateRgbaPrefix()

    const observer = new MutationObserver(() => {
      updateRgbaPrefix()
    })

    if (typeof window !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [color, resolveColor])

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const cols = Math.floor(width / (squareSize + gridGap))
      const rows = Math.floor(height / (squareSize + gridGap))

      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }

      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity]
  )

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity
        }
      }
    },
    [flickerChance, maxOpacity]
  )

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number
    ) => {
      ctx.clearRect(0, 0, width, height)

      const opacityGroups: { [key: string]: { x: number; y: number }[] } = {}

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i * rows + j]
          const roundedOpacity = (Math.round(opacity * 20) / 20).toFixed(2)
          if (parseFloat(roundedOpacity) <= 0) continue

          if (!opacityGroups[roundedOpacity]) {
            opacityGroups[roundedOpacity] = []
          }
          opacityGroups[roundedOpacity].push({
            x: i * (squareSize + gridGap) * dpr,
            y: j * (squareSize + gridGap) * dpr,
          })
        }
      }

      const size = squareSize * dpr
      for (const [opacity, cells] of Object.entries(opacityGroups)) {
        ctx.fillStyle = `${rgbaPrefix}${opacity})`
        for (let k = 0; k < cells.length; k++) {
          const cell = cells[k]
          ctx.fillRect(cell.x, cell.y, size, size)
        }
      }
    },
    [rgbaPrefix, squareSize, gridGap]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let gridParams: ReturnType<typeof setupCanvas>

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth
      const newHeight = height || container.clientHeight
      setCanvasSize({ width: newWidth, height: newHeight })
      gridParams = setupCanvas(canvas, newWidth, newHeight)
    }

    updateCanvasSize()

    let lastTime = 0
    const frameInterval = 1000 / 30
    let accumulatedTime = 0

    const animate = (time: number) => {
      if (!isInView) return

      const deltaTime = (time - lastTime) || 0
      lastTime = time
      accumulatedTime += deltaTime

      if (accumulatedTime >= frameInterval) {
        updateSquares(gridParams.squares, accumulatedTime / 1000)
        drawGrid(
          ctx,
          canvas.width,
          canvas.height,
          gridParams.cols,
          gridParams.rows,
          gridParams.squares,
          gridParams.dpr
        )
        accumulatedTime = accumulatedTime % frameInterval
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })

    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    intersectionObserver.observe(canvas)

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView])

  return (
    <div
      ref={containerRef}
      className={cn(`h-full w-full ${className}`)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  )
}
