'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface EnhancedRoadmapProps {
  steps: string[]
  activeStep: string
}

export function EnhancedRoadmap({ steps, activeStep }: EnhancedRoadmapProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const progress = (scrollPosition / documentHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)

    // Call handleScroll once to set the initial scroll progress
    handleScroll()

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 h-[80vh] flex flex-col items-center">
      <div className="h-full w-1 bg-gray-200 relative">
        <motion.div 
          className="absolute w-1 bg-blue-500"
          initial={{ height: 0 }}
          animate={{ height: `${scrollProgress}%` }}  // Use scrollProgress to animate the line
          transition={{ duration: 0.2 }}
        ></motion.div>
      </div>
      {steps.map((step, index) => (
        <motion.div 
          key={index}
          className={`absolute w-4 h-4 rounded-full border-2 ${
            steps.indexOf(activeStep) >= index ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
          }`}
          style={{ top: `${(index / (steps.length - 1)) * 100}%`, left: -7 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.span 
            className="absolute left-6 top-1/2 transform -translate-y-1/2 whitespace-nowrap text-sm font-medium"
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
