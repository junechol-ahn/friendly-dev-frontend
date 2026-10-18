const AboutPage = () => {
  return (
    <div className='max-w-5xl mx-auto px-6 py-16 bg-gray-900'>
      {/**intro */}
      <div className='flex flex-col md:flex-row mb:items-start items-center gap-10 mb-12'>
        <img
          src='/images/profile.jpg'
          alt='profile'
          className='w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md'
        />
        <div>
          <h1 className='text-3xl font-bold text-white mb-8 text-center'>
            Hey, I'm Brad 👏
          </h1>
          <p className="text-gray-300 text-lg">
            I am passionate about building useful web experiences and making
            complex ideas easier to understand. I enjoy exploring new
            technologies, solving everyday problems, and sharing what I learn
            along the way. This space brings together my projects, experiments,
            and thoughts as I continue growing as a developer, one step at a time.
          </p>
        </div>
      </div>
      {/** bio */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">My Mission</h2>
        <p className="text-gray-300 leading-relaxed">
          My goal is to create accessible, practical web applications that help
          people, while continuously improving my skills, sharing knowledge, and
          turning meaningful ideas into thoughtful digital experiences through
          consistent learning.
        </p>
      </div>
      {/** tech stack */}
      <h2 className="text-2xl font-semibold text-white mb-4">
        🚀 Tech I Use
      </h2>
      <ul className="flex flex-wrap gap-4 text-sm text-gray-300">
        {[
          'HTML', 
          'CSS', 
          'JavaScript', 
          'TypeScript', 
          'React', 
          'React Router', 
          'Tailwind CSS', 
          'Node.js', 
          'PostgreSQL', 
          'Git'
          ].map(tech => (<li key={tech} className="bg-gray-700 px-3 py-1 rounded-md">{tech}</li>))
          }
      </ul>
    </div>
  )
}
export default AboutPage
