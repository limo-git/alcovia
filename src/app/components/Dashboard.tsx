'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MentorCard } from './MentorCard';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import IconCloud from '@/components/ui/icon-cloud';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { InfiniteMovingCardsDemo } from './Workshops';

const words = `Your learning journery awaits. Dive In
`;
 
const images = [
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",
  "https://img.icons8.com/ios-filled/50/filled-circle.png",

];
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

interface Task {
  taskName: string;
  description: string;
  category: string;
  priority: string;
  timeOfDay: string;
  duration: string;
}
interface Activity {
  activityName: string;
  description: string;
  category: string;
  duration: string;
  difficultyLevel: string;
}

interface Workshop {
  workshopName: string;
  description: string;
  date: string;
  duration: string;
  difficultyLevel: string;
}


interface DashboardProps {
  userData: {
    name: string;
    email: string;
    strengths: string[];
    weaknesses: string[];
    preferences: string[];
  };
  recommendedTasks: Task[] | null;
  recommendedActivities:Activity[] | null;
  recommendedWorkshops:Workshop[]| null;
  mentors:Mentor[]| null;
}

interface Mentor {
  _id: string; // Mongoose document _id
  name: string;
  expertise: string[]; // Array of strings representing mentor's areas of expertise
  contact_email: string; // Mentor's contact email
  availability: string[]; // Array of strings representing mentor's availability
}


const workshopData = {
  React: [
    { date: '2023-01', attendanceRate: 85, feedbackScore: 4.2 },
    { date: '2023-02', attendanceRate: 88, feedbackScore: 4.3 },
    { date: '2023-03', attendanceRate: 90, feedbackScore: 4.5 },
    { date: '2023-04', attendanceRate: 87, feedbackScore: 4.4 },
  ],
  JavaScript: [
    { date: '2023-01', attendanceRate: 20, feedbackScore: 2.0 },
    { date: '2023-02', attendanceRate: 85, feedbackScore: 3.2 },
    { date: '2023-03', attendanceRate: 49, feedbackScore: 1.4 },
    { date: '2023-04', attendanceRate: 86, feedbackScore: 4.3 },
  ],
};



const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Workshop Metrics',
    },
  },
};

