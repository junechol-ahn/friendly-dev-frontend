import Hero from '~/components/Hero'
import type { Route } from './+types/index'
import { useEffect } from 'react'
import FeaturedProjects from '~/components/FeaturedProjects'
import type { PostMeta, Project, StrapiPost, StrapiProject } from '~/types'
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
  const [strapiProjectRes, strapiPostRes] = await Promise.all([
    fetch(`${env.apiUrl}/projects?populate=*`),
    fetch(new URL('/api/posts?populate=*', env.strapiUrl))
  ])

  if (!strapiProjectRes.ok || !strapiPostRes.ok) {
    throw new Error('Failed to fetch projects or posts')
  }

  const [strapiProjects, strapiPosts] 
  : [ 
    strapiProjects:{data:StrapiProject[]}, 
    strapiPosts:{data:StrapiPost[]}
  ] = await Promise.all([
    strapiProjectRes.json(),
    strapiPostRes.json()
  ])
  
  const projects = strapiProjects.data.map((sp:StrapiProject)=>({
    id: sp.id,
    documentId: sp.documentId,
    title: sp.title,
    description: sp.description,
    image: sp.image?.url ? sp.image.url : '/images/no-image.png',
    url: sp.url,
    date: sp.date,
    category: sp.category,
    featured: sp.featured,
  }))

  const posts:PostMeta[] = strapiPosts.data.map((sp)=>({
    ...sp,
    image: sp.image ? sp.image.url : '/images/no-image.png' 
  }))


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
