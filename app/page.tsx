import FlowsContainer from '@/components/FlowContainer/FlowsContainer'
import Hydrate from '@/lib/tanstack-query/HydrateClient'
import getQueryClient from '@/lib/tanstack-query/getQueryClient'
import { prisma } from '@/prisma/db'
import { dehydrate } from '@tanstack/query-core'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'

async function getflowsServerFn() {
  const session = await getServerSession(authOptions)
  const flows = await prisma.flow.findMany({
    where: { userId: Number(session?.id) },
    orderBy: { createdAt: 'asc' }
  })

  return flows
}

export default async function HomePage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['flows'], getflowsServerFn)

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <FlowsContainer />
    </Hydrate>
  )
}
