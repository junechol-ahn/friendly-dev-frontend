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
  

  return <>
    Home Page
  </>
}
