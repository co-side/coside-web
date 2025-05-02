'use client'
import { QueryClientProvider as Provider } from '@tanstack/react-query'
import { ReactQueryDevtools} from '@tanstack/react-query-devtools'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { getQueryClient } from '@/libs/queryClient'
import { IS_DEV } from '@/constant'

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <Provider client={queryClient}>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
      {IS_DEV && <ReactQueryDevtools />}
    </Provider>
  )
}
