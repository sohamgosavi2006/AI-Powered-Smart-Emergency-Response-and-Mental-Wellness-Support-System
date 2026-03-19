import { GraphNode, GraphEdge } from "@/types";

export const NODES: Record<string, GraphNode> = {
  n1: { label: "Central Park",    x: 0.50, y: 0.50, type: "area",     icon: "🌳" },
  n2: { label: "Market District", x: 0.10, y: 0.35, type: "area",     icon: "🏪" },
  n3: { label: "University Zone", x: 0.88, y: 0.25, type: "area",     icon: "🎓" },
  n4: { label: "Residential A",   x: 0.20, y: 0.85, type: "area",     icon: "🏠" },
  n5: { label: "Residential B",   x: 0.80, y: 0.75, type: "area",     icon: "🏠" },
  n6: { label: "Tech Hub",        x: 0.55, y: 0.15, type: "area",     icon: "💻" },
  n7: { label: "Old Town",        x: 0.08, y: 0.65, type: "area",     icon: "🏛️" },
  n8: { label: "Harbor Point",    x: 0.92, y: 0.55, type: "area",     icon: "⚓" },
  h1: { label: "City Hospital",   x: 0.35, y: 0.20, type: "hospital", icon: "🏥" },
  h2: { label: "East Medical Ctr",x: 0.85, y: 0.12, type: "hospital", icon: "🏥" },
  p1: { label: "Central Police",  x: 0.12, y: 0.15, type: "police",   icon: "🚔" },
  p2: { label: "East Precinct",   x: 0.90, y: 0.92, type: "police",   icon: "🚔" },
  f1: { label: "Fire Station 1",  x: 0.65, y: 0.35, type: "fire",     icon: "🚒" },
  f2: { label: "Fire Station 2",  x: 0.15, y: 0.95, type: "fire",     icon: "🚒" },
};

export const EDGES_RAW: [string, string, number][] = [
  ["n1","n2",5],["n1","n4",4],["n1","n5",4],["n1","f1",3],
  ["n1","h1",6],["n1","n6",7],["n1","n3",8],
  ["n2","n7",3],["n2","h1",4],["n2","p1",3],["n2","n4",5],
  ["n3","n6",4],["n3","h2",5],["n3","n8",6],["n3","f1",7],
  ["n4","n7",4],["n4","f2",5],["n4","h1",7],
  ["n5","n8",4],["n5","p2",3],["n5","f1",5],
  ["n6","f1",4],["n6","h1",6],["n6","h2",7],
  ["n7","p1",4],["n7","f2",6],
  ["n8","h2",4],["n8","p2",5],
  ["h1","p1",5],["h1","f1",4],
  ["h2","f1",8],["f1","p1",9],
  ["p1","f2",7],["p2","f2",6],
];

// Build adjacency list
export const GRAPH: Record<string, { to: string; w: number }[]> = {};
Object.keys(NODES).forEach((id) => (GRAPH[id] = []));
EDGES_RAW.forEach(([a, b, w]) => {
  GRAPH[a].push({ to: b, w });
  GRAPH[b].push({ to: a, w });
});

export const SERVICE_TARGETS: Record<string, string[]> = {
  ambulance: ["h1", "h2"],
  police:    ["p1", "p2"],
  fire:      ["f1", "f2"],
};
