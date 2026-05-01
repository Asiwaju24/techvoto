import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { Spinner, SkeletonCard } from '../components/Feedback'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'

const SIDEBAR_NAV = [
  { icon:'🏠', label:'Dashboard',      id:'dashboard' },
  { icon:'📚', label:'My Courses',      id:'courses' },
  { icon:'🏆', label:'Certifications',  id:'certs' },
  { icon:'🤝', label:'Mentors',         id:'mentors' },
  { icon:'🔬', label:'Labs',             id:'labs' },
  { icon:'👥', label:'Community',       id:'community' },
  { icon:'⚙️', label:'Settings',        id:'settings' },
]

export default function LMSPage() {
  const { user, logout } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [completing, setCompleting] = useState(null)

  // API Data Hooks
  const { data: enrollments, loading: enrLoading, refetch: refetchEnr } = useFetch('/courses/my-courses/')
  const { data: myCerts,     loading: certLoading } = useFetch('/certifications/mine/')
  const { data: mySessions,  loading: sessLoading } = useFetch('/mentorship/my-sessions/')

  const name = user?.first_name || user?.username || 'Learner'

  const handleLessonComplete = useCallback(async (courseSlug, lessonId) => {
    if (!courseSlug || !lessonId) return
    setCompleting(lessonId)
    try {
      await api.post(`/courses/${courseSlug}/lessons/${lessonId}/complete/`)
      await refetchEnr() 
    } catch (err) {
      console.error("Completion error:", err)
      alert(err.response?.data?.detail || 'Could not mark lesson complete.')
    } finally {
      setCompleting(null)
    }
  }, [refetchEnr])

  // XP level calculation - Added safety for 0 values
  const xp       = user?.xp || 0
  const level    = Math.floor(xp / 500) + 1
  const levelXP  = (level - 1) * 500
  const nextXP   = level * 500
  const xpPct    = Math.min(Math.round(((xp - levelXP) / 500) * 100), 100)

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div style={{display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'100vh'}}>

          {/* ── Sidebar ── */}
          <aside style={{background:'var(--bg2)', borderRight:'1px solid var(--border)',
                         padding:'1.5rem 1rem', position:'sticky', top:'var(--nav-h)',
                         height:'calc(100vh - var(--nav-h))', overflowY:'auto',
                         display:'flex', flexDirection:'column', gap:'0.3rem'}}>
            <div style={{marginBottom:'1.2rem'}}>
              <div style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',
                           color:'var(--text-dim)',padding:'0 0.5rem',marginBottom:'0.5rem'}}>Navigation</div>
              {SIDEBAR_NAV.map(n => (
                <button key={n.id} onClick={() => setActive(n.id)}
                  style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.65rem 0.75rem',
                          borderRadius:'var(--radius)',fontSize:'0.88rem',fontWeight:500,
                          color:active===n.id?'var(--accent)':'var(--text-muted)',cursor:'pointer',
                          transition:'all var(--transition)',width:'100%',textAlign:'left',
                          fontFamily:'DM Sans,sans-serif',
                          border:active===n.id?'1px solid rgba(79,140,255,0.2)':'1px solid transparent',
                          background:active===n.id?'rgba(79,140,255,0.12)':'none'}}>
                  <span style={{fontSize:'1rem',width:'20px',textAlign:'center'}}>{n.icon}</span>
                  {n.label}
                  {n.id==='courses' && !enrLoading && enrollments?.length > 0 && (
                    <span style={{marginLeft:'auto',background:'var(--accent)',color:'#fff',
                                  borderRadius:'50px',padding:'0.1rem 0.4rem',fontSize:'0.7rem',fontWeight:700}}>
                      {enrollments.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div style={{marginTop:'auto',padding:'0.8rem',background:'var(--surface)',
                         borderRadius:'var(--radius)',border:'1px solid var(--border)',
                         display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <div className="avatar avatar-sm">{name[0]?.toUpperCase()}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'0.85rem',fontWeight:600,overflow:'hidden',
                             textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {user?.full_name || name}
                </div>
                <div style={{fontSize:'0.72rem',color:'var(--accent)',textTransform:'capitalize'}}>
                  {user?.plan || 'Free'} Plan · Level {level}
                </div>
              </div>
              <button onClick={logout}
                style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',
                        fontSize:'0.85rem',padding:'0.2rem 0.4rem',borderRadius:'4px'}}
                title="Logout">↩</button>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main style={{padding:'2rem 2.5rem 3rem', overflowX:'hidden'}}>

            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',
                         gap:'1rem',marginBottom:'2rem',flexWrap:'wrap'}}>
              <div>
                <h1 style={{fontSize:'1.7rem',letterSpacing:'-0.5px',marginBottom:'0.2rem'}}>
                  Welcome back, {name} 👋
                </h1>
                <p style={{fontSize:'0.88rem',color:'var(--text-muted)'}}>
                  {user?.streak > 0
                    ? `🔥 ${user.streak}-day learning streak — keep it going!`
                    : "Start a lesson today to build your streak."}
                </p>
              </div>
              <Link to="/courses" className="btn btn-primary btn-sm">+ Browse Courses</Link>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'1rem',marginBottom:'2rem'}}>
              {[
                { label:'Enrolled',      value: enrLoading  ? '…' : (enrollments?.length ?? 0),                    sub:'courses active' },
                { label:'XP Points',      value: xp.toLocaleString(),                                                sub:`Level ${level}` },
                { label:'Streak',         value: `${user?.streak ?? 0}d`,                                            sub:'consecutive days 🔥' },
                { label:'Certs Issued',   value: certLoading ? '…' : (myCerts?.filter(c=>c.is_issued).length ?? 0), sub:'verified & on-chain' },
              ].map((s,i) => (
                <div key={i} style={{background:'var(--card-bg)',border:'1px solid var(--border)',
                                      borderRadius:'var(--radius)',padding:'1.2rem',backdropFilter:'blur(10px)'}}>
                  <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginBottom:'0.5rem'}}>{s.label}</div>
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.8rem',fontWeight:800,lineHeight:1,color:'var(--text)'}}>{s.value}</div>
                  <div style={{fontSize:'0.75rem',color:'var(--text-dim)',marginTop:'0.3rem'}}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1.5rem'}}>

              {/* ── Continue Learning ── */}
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                  <h2 style={{fontSize:'1rem',fontWeight:700}}>Continue Learning</h2>
                  <Link to="/courses" style={{fontSize:'0.82rem',color:'var(--accent)'}}>Browse More →</Link>
                </div>

                {enrLoading ? (
                  <div style={{display:'flex',flexDirection:'column',gap:'0.8rem'}}>
                    {[...Array(3)].map((_,i) => <SkeletonCard key={i} height={90}/>)}
                  </div>
                ) : !enrollments || enrollments.length === 0 ? (
                  <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',
                               borderRadius:'var(--radius)',padding:'2rem',textAlign:'center',
                               backdropFilter:'blur(10px)'}}>
                    <div style={{fontSize:'2rem',marginBottom:'0.8rem'}}>📚</div>
                    <p style={{fontSize:'0.88rem',color:'var(--text-muted)',marginBottom:'1rem'}}>
                      You haven't enrolled in any courses yet.
                    </p>
                    <Link to="/courses" className="btn btn-primary btn-sm">Browse Courses</Link>
                  </div>
                ) : (
                  enrollments.map(enr => (
                    <div key={enr.id} style={{marginBottom:'0.8rem'}}>
                      <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',
                                   borderRadius:expandedCourse===enr.id ? 'var(--radius) var(--radius) 0 0' : 'var(--radius)',
                                   padding:'1rem 1.2rem', display:'flex',alignItems:'center',gap:'1rem',
                                   transition:'all var(--transition)',backdropFilter:'blur(10px)',cursor:'pointer'}}
                        onClick={() => setExpandedCourse(expandedCourse===enr.id ? null : enr.id)}
                      >
                        <div style={{width:'52px',height:'52px',borderRadius:'10px',flexShrink:0,
                                     display:'flex',alignItems:'center',justifyContent:'center',
                                     fontSize:'1.4rem',background:'var(--surface2)'}}>
                          {enr.course?.emoji || '📚'}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:'0.9rem',marginBottom:'0.25rem',
                                       overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                            {enr.course?.title}
                          </div>
                          <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:'0.4rem'}}>
                            {enr.course?.category?.name} · {enr.progress_pct}% complete
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{width:`${enr.progress_pct}%`}}/>
                          </div>
                        </div>
                        <button className="btn btn-primary btn-sm" style={{flexShrink:0}}>
                          {expandedCourse===enr.id ? 'Close' : 'View'}
                        </button>
                      </div>

                      {expandedCourse === enr.id && (
                        <div style={{background:'var(--surface)',border:'1px solid var(--border)',
                                     borderTop:'none',borderRadius:'0 0 var(--radius) var(--radius)',
                                     padding:'0.8rem'}}>
                          {enr.course?.lessons?.length > 0 ? enr.course.lessons.slice(0, 10).map(lesson => (
                            <div key={lesson.id} style={{display:'flex',alignItems:'center',gap:'0.8rem', padding:'0.6rem', borderBottom:'1px solid var(--border)'}}>
                              <span style={{flex:1,fontSize:'0.82rem'}}>{lesson.title}</span>
                              <button
                                className="btn btn-sm"
                                style={{padding:'0.2rem 0.6rem',fontSize:'0.7rem', background:'var(--gradient)',color:'#fff'}}
                                disabled={completing===lesson.id}
                                onClick={(e) => { e.stopPropagation(); handleLessonComplete(enr.course.slug, lesson.id)}}
                              >
                                {completing===lesson.id ? '…' : '+50 XP'}
                              </button>
                            </div>
                          )) : <p style={{fontSize:'0.8rem', padding:'1rem'}}>No lessons available yet.</p>}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* ── Right column ── */}
              <div>
                <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',
                             borderRadius:'var(--radius)',padding:'1.2rem',backdropFilter:'blur(10px)',marginBottom:'1.2rem'}}>
                  <h3 style={{fontSize:'0.9rem',fontWeight:700,marginBottom:'1rem'}}>⚡ XP Progress</h3>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem',marginBottom:'0.4rem'}}>
                    <span>Level {level}</span>
                    <span>{xp}/{nextXP} XP</span>
                  </div>
                  <div className="progress-track" style={{height:'8px'}}>
                    <div className="progress-fill" style={{width:`${xpPct}%`,background:'var(--gradient2)'}}/>
                  </div>
                </div>

                {/* Certifications */}
                <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',
                             borderRadius:'var(--radius)',padding:'1.2rem',backdropFilter:'blur(10px)',marginBottom:'1.2rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                    <h3 style={{fontSize:'0.9rem',fontWeight:700}}>🏆 Certifications</h3>
                  </div>
                  {certLoading ? <Spinner size={20}/> : (myCerts?.length > 0 ? myCerts.map(c => (
                    <div key={c.id} style={{display:'flex',alignItems:'center',gap:'0.8rem', marginBottom:'0.8rem'}}>
                       <span style={{fontSize:'1.2rem'}}>{c.certification?.emoji || '🏆'}</span>
                       <div style={{fontSize:'0.82rem'}}>{c.certification?.name}</div>
                    </div>
                  )) : <p style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>No certs yet.</p>)}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}