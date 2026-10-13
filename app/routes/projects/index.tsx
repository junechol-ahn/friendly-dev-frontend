import ProjectCard from '~/components/ProjectCard'
import type { Route } from './+types'
import type { Project } from '~/types'
import { useState } from 'react'
import Pagination from '~/components/Pagination'

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  const res = await fetch('http://localhost:8000/projects')
  const data = await res.json()

  return { projects: data }
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const { projects } = loaderData

  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 2

  // calculate total pages
  const totalPages = Math.ceil(projects.length / projectsPerPage)

  // get current pages projects
  const indexOfLast = currentPage * projectsPerPage
  const indexOfFirst = indexOfLast - projectsPerPage
  const currentProjects = projects.slice(indexOfFirst, indexOfLast)

  return (
    <>
      <h2 className='text-3xl text-white font-bold mb-8 text-center'>
        🚀 Projects
      </h2>
      <div className='grid gap-6 sm:grid-cols-2'>
        {currentProjects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
}
export default ProjectsPage
