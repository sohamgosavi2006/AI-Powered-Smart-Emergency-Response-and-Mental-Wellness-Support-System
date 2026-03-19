// src/lib/astar.ts
import { NODES, GRAPH, SERVICE_TARGETS } from "./graph";
import { SearchResult, AnimFrame } from "@/types";

function dist(a: string, b: string) {
  const na = NODES[a], nb = NODES[b];
  return Math.abs(na.x - nb.x) + Math.abs(na.y - nb.y);
}

class MinHeap {
  data: { id: string; f: number }[] = [];
  push(item: { id: string; f: number }) {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }
  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0 && last) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  _bubbleUp(i: number) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.data[p].f <= this.data[i].f) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  _sinkDown(i: number) {
    const n = this.data.length;
    while (true) {
      let m = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.data[l].f < this.data[m].f) m = l;
      if (r < n && this.data[r].f < this.data[m].f) m = r;
      if (m === i) break;
      [this.data[m], this.data[i]] = [this.data[i], this.data[m]];
      i = m;
    }
  }
  get size() {
    return this.data.length;
  }
}

export function runAStar(source: string, service: string): SearchResult {
  const targets = SERVICE_TARGETS[service] || [];
  let bestGoal = "", bestCost = Infinity, bestPath: string[] = [];
  let totalNodesExplored = 0;
  let bestFrames: AnimFrame[] = [];

  for (const t of targets) {
    const gScore: Record<string, number> = {};
    const fScore: Record<string, number> = {};
    const cameFrom: Record<string, string> = {};
    const closedSet = new Set<string>();
    const pq = new MinHeap();
    const frames: AnimFrame[] = [];

    Object.keys(NODES).forEach((id) => {
      gScore[id] = Infinity;
      fScore[id] = Infinity;
    });

    gScore[source] = 0;
    fScore[source] = dist(source, t);
    pq.push({ id: source, f: fScore[source] });
    let explored = 0;

    while (pq.size > 0) {
      const cur = pq.pop();
      if (!cur) break;
      const u = cur.id;

      if (closedSet.has(u)) continue;
      closedSet.add(u);
      explored++;

      frames.push({
        open: pq.data.map((x) => x.id),
        closed: Array.from(closedSet),
        current: u,
      });

      if (u === t) {
        const path: string[] = [];
        let node: string | undefined = t;
        while (node) {
          path.unshift(node);
          node = cameFrom[node];
        }
        if (gScore[t] < bestCost) {
          bestCost = gScore[t];
          bestGoal = t;
          bestPath = path;
          totalNodesExplored = explored;
          bestFrames = frames;
        }
        break;
      }

      for (const edge of GRAPH[u] || []) {
        if (closedSet.has(edge.to)) continue;
        const tentG = gScore[u] + edge.w;
        if (tentG < gScore[edge.to]) {
          cameFrom[edge.to] = u;
          gScore[edge.to] = tentG;
          fScore[edge.to] = tentG + dist(edge.to, t) * 10;
          pq.push({ id: edge.to, f: fScore[edge.to] });
        }
      }
    }
  }

  return {
    path: bestPath,
    cost: bestCost,
    goal: bestGoal,
    frames: bestFrames,
    nodesExplored: totalNodesExplored,
  };
}

export function runBFS(source: string, service: string): SearchResult {
  const targets = new Set(SERVICE_TARGETS[service] || []);
  const visited = new Set<string>([source]);
  const cameFrom: Record<string, string> = {};
  const queue: string[] = [source];
  const frames: AnimFrame[] = [];
  let nodesExplored = 0;

  while (queue.length > 0) {
    const u = queue.shift()!;
    nodesExplored++;
    
    frames.push({
      open: [...queue],
      closed: Array.from(visited),
      current: u,
    });

    if (targets.has(u)) {
      const path: string[] = [];
      let node: string | undefined = u;
      while (node) {
        path.unshift(node);
        node = cameFrom[node];
      }
      
      let cost = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const edge = GRAPH[path[i]].find((e) => e.to === path[i + 1]);
        if (edge) cost += edge.w;
      }
      
      return { path, cost, goal: u, frames, nodesExplored };
    }

    for (const edge of GRAPH[u] || []) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        cameFrom[edge.to] = u;
        queue.push(edge.to);
      }
    }
  }

  return { path: [], cost: Infinity, goal: "", frames, nodesExplored };
}
