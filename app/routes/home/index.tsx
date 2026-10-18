import Hero from '~/components/Hero'
import type { Route } from './+types/index'
import { useEffect } from 'react'
import FeaturedProjects from '~/components/FeaturedProjects'
import type { PostMeta, Project } from '~/types'
import { env } from '~/config/env'
import AboutPreview from '~/components/AboutPreview'
import LatestPost from '~/components/LatestPost'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'The Friendly Dev | Home' },
    { name: 'description', content: 'Custom website development' },
  ]
}

type HomePageLoadResult = {
  projects: Project[],
  posts: PostMeta[]
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<HomePageLoadResult> {
  const url = new URL(request.url)
  const [projectRes, postRes] = await Promise.all([
    fetch(`${env.apiUrl}/projects`),
    fetch(new URL('/posts-meta.json', url))
  ])

  if (!projectRes.ok || !postRes.ok) {
    throw new Error('Failed to fetch projects or posts')
  }

  const [projects, posts] = await Promise.all([
    projectRes.json(),
    postRes.json()
  ])

  return { projects: projects, posts: posts }
}

const HomePage = ({loaderData}: Route.ComponentProps) => {
  const { projects, posts } = loaderData



  return (
    <>
      <FeaturedProjects projects={projects} count={2}/>
      <AboutPreview/>
      <LatestPost posts={posts}/>
    </>
  )
}

export default HomePage
