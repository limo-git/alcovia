'use client'

import { motion } from "framer-motion"
import { Star, Briefcase, GraduationCap } from 'lucide-react'
import Image from "next/image"
import { useState } from "react"

interface MentorCardProps {
  mentor: {
    name: string
    expertise: string
    avatar: string
  }
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [connected, setConnected] = useState(false)
  const handleConnectClick = () => {
    setConnected(true)
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden w-80"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="relative h-48">
          <Image
            src={mentor.avatar || "/images/img3.jpg"}  
            alt={mentor.name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <motion.div
            className="absolute bottom-4 left-4 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold">{mentor.name}</h2>
            <p className="text-sm">{mentor.expertise}</p>
          </motion.div>
        </div>
        <div className="p-4 space-y-4">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Star className="text-yellow-400" />
            <span className="text-sm text-gray-600">4.9 (120 reviews)</span>
          </motion.div>
          <motion.div
            className="flex items-center space-x-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Briefcase className="text-blue-500" />
            <span className="text-sm text-gray-600">10 years experience</span>
          </motion.div>
          <motion.div
            className="flex items-center space-x-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <GraduationCap className="text-green-500" />
            <span className="text-sm text-gray-600">50+ mentees</span>
          </motion.div>
          <motion.button
            className={`w-full py-2 rounded-md font-semibold ${connected ? "bg-green-500" : "bg-blue-500"} text-white`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnectClick}
          >
            {connected ? "Connected" : "Connect"}
          </motion.button>
          </div>
      </motion.div>
    </div>
  )
}
