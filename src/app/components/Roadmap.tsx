'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface RoadmapProps {
  steps: string[]
}

export default function Roadmap({ steps }: RoadmapProps) {
  const [activeStep, setActiveStep] = useState(0)
  const roadmapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (roadmapRef.current) {
        const roadmapRect = roadmapRef.current.getBoundingClientRect()
        const roadmapTop = roadmapRect.top
        const roadmapBottom = roadmapRect.bottom
        const windowHeight = window.innerHeight

        const stepHeight = (roadmapBottom - roadmapTop) / steps.length
        const activeIndex = Math.floor((windowHeight / 2 - roadmapTop) / stepHeight)

        setActiveStep(Math.max(0, Math.min(activeIndex, steps.length - 1)))
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [steps.length])

  return (
    <div ref={roadmapRef} className="fixed left-4 top-1/2 transform -translate-y-1/2 h-[80vh] flex flex-col items-center">
      <div className="h-full w-1 bg-gray-200 relative">
        <motion.div 
          className="absolute w-1 bg-blue-500"
          initial={{ height: 0 }}
          animate={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
      {steps.map((step, index) => (
        <motion.div 
          key={index}
          className={`absolute w-4 h-4 rounded-full border-2 ${
            index <= activeStep ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
          }`}
          style={{ top: `${(index / (steps.length - 1)) * 100}%`, left: -7 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.span 
            className="absolute left-6 top-1/2 transform -translate-y-1/2 whitespace-nowrap text-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {step}
          </motion.span>
        </motion.div>
      ))}
    </div>
  )
}

