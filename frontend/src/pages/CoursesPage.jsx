import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { Spinner, SkeletonCard, ErrorMessage } from '../components/Feedback'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function CoursesPage() {
  const { user } = useAuth()

  // Filters (sent to Django as query params)
  const [search,  setSearch]  = useState('')
  const [level,   setLevel]   = useState('')
  const [price,   setPrice]   = useState('')
  const [catSlug, setCatSlug] = useState('')

  // API data
  const [courses,    setCourses]    = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  // Enroll state
  const [enrolling, setEnrolling] = useState(null)   // slug of course being enrolled
  const [enrolled,  setEnrolled]  = useState(new Set()) // slugs already enrolled

  // Fetch categories once on mount
  useEffect(() => {
    api.get('/courses/categories/')
      .then(r => setCategories(r.data?.results ?? r.data))
      .catch(() => {})
  }, [])

  // Fetch courses whenever any filter changes (debounced for search)
  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (search)  params.search   = search
      if (level)   params.level    = level
      if (price)   params.price    = price
      if (catSlug) params.category = catSlug
      const res = await api.get('/courses/', { params })
      setCourses(res.data?.results ?? res.data)
    } catch {
      setError('Could not load courses. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [search, level, price, catSlug])

  // Debounce search input by 400ms; fire immediately on other filter changes
  useEffect(() => {
    const timer = setTimeout(fetchCourses, search ? 400 : 0)
    return () => clearTimeout(timer)
  }, [fetchCourses])

  // Load my enrolled courses so we can show enrolled state
  useEffect(() => {
    if (!user) return
    api.get('/courses/my-courses/')
      .then(r => {
        const data = r.data?.results ?? r.data
        setEnrolled(new Set(data.map(e => e.course?.slug)))
      })
      .catch(() => {})
  }, [user])

  const handleEnroll = async (course) => {
    if (!user) { window.location.href = '/signup'; return }
    setEnrolling(course.slug)
    try {
      await api.post(`/courses/${course.slug}/enroll/`)
      setEnrolled(prev => new Set([...prev, course.slug]))
    } catch (err) {
      alert(err.response?.data?.detail || 'Enrolment failed.')
    } finally {
      setEnrolling(null)
    }
  }

  const levelColor = { beginner:'badge-green', intermediate:'badge-blue', advanced:'badge-red' }

  return (
    <Layout>
      {/* Hero */}
      <div style={{background:'var(--bg2)',borderBottom:'1px solid var(--border)',padding:'60px 5% 50px',textAlign:'center'}}>
        <div className="section-tag">Courses</div>
        <h1 style={{fontSize:'clamp(2rem,4vw,3.2rem)',letterSpacing:'-1.5px',marginBottom:'0.8rem'}}>
          Learn Skills That <span className="grad-text">Actually Get You Hired</span>
        </h1>
        <p style={{color:'var(--text-muted)',maxWidth:'500px',margin:'0 auto 2rem'}}>
          Industry-aligned courses built by practitioners, not academics.
        </p>

        {/* Search bar */}
        <div style={{display:'flex',maxWidth:'560px',margin:'0 auto',gap:'0.5rem'}}>
          <input
            style={{flex:1,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',
                    padding:'0.75rem 1.2rem',fontFamily:'DM Sans,sans-serif',fontSize:'0.9rem',color:'var(--text)',outline:'none'}}
            placeholder="Search courses, skills, topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchCourses}>Search</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:'2rem',maxWidth:'1280px',margin:'0 auto',padding:'2.5rem 5%'}}>
        {/* Sidebar filters */}
        <aside style={{position:'sticky',top:'calc(var(--nav-h) + 1rem)',alignSelf:'start'}}>
          {/* Level */}
          <div style={{marginBottom:'1.5rem'}}>
            <div style={{fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'0.7rem'}}>Level</div>
            {['beginner','intermediate','advanced'].map(l => (
              <label key={l} style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.3rem 0',cursor:'pointer'}}>
                <input type="radio" name="level" value={l} checked={level===l}
                  onChange={() => setLevel(lv => lv===l ? '' : l)}
                  style={{accentColor:'var(--accent)'}}/>
                <span style={{fontSize:'0.85rem',color:'var(--text-muted)',textTransform:'capitalize'}}>{l}</span>
              </label>
            ))}
            {level && <button className="btn btn-ghost btn-sm" style={{fontSize:'0.75rem',padding:'0.2rem 0.5rem'}} onClick={()=>setLevel('')}>Clear</button>}
          </div>

          {/* Price */}
          <div style={{marginBottom:'1.5rem'}}>
            <div style={{fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'0.7rem'}}>Price</div>
            {['free','pro'].map(p => (
              <label key={p} style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.3rem 0',cursor:'pointer'}}>
                <input type="radio" name="price" value={p} checked={price===p}
                  onChange={() => setPrice(pv => pv===p ? '' : p)}
                  style={{accentColor:'var(--accent)'}}/>
                <span style={{fontSize:'0.85rem',color:'var(--text-muted)',textTransform:'capitalize'}}>{p}</span>
              </label>
            ))}
            {price && <button className="btn btn-ghost btn-sm" style={{fontSize:'0.75rem',padding:'0.2rem 0.5rem'}} onClick={()=>setPrice('')}>Clear</button>}
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div>
              <div style={{fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'0.7rem'}}>Category</div>
              {categories.map(c => (
                <label key={c.slug} style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.3rem 0',cursor:'pointer'}}>
                  <input type="radio" name="cat" value={c.slug} checked={catSlug===c.slug}
                    onChange={() => setCatSlug(cv => cv===c.slug ? '' : c.slug)}
                    style={{accentColor:'var(--accent)'}}/>
                  <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{c.icon} {c.name}</span>
                </label>
              ))}
              {catSlug && <button className="btn btn-ghost btn-sm" style={{fontSize:'0.75rem',padding:'0.2rem 0.5rem'}} onClick={()=>setCatSlug('')}>Clear</button>}
            </div>
          )}
        </aside>

        {/* Main content */}
        <div>
          <div style={{fontSize:'0.88rem',color:'var(--text-muted)',marginBottom:'1.5rem'}}>
            {loading ? 'Loading…' : `${courses.length} course${courses.length !== 1 ? 's' : ''} found`}
          </div>

          {loading && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.2rem'}}>
              {[...Array(6)].map((_,i) => <SkeletonCard key={i} height={300}/>)}
            </div>
          )}

          {!loading && error && <ErrorMessage message={error} onRetry={fetchCourses}/>}

          {!loading && !error && courses.length === 0 && (
            <div style={{textAlign:'center',padding:'4rem',color:'var(--text-muted)'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🔍</div>
              <p>No courses match your filters. Try adjusting them.</p>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.2rem'}}>
              {courses.map(course => {
                const isEnrolled  = enrolled.has(course.slug)
                const isEnrolling = enrolling === course.slug
                return (
                  <div key={course.id}
                    style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',
                            overflow:'hidden',transition:'all var(--transition)',backdropFilter:'blur(10px)'}}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.boxShadow='var(--glow)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='' }}
                  >
                    {/* Thumbnail */}
                    <div style={{height:'150px',display:'flex',alignItems:'center',justifyContent:'center',
                                 fontSize:'3rem',position:'relative',background:'var(--surface2)'}}>
                      {course.emoji || '📚'}
                      <span className={`badge ${levelColor[course.level] || 'badge-blue'}`}
                            style={{position:'absolute',top:'0.8rem',left:'0.8rem',textTransform:'capitalize'}}>
                        {course.level}
                      </span>
                    </div>

                    {/* Body */}
                    <div style={{padding:'1.1rem 1.2rem'}}>
                      <div style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',
                                   color:'var(--accent)',marginBottom:'0.4rem'}}>
                        {course.category?.name || 'Course'}
                      </div>
                      <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.97rem',
                                   marginBottom:'0.5rem',lineHeight:1.3}}>
                        {course.title}
                      </div>
                      <p style={{fontSize:'0.8rem',color:'var(--text-muted)',lineHeight:1.55,marginBottom:'0.9rem',
                                 overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                        {course.description}
                      </p>

                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                                   paddingTop:'0.8rem',borderTop:'1px solid var(--border)',marginBottom:'0.8rem'}}>
                        <span style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>
                          {course.avg_rating ? `⭐ ${course.avg_rating}` : '⭐ New'} · {course.duration_hours}h
                        </span>
                        <span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1rem',
                                      color:course.price_tier==='free'?'var(--accent3)':'var(--accent2)',
                                      textTransform:'capitalize'}}>
                          {course.price_tier}
                        </span>
                      </div>

                      <button
                        className={`btn btn-full btn-sm ${isEnrolled ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => !isEnrolled && handleEnroll(course)}
                        disabled={isEnrolling || isEnrolled}
                      >
                        {isEnrolling ? 'Enrolling…' : isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
