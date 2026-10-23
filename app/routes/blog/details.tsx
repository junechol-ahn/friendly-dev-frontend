import ReactMarkdown from 'react-markdown'
import type { Route } from './+types/details'
import type { PostMeta, StrapiPost, StrapiResponse } from '~/types'
import { Link } from 'react-router'
import { env } from '~/config/env'

export async function loader({ request, params }: Route.LoaderArgs) {
  const { documentId } = params

  const url = new URL(`/api/posts/${documentId}?populate=*`, env.apiUrl)
  const res = await fetch(url.href)

  if (!res.ok) throw new Error('Failed to fetch data')

  const json = await res.json()
  const sp: StrapiPost = json.data
  const post: PostMeta = {
    id: sp.id,
    documentId: sp.documentId,
    slug: sp.slug,
    title: sp.title,
    excerpt: sp.excerpt,
    date: sp.date,
    body: sp.body,
    image: sp.image ? sp.image.url : '/images/no-image.png',
  }

  return {
    post,
  }
}

const BlogDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  const { post } = loaderData
  return (
    <div className='max-w-3xl mx-auto px-6 py-12 bg-gray-900'>
      <h1 className='text-3xl font-bold text-blue-400 mb-2'>{post.title}</h1>
      <p className='text-sm text-gray-400 mb-6'>
        {new Date(post.date).toLocaleDateString('ko-KR', { timeZone: 'UTC' })}
      </p>
      <div className='prose prose-invert max-w-none mb-12'>
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className='w-full h-48 object-cover rounded mb-4'
          />
        )}
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>
      <Link
        to='/blog'
        className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
      >
        Back To Posts
      </Link>
    </div>
  )
}
export default BlogDetailsPage
