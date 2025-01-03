'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PersonalInfoForm from './components/PersonalInfoForm';
import QuestionnaireForm from './components/QuestionnaireForm';
import { Dashboard } from './components/Dashboard';
import { Spinner } from '@/components/ui/spinner';

interface Task {
  taskName: string;
  description: string;
  category: string;
  priority: string;
  timeOfDay: string;
  duration: string;
}
  interface Mentor {
  _id: string; 
  name: string;
  expertise: string[]; 
  contact_email: string; 
  availability: string[]; 
  avatar:string;
  score:string;
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
  image:string;
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    strengths: [] as string[],
    weaknesses: [] as string[],
    preferences: { learning_style: '', preferred_topics: [] } as { learning_style: string; preferred_topics: string[] },
    interests: [] as string[],
    availability: [] as string[],
  });
  const [mentors,setMentors] = useState<Mentor[] | null>(null);
  const [recommendedTask, setRecommendedTask] = useState<string | null>(null);
  const [recommendedActivity, setRecommendedActivity] = useState<Activity[] | null>(null);
  const [recommendedWorkshop, setRecommendedWorkshop] = useState<Workshop[] | null>(null);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    console.log('Updated Recommended Task:', recommendedTask);
  }, [recommendedTask]);
  

  const fetchActivityRecommendation = async (email: string) => {
    setLoading(true); // Set loading before starting API call
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok && result.recommendedActivities) {
        setRecommendedActivity(result.recommendedActivities); // Set recommended activities
      } else {
        console.error('No activity recommendations found.');
        setRecommendedActivity(null); // Set recommendedActivity to null if no results
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false); // Ensure loading is stopped after the API call
    }
  };

  const fetchTaskRecommendation = async (email: string) => {
    setLoading(true); // Set loading before starting API call
    try {
      const response = await fetch('/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok && result.recommendedTasks) {
        setRecommendedTask(result.recommendedTasks);
      } else {
        console.error('No task recommendations found.');
        setRecommendedTask(null);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false); // Ensure loading is stopped after the API call
    }
  };
  const fetchMentors = async () => {
    setLoading(true); // Set loading before the API call
    try {
      const response = await fetch('/api/mentors', {
        method: 'GET', 
      });
  
      const result = await response.json();
      console.log('API Response:', result);
      setMentors(result.data);
  
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false); // Ensure loading is stopped after the API call
    }
  };
  

  const fetchWorkshopRecommendation = async (email: string) => {
    setLoading(true); // Set loading before starting API call
    try {
      const response = await fetch('/api/workshop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok && result.recommendedWorkshops) {
        setRecommendedWorkshop(result.recommendedWorkshops); // Set recommended workshops
      } else {
        console.error('No workshop recommendations found.');
        setRecommendedWorkshop(null); // Set recommendedWorkshop to null if no results
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false); // Ensure loading is stopped after the API call
    }
  };

  const handlePersonalInfoSubmit = async (name: string, email: string) => {
    setUserData({ ...userData, name, email });
    setLoading(true); 
          setStep(2);
   
      setLoading(false); 
    
  };const handleQuestionnaireSubmit = async (
    strengths: string[],
    weaknesses: string[],
    preferences: { learning_style: string; preferred_topics: string[] }, // Update the type here
    availability: string[]
  ) => {
    setLoading(true); 
    await fetchMentors();
  
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          strengths,
          weaknesses,
          preferences, // preferences now has the correct structure
          availability, // availability is now included
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Data saved:', result);
        setUserData({
          ...userData,
          strengths,
          weaknesses,
          preferences,
          availability, // Update availability in userData
        });
        await fetchTaskRecommendation(userData.email); // Wait for task recommendation
        await fetchActivityRecommendation(userData.email); // Fetch activity recommendations
        await fetchWorkshopRecommendation(userData.email); // Fetch workshop recommendations
        await fetchMentors();
        setStep(3);
      } else {
        console.error('Error:', result);
        alert('An error occurred while saving data. Please try again later.');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <AnimatePresence mode="wait">
        {step < 3 && !loading && (
          <motion.div
            key="forms"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <motion.h1
              className="text-3xl font-bold mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Sign In
            </motion.h1>
            {step === 1 && <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />}
            {step === 2 && <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} />}
          </motion.div>
        )}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center h-screen"
          >
            <Spinner/>
          </motion.div>
        )}
        {step === 3 && !loading && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
            
          >
            <Dashboard
              userData={userData}
              recommendedActivities={recommendedActivity}
              recommendedTasks={recommendedTask}
              recommendedWorkshops={recommendedWorkshop || null}
              mentors={mentors}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
