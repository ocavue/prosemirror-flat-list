import dynamic from 'next/dynamic'

export const Editor = dynamic(
  import('./editor').then((module) => module.Editor),
  {
    loading: () => null,
    ssr: false,
  },
)
