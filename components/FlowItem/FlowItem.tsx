"use client";

import { flowItemVariant } from "@/lib/framer-motion/variants";
import { AppRoutes } from "@/lib/utils/constants/AppRoutes";
import { deleteflowFn, updateflowFn } from "@/lib/utils/constants/queryFns";
import { Flow } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AiFillEdit,
  AiOutlineClockCircle,
  AiOutlineDelete,
} from "react-icons/ai";

interface FlowItemProps {
  id: number;
  title: string;
  complete: boolean;
  importance: string;
  startTime: Date | string | null;
  endTime: Date | string | null;
  tempoTotal: number;
}

export default function FlowItem(props: FlowItemProps) {
  const { id, title, importance, complete, startTime, endTime, tempoTotal } =
    props;
  const [checked, setChecked] = useState(complete);
  const router = useRouter();
  const queryClient = useQueryClient();

  const horas = Math.floor(tempoTotal / 3600);
  const minutos = Math.floor((tempoTotal % 3600) / 60);
  const segundos = tempoTotal % 60;

  const deleteMutation = useMutation({
    mutationFn: deleteflowFn,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["flows"] });
      const previousflows = queryClient.getQueryData<Flow[]>(["flows"]);
      if (previousflows) {
        const updatedflows = [...previousflows].filter(
          (flow) => flow.id !== id
        );
        queryClient.setQueryData<Flow[]>(["flows"], updatedflows);
      }
      return { previousflows };
    },
    onError: (context: { previousflows?: Flow[] | undefined }) => {
      queryClient.setQueryData<Flow[]>(["flows"], context.previousflows);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });

  const { mutateAsync: updateflow, isLoading: updateLoading } = useMutation({
    mutationFn: (complete: boolean) =>
      updateflowFn({ id, title, importance, complete }),
  });

  return (
    <li
      className={`relative border-2 ${
        startTime && !endTime ? "border-green-600" : "border-black"
      } p-3 mb-2 last:mb-0 rounded flex justify-between gap-4`}
    >
      {importance === "important" && (
        <motion.div
          variants={flowItemVariant}
          initial="hidden"
          animate="visible"
          className="absolute left-0 top-0 bg-red-600 w-full h-2 rounded-t"
        />
      )}

      {startTime && !endTime && (
        <div className="absolute top-2 right-0 translate-x-40">
          <span className="text-sm bg-green-600 text-white px-2 py-0.5 rounded shadow-md">
            Em andamento
          </span>
        </div>
      )}

      <div className="flex gap-3 w-full max-w-[calc(100%-80px)] items-start">
        <input
          id={id.toString()}
          onChange={(e) => {
            setChecked(e.target.checked);
            updateflow(e.target.checked);
          }}
          type="checkbox"
          checked={checked}
          className="cursor-pointer mt-1 peer flex-shrink-0"
        />

        <div className="flex flex-col w-full peer-checked:line-through peer-checked:text-secondary">
          <div className="flex items-center gap-2 mb-1">
            <AiOutlineClockCircle size={20} />
            <span className="text-base font-semibold text-emerald-700">
              {String(horas).padStart(2, "0")}h{" "}
              {String(minutos).padStart(2, "0")}m{" "}
              {String(segundos).padStart(2, "0")}s
            </span>
          </div>

          <label
            htmlFor={id.toString()}
            className="break-all whitespace-pre-wrap w-full leading-snug"
          >
            {title}
          </label>
        </div>
      </div>

      <div className="flex flex-col items-end justify-start gap-2 flex-shrink-0">
        <button
          disabled={updateLoading}
          onClick={() => router.push(`${AppRoutes.Update}/${id}`)}
        >
          <AiFillEdit fontSize={25} className="text-yellow-300" />
        </button>
        <button onClick={() => deleteMutation.mutate(id)}>
          <AiOutlineDelete fontSize={25} className="text-red-600" />
        </button>
      </div>
    </li>
  );
}
