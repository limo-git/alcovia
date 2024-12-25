'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from 'lucide-react'
import Roadmap from './Roadmap'

interface UserData {
  name: string
  email: string
  strengths: string[]
  weaknesses: string[]
  preferences: string[]
}

interface LearningPathResultsProps {
  userData: UserData
}

export default function LearningPathResults({ userData }: LearningPathResultsProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const generateRecommendations = (userData: UserData) => {
    const recommendations = {
      activities: [] as string[],
      workshops: [] as string[],
      mentorship: [] as string[]
    }

    if (userData.strengths.includes('Problem Solving')) {
      recommendations.activities.push('Participate in coding challenges')
      recommendations.activities.push('Join a hackathon')
    }
    if (userData.weaknesses.includes('Public Speaking')) {
      recommendations.workshops.push('Public Speaking Workshop')
      recommendations.workshops.push('Toastmasters Club')
    }
    if (userData.preferences.includes('Mentorship')) {
      recommendations.mentorship.push('One-on-one mentoring sessions')
      recommendations.mentorship.push('Join a peer mentoring program')
    }
    // Add more recommendation logic here...

    return recommendations
  }

  const recommendations = generateRecommendations(userData)
  const roadmapSteps = ['Start', 'Activities', 'Workshops', 'Mentorship', 'Complete']

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  return (
    <div className="space-y-6 pb-20">
      <Roadmap steps={roadmapSteps} />
      <motion.h2 
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Personalized Learning Path
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Hello {userData.name}, here is your personalized learning path based on your input:
      </motion.p>
      
      {Object.entries(recommendations).map(([category, items], index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
        >
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer flex flex-row items-center justify-between"
              onClick={() => toggleCategory(category)}
            >
              <CardTitle className="capitalize">{category}</CardTitle>
              {expandedCategory === category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </CardHeader>
            <AnimatePresence>
              {expandedCategory === category && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent>
                    <ul className="list-disc pl-5">
                      {items.map((item, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      ))}
      
      {/* Add some extra content to enable scrolling */}
      <div className="h-[200vh]"></div>
    </div>
  )
}

