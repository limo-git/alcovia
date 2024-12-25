"use client";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const workshops = [
    {
      title: "Web Development Bootcamp",
      mentor: "Alex Johnson",
      description: "Learn to build responsive websites using HTML, CSS, and JavaScript.",
      image: "/images/img1",
    },
    {
      title: "Data Science Fundamentals",
      mentor: "Priya Sharma",
      description: "Dive into data analysis and visualization techniques with Python.",
      image: "images/img2",
    },
    {
      title: "Cloud Computing Essentials",
      mentor: "Michael Brown",
      description: "Understand cloud infrastructure and deploy your first application.",
      image: "images/img3",
    },
    {
      title: "UX Design Workshop",
      mentor: "Sophia Lee",
      description: "Master user-centered design to create stunning user experiences.",
      image: "images/img1",
    },
    {
      title: "Cybersecurity Basics",
      mentor: "Carlos Gomez",
      description: "Identify vulnerabilities and secure your applications effectively.",
      image: "images/img2",
    },
  ];
  
  <InfiniteMovingCards items={workshops} />;
  

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={workshops}
        direction="right"
        speed="slow"
      />
    </div>
  );

}