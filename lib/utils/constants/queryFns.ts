export async function getflowsFn() {
  const res = await fetch(`/api/flows`);
  if (!res.ok) {
    console.log(res);
  } else {
    return await res.json();
  }
}

export type Newflow = {
  title: string;
  importance: string;
  startTime: string;
  endTime: string;
};

export async function createflowFn(newflow: Newflow) {
  const { title, importance, startTime, endTime } = newflow;

  try {
    const res = await fetch("/api/flows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        importance,
        startTime,
        endTime,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create flow");
    }
  } catch (err) {
    console.error("Erro ao criar tarefa:", err);
  }
}

export async function deleteflowFn(id: number) {
  try {
    const res = await fetch(`api/flows/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete flow");
    }
  } catch (err) {
    console.error(err);
  }
}

type UpdateflowTypes = {
  id: number;
  title: string;
  importance: string;
  complete: boolean;
  startTime: string | null;
  endTime: string | null;
  tempoTotal: number;
};

export async function updateflowFn(updatedFlow: {
  id: number
  title: string
  importance: string
  complete: boolean
  startTime?: string | null
  endTime?: string | null
  tempoTotal?: number
}) {
  const res = await fetch(`/api/flows/${updatedFlow.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedFlow)
  })

  if (!res.ok) {
    throw new Error('Erro ao atualizar a tarefa')
  }

  return res.json()
}


export async function getSingleflowFn(id: string) {
  const res = await fetch(`/api/flows/${id}`);

  if (!res.ok) {
    console.log(res);
  }

  return await res.json();
}
