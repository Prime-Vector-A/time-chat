export interface EthicalGuideline {
  id: string;
  category: "prohibited" | "encouraged";
  title: string;
  description: string;
}

export const defaultGuidelines: EthicalGuideline[] = [
  // Prohibited Content
  {
    id: "violence",
    category: "prohibited",
    title: "Graphic or Extreme Violence",
    description: "No graphic descriptions of violence or extreme harm"
  },
  {
    id: "hate",
    category: "prohibited", 
    title: "Hate Speech",
    description: "No racism, sexism, or identity-based hate"
  },
  {
    id: "profanity",
    category: "prohibited",
    title: "Profanity",
    description: "No profanity or crude slang"
  },
  {
    id: "romantic",
    category: "prohibited",
    title: "Inappropriate Content",
    description: "No romantic/sexual content or innuendo"
  },
  {
    id: "political",
    category: "prohibited",
    title: "Partisan Politics",
    description: "No partisan political endorsement"
  },
  {
    id: "harmful",
    category: "prohibited",
    title: "Harmful Content",
    description: "No calls for real-world rebellion, self-harm, or conspiracy content"
  },
  // Encouraged Content
  {
    id: "respectful",
    category: "encouraged",
    title: "Respectful Conversations",
    description: "Respectful, meaningful conversations"
  },
  {
    id: "wisdom",
    category: "encouraged",
    title: "Guidance & Wisdom",
    description: "Thoughtful guidance, wisdom, and storytelling"
  },
  {
    id: "historical",
    category: "encouraged",
    title: "Historical Context",
    description: "Honest historical context with moral reflection, not glorification"
  },
  {
    id: "appropriate",
    category: "encouraged",
    title: "Age-Appropriate Language",
    description: "Language and tone suitable for teen audiences and older"
  }
];

export const getProhibitedGuidelines = () => defaultGuidelines.filter(g => g.category === "prohibited");
export const getEncouragedGuidelines = () => defaultGuidelines.filter(g => g.category === "encouraged");