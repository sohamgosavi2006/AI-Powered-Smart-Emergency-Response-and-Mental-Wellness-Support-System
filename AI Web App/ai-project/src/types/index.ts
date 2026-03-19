// City graph types
export interface GraphNode {
  label: string;
  x: number; // 0-1 normalized
  y: number;
  type: "area" | "hospital" | "police" | "fire";
  icon: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number; // km
}

export type ServiceType = "ambulance" | "police" | "fire";
export type AlgorithmType = "astar" | "bfs";

export interface SearchResult {
  path: string[];
  cost: number;
  goal: string;
  nodesExplored: number;
  frames: AnimFrame[];
}

export interface AnimFrame {
  open: string[];
  closed: string[];
  current: string;
}

// Chat types
export interface ChatMessageType {
  id: string;
  role: "user" | "assistant";
  content: string;
  sentimentScore?: number;
  emotionLabel?: string;
  isCrisis?: boolean;
  timestamp: Date;
}

export interface SentimentResult {
  score: number;
  isCrisis: boolean;
  topics: string[];
  emotionLabel: string;
}
