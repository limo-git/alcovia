import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WorkshopCardProps {
  workshop: {
    title: string
    date: string
    instructor: string
  }
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{workshop.title}</CardTitle>
        <CardDescription className="text-sm">Date: {new Date(workshop.date).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">Instructor: {workshop.instructor}</p>
        <Button>Register</Button>
      </CardContent>
    </Card>
  )
}

