import ProjectCard from '~/components/ProjectCard'
import type { Route } from './+types'
import type { Project, StrapiProject, StrapiResponse } from '~/types'
import { use, useState } from 'react'
import Pagination from '~/components/Pagination'
import { AnimatePresence, motion } from 'framer-motion'
import { env } from '~/config/env'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'The Friendly Dev | Projects' },
    { name: 'description', content: 'My website project portfolio' },
  ]
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  const res = await fetch(new URL('/api/projects?populate=*', env.apiUrl))
  const json: StrapiResponse<StrapiProject> = await res.json()

  const projects = json.data.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    description: item.description,
    image: item.image?.url ? item.image.url : '/images/no-image.png',
    url: item.url,
    date: item.date,
    category: item.category,
    featured: item.featured,
  }))

  return { projects }
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 5

  const { projects } = loaderData

  // get unique categories
  const categories = [
    'All',
    ...new Set(projects.map((project) => project.category)),
  ]

  // filter project based on the category
  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === selectedCategory)

  // calculate total pages
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)

  // get current pages projects
  const indexOfLast = currentPage * projectsPerPage
  const indexOfFirst = indexOfLast - projectsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast)

  return (
    <>
      <h2 className='text-3xl text-white font-bold mb-8 text-center'>
        🚀 Projects
      </h2>
      <div className='flex flex-wrap gap-2 mb-8'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category)
              setCurrentPage(1)
            }}
            className={`px-3 py-1 rounded text-sm cursor-pointer ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <AnimatePresence mode='wait'>
        <motion.div className='grid gap-6 sm:grid-cols-2'>
          {currentProjects.map((project) => (
            <motion.div key={project.id} layout>
              <ProjectCard project={project} key={project.id} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
}
export default ProjectsPage
