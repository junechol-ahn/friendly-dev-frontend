import type { Route } from './+types/details'
import type { Project, StrapiProject } from '~/types'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router'
import { env } from '~/config/env'



export async function loader({
  request,
  params,
}: Route.LoaderArgs) {
  const res = await fetch(`${env.apiUrl}/projects/${params.id}?populate=*`)

  if (!res.ok) throw new Response('Project not found', { status: 404 })

  const json = await res.json()
  const project: StrapiProject = json.data

  return project
}

const ProjectDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  const project = loaderData
  const imgUrl = project.image ? `${env.strapiUrl}${project.image.url}` : '/images/no-image.png'
  return <>
    <Link to='/projects' className='flex items-center text-blue-400 hover:text-blue-500 mb-6 transition'>
      <FaArrowLeft className='mr-2'/> Back to Projects
    </Link>
    <div className="grid gap-8 md:grid-cols-2 items-start">
      <div>

      <img src={imgUrl} alt={project.title} className='w-full rounded-lg shadow-md' />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-blue-400 mb-4">
          {project.title}
        </h1>
        <p className="text-gray-300 text-sm mb-4">
          {new Date(project.date).toLocaleDateString('ko-KR', { timeZone: 'UTC' })} • {project.category}
        </p>
        <p className="text-gray-200 mb-6">{project.description}</p>
        <a href={project.url} target='_blank' className='inline-flex gap-2 items-center text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition'>
          <span> View Live Site </span><FaArrowRight />
        </a>
      </div>
    </div>
  </>
}
export default ProjectDetailsPage
