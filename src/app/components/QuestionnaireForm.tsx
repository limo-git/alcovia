import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

interface QuestionnaireFormProps {
  onSubmit: (
    strengths: string[],
    weaknesses: string[],
    preferences: { learning_style: string; preferred_topics: string[] }, // Update to an object
    availability: string[],
    learningStyle: string,
    preferredTopics: string[]
  ) => void;
}


const initialOptions = {
  strengths: ["Problem Solving", "Communication", "Creativity", "Leadership", "Technical Skills"],
  weaknesses: ["Time Management", "Public Speaking", "Writing", "Teamwork", "Analytical Thinking"],
  preferences: ["Group Projects", "Individual Work", "Hands-on Learning", "Theoretical Learning", "Mentorship"],
  availability: ["Morning", "Afternoon", "Evening"],
  learningStyles: ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"],
  topics: ["Data Science", "Web Development", "Machine Learning", "AI", "Blockchain"]
};

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [options, setOptions] = useState(initialOptions);
  const [selected, setSelected] = useState<Record<string, string[]>>({
    strengths: [],
    weaknesses: [],
    preferences: [],
    availability: [],
    learningStyles: [],
    topics: []
  });
  const [newOption, setNewOption] = useState<Record<string, string>>({
    strengths: "",
    weaknesses: "",
    preferences: "",
    availability: "",
    learningStyles: "",
    topics: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      selected.strengths,
      selected.weaknesses,
      { learning_style: selected.learningStyles[0], preferred_topics: selected.topics }, // Correct format for preferences
      selected.availability,
      selected.learningStyles[0], // Assuming one learning style
      selected.topics
    );
  };
  
  const toggleOption = (category: keyof typeof options, option: string) => {
    setSelected((prev) => ({
      ...prev,
      [category]: prev[category].includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...prev[category], option]
    }));
  };

  const addCustomOption = (category: keyof typeof options) => {
    if (newOption[category].trim()) {
      setOptions((prev) => ({
        ...prev,
        [category]: [...prev[category], newOption[category].trim()]
      }));
      setSelected((prev) => ({
        ...prev,
        [category]: [...prev[category], newOption[category].trim()]
      }));
      setNewOption((prev) => ({ ...prev, [category]: "" }));
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6">Please tell us more about yourself</h2>

      {/* Strengths, Weaknesses, and Preferences */}
      {(Object.keys(options) as Array<keyof typeof options>).map((category, categoryIndex) => (
        <motion.div
          key={category}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
        >
          <h3 className="text-xl font-semibold capitalize">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {options[category].map((option, index) => (
              <motion.button
                key={option}
                type="button"
                onClick={() => toggleOption(category, option)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selected[category].includes(option)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 + categoryIndex * 0.1 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder={`Add custom ${category.slice(0, -1)}`}
              value={newOption[category]}
              onChange={(e) =>
                setNewOption((prev) => ({ ...prev, [category]: e.target.value }))
              }
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => addCustomOption(category)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button type="submit" className="w-full">
          Generate Learning Path
        </Button>
      </motion.div>
    </motion.form>
  );
}