export function Dashboard({ userData,mentors,recommendedActivities, recommendedWorkshops,recommendedTasks }: DashboardProps) {
  const [mentorQuestions, setMentorQuestions] = useState({
    mentorGoal: '',
    preferredMentor: '',
    availability: '',
  });

  const [selectedType, setSelectedType] = useState<keyof typeof workshopData>('React');

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value as keyof typeof workshopData);
  };

  const barChartData = {
    labels: workshopData[selectedType].map((data) => data.date),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: workshopData[selectedType].map((data) => data.attendanceRate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const lineChartData = {
    labels: workshopData[selectedType].map((data) => data.date),
    datasets: [
      {
        label: 'Feedback Score',
        data: workshopData[selectedType].map((data) => data.feedbackScore),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const handleSubmit = (userData: DashboardProps['userData']) => async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    console.log('Submitting request with email:', userData.email);
    try {
      setLoading(true);
      const response = await fetch('/api/recom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goals: mentorQuestions.mentorGoal,
          type: mentorQuestions.preferredMentor,
          availability: mentorQuestions.availability,
          email: userData.email,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit mentor request');
      }
  
      const data = await response.json();
      console.log('Mentor Match Request Submitted:', data);
      setMentorDetails(data.mentor); 
      setIsFirstDialogOpen(false);
      setIsSecondDialogOpen(true);
    } catch (error) {
      console.error('Error submitting mentor request:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const [loading, setLoading] = useState(false);
  const [mentorDetails, setMentorDetails] = useState<Mentor | null>(null);
  
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false); 
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false); 

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMentorQuestions((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800 font-sans">
      <ScrollArea className="flex-grow h-screen">
    <div className='flex pl-[40rem] justify-center items-center'>
      <IconCloud imageArray={images} />
      </div>
  
        <div className="p-6 space-y-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
              Welcome (^^), {userData.name}!
            </h1>
            <p className="text-lg text-gray-600"><TextGenerateEffect words={words} />;</p>
          </motion.div>
          
          <section id="start" className="w-full space-y-6">
          
  <h2 className="text-3xl font-bold">Today&apos;s Task</h2>
  
  <Card className="w-full ">
  
  <CardHeader>
  <CardTitle className="text-xl font-bold">
    {recommendedTasks && recommendedTasks[0] ? recommendedTasks[0].taskName : 'No Task Available'}
  </CardTitle>
  <CardDescription className="text-sm">
    {recommendedTasks && recommendedTasks[0] ? recommendedTasks[0].description : 'Complete the recommended task today!'}
  </CardDescription>
</CardHeader>

    <CardContent>
      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">
        Start Task
      </Button>
    </CardContent>
    
  </Card>
  
</section>



          {/* Recommended Activities */}
          <section id="activities" className="space-y-6">
  <h2 className="text-3xl font-bold">Recommended Activities</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {recommendedActivities && recommendedActivities.length > 0 ? (
      recommendedActivities.map((activity, index) => (
        <Card key={index} className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>{activity.activityName}</CardTitle>
            <CardDescription>{activity.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
              Explore Activities
            </Button>
          </CardContent>
        </Card>
      ))
    ) : (
      <p>No recommended activities available.</p>
    )}
  </div>
</section>


          {/* Workshops */}
          <section id="workshops" className="space-y-6">
          <h2 className="text-3xl font-bold">Upcoming Workshops</h2>
            {/* <MarqueeDemo/> */}
            <InfiniteMovingCardsDemo/>
           
    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(recommendedWorkshops ?? []).map((workshop, index) => (
        <Card key={index} className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>{workshop.workshopName}</CardTitle>
            <CardDescription>{`Workshop on ${workshop.description}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
              Join Workshop
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>  */}
</section>




          {/* Mentors */}
          <section id="mentorship" className="space-y-6">
            <h2 className="text-3xl font-bold">Meet Your Mentors</h2>
            {!loading && mentors && mentors.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {mentors.map((mentor) => (
              
              <MentorCard
                key={mentor._id}
                mentor={{
                  name: mentor.name,
                  expertise: mentor.expertise.join(', '), // Join expertise array into a string
                  avatar: '/default-avatar.png', // Add a default avatar or modify it based on mentor data
                }}
              />
            ))}
          </div>
        ) : (
          !loading && mentors && mentors.length === 0 && (
            <div className="text-center mt-8">
              <p>No mentors available at the moment.</p>
            </div>
          )
        )}
            <Dialog open={isFirstDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsFirstDialogOpen(true)} className="mt-4">Want to find your Perfect mentor?</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find Your Perfect Mentor</DialogTitle>
            <DialogDescription>
              Fill out the details to help us match you with the right mentor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="mentorGoal" className="block text-sm font-medium text-gray-700">
                What are your goals for mentorship?
              </label>
              <input
                type="text"
                name="mentorGoal"
                id="mentorGoal"
                value={mentorQuestions.mentorGoal}
                onChange={handleFormChange}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                placeholder="e.g., Improve coding skills, Career advice"
              />
            </div>
            <div>
              <label htmlFor="preferredMentor" className="block text-sm font-medium text-gray-700">
                What type of mentor are you looking for?
              </label>
              <input
                type="text"
                name="preferredMentor"
                id="preferredMentor"
                value={mentorQuestions.preferredMentor}
                onChange={handleFormChange}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                placeholder="e.g., Experienced in Machine Learning, Full-stack developer"
              />
            </div>
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                When are you available?
              </label>
              <input
                type="text"
                name="availability"
                id="availability"
                value={mentorQuestions.availability}
                onChange={handleFormChange}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                placeholder="e.g., Weekends, Monday, Evening"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={(event) => handleSubmit(userData)(event)}
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            <DialogClose asChild>
              <Button className="ml-2">Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Second Dialog: Display Mentor Details */}
      <Dialog open={isSecondDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Top Mentor Match</DialogTitle>
          </DialogHeader>
          {mentorDetails ? (
            <Card className="mt-8 bg-white rounded-xl shadow-md">
              <CardHeader>
                <CardTitle>{mentorDetails.name || 'No name provided'}</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl">{mentorDetails.name || 'No name provided'}</h3>
                <p className="text-sm text-gray-600">
                  Expertise: {mentorDetails.expertise?.join(', ') || 'No expertise listed'}
                </p>
                <p className="mt-2">Email: {mentorDetails.contact_email || 'No email provided'}</p>
                <p className="mt-2">
                  Availability: {mentorDetails.availability?.join(', ') || 'No availability listed'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center mt-8">
              <p>Loading mentor details...</p>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <Button className="ml-2" onClick={() => setIsSecondDialogOpen(false)}>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
          </section>
          <section id="metrics" className="space-y-6">
      <h2 className="text-3xl font-bold">Metrics</h2>

      {/* Filter Dropdown */}
      <div className="flex items-center space-x-4">
        <label htmlFor="filter" className="text-lg font-medium">
          Filter by Type:
        </label>
        <select
          id="filter"
          value={selectedType}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          {Object.keys(workshopData).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Bar Chart */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>Attendance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={barChartData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>Feedback Score</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={lineChartData} options={chartOptions} />
        </CardContent>
      </Card>
    </section>
        </div>
      </ScrollArea>
    </div>
  );
}
