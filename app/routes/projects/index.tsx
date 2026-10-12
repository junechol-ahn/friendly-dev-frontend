import ProjectCard from '~/components/ProjectCard'
import type { Route } from './+types'
import type { Project } from '~/types'

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  const res = await fetch('http://localhost:8000/projects')
  const data = await res.json()

  return { projects: data }
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const { projects } = loaderData
  console.log(projects)

  return (
    <>
      <h2 className='text-3xl text-white font-bold mb-8 text-center'>
        🚀 Projects
      </h2>
      <div className='grid gap-6 sm:grid-cols-2'>
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </>
  )
}
export default ProjectsPage
