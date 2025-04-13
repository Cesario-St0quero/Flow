import { prisma } from "@/prisma/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    const data = await prisma.flow.findFirst({
      where: { id },
    });

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const { title, importance, complete, startTime, endTime, tempoTotal } =
    await req.json();

  const id = Number(params.id);

  try {
    const updateData: any = {
      title,
      importance,
      complete,
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
    };

    if (typeof tempoTotal === "number") {
      updateData.tempoTotal = tempoTotal;
    }

    const data = await prisma.flow.update({
      where: { id },
      data: updateData,
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    return new Response("Failed to update flow", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const id = Number(params.id);

  try {
    const data = await prisma.flow.delete({
      where: { id },
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response("Failed to update flow", { status: 500 });
  }
}
