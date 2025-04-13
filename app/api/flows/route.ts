import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Session not found", {
      status: 401,
    });
  }

  try {
    const data = await prisma.flow.findMany({
      where: { userId: Number(session.user?.id) },
      orderBy: { createdAt: "asc" },
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response("Failed to fetch", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Session not found", { status: 401 });
  }

  const { title, importance, startTime, endTime } = await req.json();

  if (!title || !importance) {
    return new Response("Dados incompletos", { status: 400 });
  }

  try {
    const data = await prisma.flow.create({
      data: {
        title,
        importance,
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        userId: Number(session.user?.id),
      },
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error("[API] Erro ao criar tarefa:", error);
    return new Response("Failed to create flow", { status: 500 });
  }
}
