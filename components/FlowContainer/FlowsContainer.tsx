"use client";
import { getflowsFn } from "@/lib/utils/constants/queryFns";
import { Flow } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import FlowItem from "../FlowItem/FlowItem";

export default function FlowsContainer() {
  const { data, isLoading } = useQuery<Flow[]>({
    queryKey: ["flows"],
    queryFn: getflowsFn,
  });

  if (isLoading)
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loading />
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <p className="text-center text-h3">
          Tudo limpo por aqui... Que tal adicionar sua primeira tarefa?
        </p>
      </div>
    );

  return (
    <ul className="w-full md:w-2/3">
      {data.map((flow: Flow) => (
        <FlowItem
          key={flow.id}
          id={flow.id}
          title={flow.title}
          complete={flow.complete}
          importance={flow.importance}
          startTime={flow.startTime}
          endTime={flow.endTime}
          tempoTotal={flow.tempoTotal}
        />
      ))}
    </ul>
  );
}
