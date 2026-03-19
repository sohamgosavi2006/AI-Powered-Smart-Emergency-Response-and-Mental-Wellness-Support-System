import { NextResponse } from "next/server";
import { runAStar, runBFS } from "@/lib/astar";
import { prisma } from "@/lib/prisma";
import { NODES } from "@/lib/graph";

export async function POST(req: Request) {
  try {
    const { source, service, algorithm } = await req.json();

    if (!source || !service || !algorithm) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const algoFn = algorithm === "bfs" ? runBFS : runAStar;
    const result = algoFn(source, service);

    if (result.path.length > 0) {
      // Store incident in DB
      await prisma.emergencyIncident.create({
        data: {
          sourceNode: source,
          sourceLabel: NODES[source]?.label || "Unknown",
          destNode: result.goal,
          destLabel: NODES[result.goal]?.label || "Unknown",
          serviceType: service,
          algorithm: algorithm,
          distanceKm: result.cost,
          etaMinutes: Math.ceil(result.cost * 1.5),
          nodesExplored: result.nodesExplored,
          path: JSON.stringify(result.path),
        },
      });
    }

    return NextResponse.json({
      ...result,
      etaMinutes: Math.ceil(result.cost * 1.5),
    });
  } catch (error) {
    console.error("Emergency API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
