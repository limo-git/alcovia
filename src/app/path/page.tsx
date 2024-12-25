"use client";

import { useState, useEffect } from "react";

// Interfaces for the API response
interface Workshop {
  _id: string;
  title: string;
  description: string;
}

interface Task {
  description: string;
}

interface Mentor {
  name: string;
}

interface Recommendations {
  workshops: Workshop[];
  task?: Task;
  mentor?: Mentor;
}

interface DashboardProps {
  studentId: string;
  name: string;
  email: string;
}

export default function Dashboard({ name, email }: DashboardProps) {
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/recom", {
          method: "POST", // Use POST request
          headers: {
            "Content-Type": "application/json", // Indicate that we're sending JSON
          },
          body: JSON.stringify({ name, email }), // Send the studentId, name, and email in the request body as JSON
        });

        if (!response.ok) throw new Error("Failed to fetch recommendations");
        const data: Recommendations = await response.json();
        setRecommendations(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message); // Safe handling of the error message
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchRecommendations();
  }, [ name, email]); // Dependency array will include these values

  // Show error message if something goes wrong
  if (error) return <p className="error">Error: {error}</p>;

  // Show loading state if recommendations are not yet available
  if (!recommendations) return <p className="loading">Loading...</p>;

  return (
    <div className="dashboard">
      <h1>Your Personalized Learning Path</h1>

      {/* Workshops Section */}
      <section>
        <h2>Recommended Workshops</h2>
        {recommendations.workshops.length > 0 ? (
          recommendations.workshops.map((workshop) => (
            <div key={workshop._id} className="workshop-card">
              <h3>{workshop.title}</h3>
              <p>{workshop.description}</p>
            </div>
          ))
        ) : (
          <p>No workshops recommended at the moment.</p>
        )}
      </section>

      {/* Task Section */}
      <section>
        <h2>Daily Task</h2>
        {recommendations.task ? (
          <div className="task-card">
            <p>{recommendations.task.description}</p>
            <button className="complete-task-btn">Complete Task</button>
          </div>
        ) : (
          <p>No task for today.</p>
        )}
      </section>

      {/* Mentor Section */}
      <section>
        <h2>Matched Mentor</h2>
        {recommendations.mentor ? (
          <div className="mentor-card">
            <p>{recommendations.mentor.name}</p>
            <button className="contact-mentor-btn">Contact Mentor</button>
          </div>
        ) : (
          <p>No mentor matched yet.</p>
        )}
      </section>
    </div>
  );
}
