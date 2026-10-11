import Hero from '~/components/Hero'
import type { Route } from './+types/index'
import { useEffect } from 'react'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'The Friendly Dev | Home' },
    { name: 'description', content: 'Custom website development' },
  ]
}

export default function Home() {
  

  return <section>
    <h2 className="text-3xl font-bold text-white mb-8 text-center">
      <Hero name='Clark'/>
    </h2>
  </section>
}
