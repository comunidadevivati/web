import { createFileRoute } from '@tanstack/react-router'

const HomePage = () => {
  return <h1>Comunidade Viva</h1>
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
