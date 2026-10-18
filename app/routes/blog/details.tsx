import ReactMarkdown from 'react-markdown'
import type { Route } from './+types/details'
import type { PostMeta } from '~/types'
import { Link } from 'react-router'

export async function loader({ request, params }: Route.LoaderArgs) {
  const { slug } = params

  const url = new URL('/posts-meta.json', request.url)
  const res = await fetch(url.href)

  if (!res.ok) throw new Error('Failed to fetch data')

  const index = await res.json()

  const postMeta = index.find((post: PostMeta) => post.slug === slug)

  if (!postMeta) throw new Response('Not Found', { status: 404 })

  const markdown = await import(`../../posts/${slug}.md?raw`)

  return {
    postMeta,
    markdown: markdown.default,
  }

  // if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  //   throw new Response('Not Found', {status: 404})
  // }

  // const filePath = path.join(process.cwd(), 'app', 'posts', `${slug}.md`)

  // try {
  //   const content = await readFile(filePath, 'utf8')
  //   return {content}
  // } catch (error) {
  //   if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
  //     throw new Response('Not Found', {status: 404})
  //   }
  //   throw error
  // }
}

const BlogDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  const { postMeta, markdown } = loaderData
  return (
    <div className='max-w-3xl mx-auto px-6 py-12 bg-gray-900'>
      <h1 className="text-3xl font-bold text-blue-400 mb-2">
        {postMeta.title}
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        {new Date(postMeta.date).toLocaleDateString('ko-KR', { timeZone: 'UTC' })}
      </p>
      <div className="prose prose-invert max-w-none mb-12">
      <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      <Link to='/blog' className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'>Back To Posts</Link>
    </div>
  )
}
export default BlogDetailsPage
