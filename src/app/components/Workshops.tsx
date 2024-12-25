"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

interface Workshop {
  workshopName: string;
  description: string;
  date: string;
  duration: string;
  difficultyLevel: string;
}

export function InfiniteMovingCardsDemo({ recommendedWorkshops }: { recommendedWorkshops: Workshop[] }) {
  
  const workshopsData = recommendedWorkshops.map((workshop) => ({
    title: workshop.workshopName,
    mentor: "Unknown Mentor", 
    description: workshop.description,
    image: "/images/img1.jpg", 
  }));

  return (
    <section id="workshops" className="space-y-6">
      <h2 className="text-3xl font-bold">Upcoming Workshops</h2>
      <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={workshopsData}
          direction="right"
          speed="fast"
        />
      </div>
    </section>
  );
}
