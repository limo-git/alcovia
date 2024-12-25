'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import ShineBorder from '@/components/ui/shine-border'

interface MentorCardProps {
  mentor: {
    name: string
    expertise: string
    avatar: string
  }
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <ShineBorder className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-bold">{mentor.name}</CardTitle>
            <CardDescription className="text-sm">{mentor.expertise}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline">
          {isExpanded ? 'Show Less' : 'Learn More'}
        </Button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button className="mt-2">Schedule Session</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      </ShineBorder>
    </Card>
  );
}
