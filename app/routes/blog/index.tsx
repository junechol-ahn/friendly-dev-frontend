import { type Route } from './+types'
import type { PostMeta, StrapiResponse, StrapiPost } from '~/types'
import PostCard from '~/components/PostCard'
import { useState } from 'react'
import Pagination from '~/components/Pagination'
import PostFilter from '~/components/PostFilter'
import { env } from '~/config/env'

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ posts: PostMeta[] }> {
  const url = new URL('/api/posts?populate=*', env.apiUrl)
  const res = await fetch(url.href)

  if (!res.ok) throw new Error('Failed to fetch data')
  const json: StrapiResponse<StrapiPost> = await res.json()

  const data: PostMeta[] = json.data.map((sp) => ({
    id: sp.id,
    documentId: sp.documentId,
    slug: sp.slug,
    title: sp.title,
    excerpt: sp.excerpt,
    date: sp.date,
    body: sp.body,
    image: sp.image ? sp.image.url : '/images/no-image.png',
  }))

  data.sort((a: PostMeta, b: PostMeta) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  return { posts: data }
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const postsPerPage = 4

  let { posts } = loaderData

  if (searchQuery.trim().length > 0) {
    const query = searchQuery.toLowerCase()
    posts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query),
    )
  }

  const totalPages = Math.ceil(posts.length / postsPerPage)
  const indexOfLast = currentPage * postsPerPage
  const indexOfFirst = indexOfLast - postsPerPage

  const currentPosts = posts.slice(indexOfFirst, indexOfLast)

  return (
    <div className='max-w-3xl mx-auto mt-10 p-6 bg-gray-900'>
      <h2 className='text-3xl text-white font-bold mb-8 text-center'>
        📝 Blog
      </h2>
      <PostFilter
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query)
          setCurrentPage(1)
        }}
      />
      <div className='space-y-8'>
        {currentPosts.length === 0 ? (
          <p className='text-gray-400 text-center'>No posts found</p>
        ) : (
          currentPosts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  )
}
export default BlogPage
