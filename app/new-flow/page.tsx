'use client'
import { containerVariant } from '@/lib/framer-motion/variants'
import { AppRoutes } from '@/lib/utils/constants/AppRoutes'
import { createflowFn } from '@/lib/utils/constants/queryFns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function NewflowPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [importance, setImportance] = useState('')
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutateAsync: createflow } = useMutation({
    mutationFn: createflowFn,
    onSuccess: () => {
      router.push(AppRoutes.Home)
      queryClient.invalidateQueries(['flows'])
    }
  })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (title === '' || importance === '') {
      return
    }

    try {
      createflow({
        title, importance,
        startTime: '',
        endTime: ''
      })

      router.push(AppRoutes.Home)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <motion.section
      variants={containerVariant}
      initial='hidden'
      animate='visible'
      className='flex flex-col items-center w-full h-full'
    >
      <h3 className='text-2xl text-center p-3'>Criar Tarefa</h3>
      <form
        onSubmit={handleSubmit}
        className='flex gap-4 flex-col sm:w-2/3 md:w-1/3'
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type='text'
          className='input-primary'
        />
        <select
          value={importance}
          onChange={(e) => setImportance(e.target.value)}
          className='select-primary'
        >
          <option value='' disabled>
            Selecione Importância
          </option>
          <option value='important'>Important</option>
          <option value='not-important'>Not Important</option>
        </select>
        <div className='flex gap-1 justify-end'>
          <Link href='..' className='btn-primary'>
            Cancelar
          </Link>
          <button disabled={isCreating} type='submit' className='btn-primary'>
            Criar
          </button>
        </div>
      </form>
    </motion.section>
  )
}
