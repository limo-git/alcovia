'use client';

import { useState , useEffect } from 'react';
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
import { motion,AnimatePresence } from "framer-motion"
import { Calendar, Clock, Briefcase, CheckCircle, XCircle  } from 'lucide-react'
import Image from "next/image";
import confetti from "canvas-confetti";
import { Progress } from '@/components/ui/progress';


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
    preferences: { learning_style: string; preferred_topics: string[] };
  };
  recommendedTasks: string | null;
  recommendedActivities:Activity[] | null;
  recommendedWorkshops:Workshop[] |null;
  mentors:Mentor[]| null;
}

interface Mentor {
  _id: string; // Mongoose document _id
  name: string;
  expertise: string[]; // Array of strings representing mentor's areas of expertise
  contact_email: string; // Mentor's contact email
  availability: string[]; // Array of strings representing mentor's availability
  avatar:string;
  score:string;
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
  const [parsedTask, setParsedTask] = useState<{ task: string; description: string; category: string } | null>(null);
  useEffect(() => {
    if (recommendedTasks) {
      try {
        // Extract JSON from the code block
        const jsonString = recommendedTasks.replace('```json\n', '').replace('\n```', '');
        const task = JSON.parse(jsonString);
        setParsedTask(task);
      } catch (error) {
        console.error('Error parsing recommended tasks:', error);
      }
    }
  }, [recommendedTasks]);


  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value as keyof typeof workshopData);
  };

  const barChartData = {
    labels: workshopData[selectedType].map((data) => data.date),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: workshopData[selectedType].map((data) => data.attendanceRate),
        backgroundColor: 'rgb(111, 143, 175)',
      },
    ],
  };

  const lineChartData = {
    labels: workshopData[selectedType].map((data) => data.date),
    datasets: [
      {
        label: 'Feedback Score',
        data: workshopData[selectedType].map((data) => data.feedbackScore),
        borderColor: 'rgb(111, 143, 175)',
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
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [progress, setProgress] = useState(0); // 
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false); 
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false); 

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMentorQuestions((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartTask = () => {
    setTaskStarted(true);
    setProgress(25); // Start with some progress (e.g., 25%)
  };

  const handleMarkCompleted = () => {
    setTaskCompleted(true);
    setProgress(100); // Set progress to 100 when completed
  
    // Trigger the confetti effect
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
  
    const frame = () => {
      if (Date.now() > end) return;
  
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
  
      requestAnimationFrame(frame);
    };
  
    frame();
  };

  const handleMarkIncomplete = () => {
    setTaskCompleted(false);
    setProgress(0); // Reset progress when marked incomplete
  };

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800 font-sans ">
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
          <motion.section
      className="w-full max-w-2xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Today&apos;s Task
      </motion.h2>

      <Card>
        <CardHeader>
          <CardTitle>{parsedTask ? parsedTask.task : "No Task Available"}</CardTitle>
          <CardDescription>{parsedTask ? parsedTask.description : "Complete the recommended task today!"}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!taskStarted ? (
              <motion.div
                key="start-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button variant="default" size="lg" onClick={handleStartTask}>
                  Start Task
                </Button>
              </motion.div>
            ) : taskCompleted ? (
              <motion.div
                key="completed"
                className="flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-green-500 font-bold">Completed</span>
              </motion.div>
            ) : (
              <motion.div
                key="in-progress"
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Progress value={progress} className="w-full" />
                <div className="flex space-x-4">
                  <Button variant="default" onClick={handleMarkCompleted}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Completed
                  </Button>
                  <Button variant="destructive" onClick={handleMarkIncomplete}>
                    <XCircle className="mr-2 h-4 w-4" /> Mark as Incomplete
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.section>
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



          <section id="workshops" className="space-y-6">
          
            <InfiniteMovingCardsDemo recommendedWorkshops={recommendedWorkshops ?? []}/>

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
                  avatar: mentor.avatar, // Add a default avatar or modify it based on mentor data
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
        <DialogTrigger asChild >
          <div className='flex justify-center items-center'>
          <Button  onClick={() => setIsFirstDialogOpen(true)} className="mt-4">Want to find your Perfect mentor?</Button>
          </div>
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
           
            <div className="flex items-center justify-center">
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden w-64 p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="relative w-32 h-32 mx-auto mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Image
                  src="/images/img2.jpg"
                  alt="Mentor avatar"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
                <motion.div
                  className="absolute inset-0 border-4 border-blue-500 rounded-full"
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </motion.div>
      
              <motion.div
                className="text-center mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="text-2xl font-bold text-gray-800">{mentorDetails.name}</div>
                <div className="text-sm text-gray-600">{mentorDetails.expertise}</div>
              </motion.div>
      
              <motion.div
                className="bg-blue-100 text-blue-800 text-xl font-bold rounded-full py-2 px-4 mb-4 mx-auto w-max"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {mentorDetails.score} 
              </motion.div>
      
              <motion.div
                className="space-y-2 mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  Available Mon, Wed, Fri
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  2:00 PM - 6:00 PM EST
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                  8 years experience
                </div>
              </motion.div>
      
              <motion.button
                className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connect with {mentorDetails.name}
              </motion.button>
            </motion.div>
          </div>
      
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
