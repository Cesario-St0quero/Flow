"use client";

import Loading from "@/components/Loading/Loading";
import { containerVariant } from "@/lib/framer-motion/variants";
import { AppRoutes } from "@/lib/utils/constants/AppRoutes";
import { getSingleflowFn, updateflowFn } from "@/lib/utils/constants/queryFns";
import { Flow } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { MdAccessTime } from "react-icons/md";

export default function UpdateflowPage() {
  const [title, setTitle] = useState("");
  const [importance, setImportance] = useState("");
  const [acaoTempo, setAcaoTempo] = useState<"nada" | "iniciar" | "parar">(
    "nada"
  );
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data, isLoading: valuesLoading } = useQuery<Flow>({
    queryKey: ["singleflow", id],
    queryFn: () => getSingleflowFn(id),
  });

  const updateflowMutation = useMutation({
    //@ts-ignore
    mutationFn: updateflowFn,
    onMutate: async (newflow) => {
      await queryClient.cancelQueries({ queryKey: ["flows"] });
      const previousflows = queryClient.getQueryData<Flow[]>(["flows"]);
      if (previousflows) {
        const updatedflows: Flow[] = [...previousflows].map((flow) =>
          flow.id === newflow.id
            ? {
                ...flow,
                ...newflow,
                startTime: newflow.startTime
                  ? new Date(newflow.startTime)
                  : null,
                endTime: newflow.endTime ? new Date(newflow.endTime) : null,
              }
            : flow
        );
        queryClient.setQueryData<Flow[]>(["flows"], updatedflows);
      }
      return { previousflows };
    },
    onError: (
      err,
      variables,
      context: { previousflows?: Flow[] | undefined }
    ) => {
      queryClient.setQueryData<Flow[]>(["flows"], context.previousflows);
    },
    onSuccess: () => {
      router.push(AppRoutes.Home);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
      queryClient.invalidateQueries({ queryKey: ["singleflow", id] });
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title === "" || importance === "") return;

    let startTime = data?.startTime ? new Date(data.startTime) : null;
    let endTime = null;
    let tempoTotal = data?.tempoTotal || 0;

    if (acaoTempo === "iniciar" && !startTime) {
      startTime = new Date();
    }

    if (acaoTempo === "parar" && data?.startTime) {
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - new Date(data.startTime).getTime()) / 1000
      );
      tempoTotal += diffInSeconds;
      startTime = null;
      endTime = now;
    }

    updateflowMutation.mutate({
      id: Number(id),
      title,
      importance,
      complete: data?.complete!,
      startTime: startTime?.toISOString() || null,
      endTime: endTime?.toISOString() || null,
      tempoTotal,
    });
  }

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setImportance(data.importance);
    }
  }, [data]);

  if (valuesLoading)
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loading />
      </div>
    );
  if (!data) throw notFound();

  const totalSegundos = data?.tempoTotal || 0;
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center"
    >
      <h3 className="text-2xl mb-4">Editar Tarefa</h3>

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 flex-col sm:w-2/3 md:w-1/3"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="input-primary"
        />

        <select
          value={importance}
          onChange={(e) => setImportance(e.target.value)}
          className="select-primary"
        >
          <option value="" disabled>
            Selecione a importância
          </option>
          <option value="important">Importante</option>
          <option value="not-important">Não Importante</option>
        </select>

        <label className="text-base text-black flex items-center gap-1 mt-2">
          Gerenciar Início e Fim da Contagem de Tempo
        </label>

        <select
          value={acaoTempo}
          onChange={(e) =>
            setAcaoTempo(e.target.value as "nada" | "iniciar" | "parar")
          }
          className="select-primary"
        >
          <option value="nada">Nenhuma ação</option>
          <option value="iniciar" disabled={!!data?.startTime}>
            Iniciar contagem
          </option>
          <option value="parar" disabled={!data?.startTime}>
            Parar contagem
          </option>
        </select>

        <div className="text-base text-gray-600 space-y-1">
          <p>
            <span className="inline-flex items-center gap-1">
              <MdAccessTime className="text-emerald-700" />
              <span className="font-medium text-emerald-700">
                {String(horas).padStart(2, "0")}h{" "}
                {String(minutos).padStart(2, "0")}m{" "}
                {String(segundos).padStart(2, "0")}s
              </span>
              Tempo Acumulado
            </span>
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Link href=".." className="btn-primary">
            Cancelar
          </Link>
          <button
            disabled={updateflowMutation.isLoading}
            type="submit"
            className="btn-primary"
          >
            {updateflowMutation.isLoading ? "Salvando..." : "Editar"}
          </button>
        </div>
      </form>
    </motion.section>
  );
}
