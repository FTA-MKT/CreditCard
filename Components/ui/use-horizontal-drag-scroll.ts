"use client"

import * as React from "react"

export function useHorizontalDragScroll<T extends HTMLElement>() {
  const containerRef = React.useRef<T | null>(null)
  const dragStateRef = React.useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  })
  const suppressClickRef = React.useRef(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [canDragScroll, setCanDragScroll] = React.useState(false)

  const updateCanDragScroll = React.useCallback(() => {
    const container = containerRef.current
    if (!container) {
      setCanDragScroll(false)
      return
    }

    setCanDragScroll(container.scrollWidth - container.clientWidth > 1)
  }, [])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    updateCanDragScroll()

    const resizeObserver = new ResizeObserver(() => {
      updateCanDragScroll()
    })

    resizeObserver.observe(container)
    Array.from(container.children).forEach((child) => {
      resizeObserver.observe(child)
    })

    window.addEventListener("resize", updateCanDragScroll)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateCanDragScroll)
    }
  }, [updateCanDragScroll])

  const handleMouseMove = React.useCallback((event: MouseEvent) => {
    const container = containerRef.current
    const dragState = dragStateRef.current

    if (!container || !dragState.active) return

    const deltaX = event.clientX - dragState.startX
    if (!dragState.moved && Math.abs(deltaX) > 4) {
      dragState.moved = true
      setIsDragging(true)
    }

    if (!dragState.moved) return

    container.scrollLeft = dragState.startScrollLeft - deltaX
    event.preventDefault()
  }, [])

  const endDrag = React.useCallback(() => {
    const dragState = dragStateRef.current
    if (!dragState.active) return

    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", endDrag)

    dragState.active = false

    if (dragState.moved) {
      suppressClickRef.current = true
    }

    dragState.moved = false
    setIsDragging(false)
  }, [handleMouseMove])

  React.useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", endDrag)
    }
  }, [endDrag, handleMouseMove])

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<T>) => {
      if (event.button !== 0) return
      if (!canDragScroll) return

      const container = containerRef.current
      if (!container) return

      dragStateRef.current = {
        active: true,
        startX: event.clientX,
        startScrollLeft: container.scrollLeft,
        moved: false,
      }
      suppressClickRef.current = false
      setIsDragging(false)

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", endDrag)
    },
    [canDragScroll, endDrag, handleMouseMove]
  )

  const handleMouseLeave = React.useCallback(() => {
    if (!dragStateRef.current.active || !dragStateRef.current.moved) return
    endDrag()
  }, [endDrag])

  const handleClickCapture = React.useCallback((event: React.MouseEvent<T>) => {
    if (!suppressClickRef.current) return

    event.preventDefault()
    event.stopPropagation()
    suppressClickRef.current = false
  }, [])

  return {
    containerRef,
    canDragScroll,
    isDragging,
    dragScrollProps: {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onClickCapture: handleClickCapture,
    },
  }
}
