import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Spinner, SkeletonCard, ErrorMessage } from '../components/Feedback'
import { useFetch } from '../hooks/useFetch'
import api from '../utils/api'

export default function BlogPage() {
  const [activeTag,  setActiveTag]  = useState('')
  const [email,      setEmail]      = useState('')
  const [subLoading, setSubLoading] = useState(false)
  const [subMsg,     setSubMsg]     = useState('')

  // Build query params from active tag
  const params = activeTag ? { tag: activeTag } : {}
  const { data: posts,    loading: postsLoading,  error: postsError,  refetch: refetchPosts } = useFetch('/blog/', params)
  const { data: tags,     loading: tagsLoading  } = useFetch('/blog/tags/')

  // Re-fetch when tag filter changes
  useEffect(() => {
    refetchPosts(params)
  }, [activeTag]) // eslint-disable-line

  const handleSubscribe = async () => {
    if (!email) return
    setSubLoading(true)
    setSubMsg('')
    try {
      const res = await api.post('/blog/newsletter/', { email })
      setSubMsg(res.data.detail)
      setEmail('')
    } catch (err) {
      setSubMsg(err.response?.data?.email?.[0] || 'Subscription failed.')
    } finally {
      setSubLoading(false)
    }
  }

  const featured = posts?.find(p => p.is_featured) || posts?.[0]
  const rest      = posts?.filter(p => p !== featured) || []

  return (
    <Layout>
      {/* Hero */}
      <div style={{padding:'80px 5% 60px',background:'var(--bg2)',borderBottom:'1px solid var(--border)',
                   position:'relative',overflow:'hidden'}}>
        <div className="orb" style={{width:'400px',height:'400px',top:'-100px',right:'-50px',
                                     background:'rgba(162,89,255,0.08)',filter:'blur(80px)'}}/>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'flex',justifyContent:'space-between',
                     alignItems:'flex-end',flexWrap:'wrap',gap:'2rem'}}>
          <div style={{position:'relative',zIndex:1}}>
            <div className="section-tag">Techvoto Blog</div>
            <h1 style={{fontSize:'clamp(2.2rem,4vw,3.2rem)',letterSpacing:'-1.5px'}}>
              Insights for the <span className="grad-text">Modern Tech Career</span>
            </h1>
            <p style={{color:'var(--text-muted)',fontSize:'1rem',maxWidth:'420px',lineHeight:1.7,marginTop:'0.5rem'}}>
              Deep dives on cloud, DevOps, AI/ML, career strategy, and the future of work.
            </p>
          </div>

          {/* Newsletter signup */}
          <div style={{position:'relative',zIndex:1}}>
            <p style={{fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:'0.5rem'}}>
              Weekly insights — no spam.
            </p>
            <div style={{display:'flex',gap:'0.5rem'}}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{padding:'0.7rem 1rem',borderRadius:'var(--radius)',border:'1px solid var(--border)',
                        background:'var(--surface)',fontFamily:'DM Sans,sans-serif',fontSize:'0.88rem',
                        color:'var(--text)',width:'210px',outline:'none'}}/>
              <button className="btn btn-primary" onClick={handleSubscribe} disabled={subLoading}>
                {subLoading ? '…' : 'Subscribe'}
              </button>
            </div>
            {subMsg && <p style={{fontSize:'0.78rem',color:'var(--accent3)',marginTop:'0.4rem'}}>{subMsg}</p>}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'3rem 5%',
                   display:'grid',gridTemplateColumns:'1fr 300px',gap:'3rem'}}>
        {/* Main */}
        <div>
          {postsLoading && (
            <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
              <SkeletonCard height={280}/>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.2rem'}}>
                {[...Array(4)].map((_,i) => <SkeletonCard key={i} height={220}/>)}
              </div>
            </div>
          )}

          {!postsLoading && postsError && (
            <ErrorMessage message={postsError} onRetry={() => refetchPosts(params)}/>
          )}

          {!postsLoading && !postsError && posts?.length === 0 && (
            <div style={{textAlign:'center',padding:'4rem',color:'var(--text-muted)'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>📭</div>
              <p>No posts found {activeTag && `for #${activeTag}`}. Check back soon.</p>
            </div>
          )}

          {!postsLoading && !postsError && featured && (
            <>
              {/* Featured post */}
              <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',
                           overflow:'hidden',display:'grid',gridTemplateColumns:'1.2fr 1fr',marginBottom:'2.5rem',
                           backdropFilter:'blur(10px)',transition:'all var(--transition)',cursor:'pointer'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.boxShadow='var(--glow)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow=''}}
              >
                <div style={{minHeight:'280px',display:'flex',alignItems:'center',justifyContent:'center',
                             fontSize:'4rem',background:'var(--surface2)'}}>
                  {featured.emoji || '📝'}
                </div>
                <div style={{padding:'2rem'}}>
                  <div style={{display:'flex',gap:'0.5rem',marginBottom:'1rem',flexWrap:'wrap'}}>
                    {featured.tags?.map(t => (
                      <span key={t.id} className="badge badge-blue">{t.name}</span>
                    ))}
                    <span className="badge badge-purple">Featured</span>
                  </div>
                  <h2 style={{fontSize:'1.4rem',letterSpacing:'-0.5px',marginBottom:'0.7rem',lineHeight:1.25}}>
                    {featured.title}
                  </h2>
                  <p style={{fontSize:'0.88rem',color:'var(--text-muted)',lineHeight:1.7,marginBottom:'1.2rem'}}>
                    {featured.excerpt}
                  </p>
                  <div style={{display:'flex',alignItems:'center',gap:'0.8rem',fontSize:'0.78rem',color:'var(--text-muted)'}}>
                    <div className="avatar avatar-sm">{featured.author_name?.[0] || 'T'}</div>
                    <span>{featured.author_name}</span>
                    <span>·</span>
                    <span>{featured.published_at ? new Date(featured.published_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : 'Draft'}</span>
                    <span>·</span>
                    <span>{featured.read_time} min read</span>
                  </div>
                </div>
              </div>

              {/* Post grid */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.2rem'}}>
                {rest.map(p => (
                  <div key={p.id}
                    style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',
                            overflow:'hidden',transition:'all var(--transition)',backdropFilter:'blur(10px)',cursor:'pointer'}}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='var(--accent)'}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)'}}
                  >
                    <div style={{height:'120px',display:'flex',alignItems:'center',justifyContent:'center',
                                 fontSize:'2.5rem',background:'var(--surface2)'}}>
                      {p.emoji || '📝'}
                    </div>
                    <div style={{padding:'1.2rem'}}>
                      <div style={{display:'flex',gap:'0.4rem',marginBottom:'0.6rem',flexWrap:'wrap'}}>
                        {p.tags?.map(t => (
                          <span key={t.id} className="badge badge-blue" style={{fontSize:'0.7rem'}}>{t.name}</span>
                        ))}
                      </div>
                      <h3 style={{fontFamily:'Syne,sans-serif',fontSize:'0.97rem',fontWeight:700,
                                  lineHeight:1.3,marginBottom:'0.5rem'}}>
                        {p.title}
                      </h3>
                      <p style={{fontSize:'0.8rem',color:'var(--text-muted)',lineHeight:1.55,marginBottom:'0.9rem',
                                 overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                        {p.excerpt}
                      </p>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                                   fontSize:'0.75rem',color:'var(--text-muted)',
                                   borderTop:'1px solid var(--border)',paddingTop:'0.7rem'}}>
                        <span>{p.author_name} · {p.published_at ? new Date(p.published_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : ''}</span>
                        <span style={{color:'var(--accent)'}}>{p.read_time} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{position:'sticky',top:'calc(var(--nav-h) + 1rem)',alignSelf:'start'}}>
          {/* Categories / Tags */}
          <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',
                       padding:'1.4rem',backdropFilter:'blur(10px)',marginBottom:'1.2rem'}}>
            <h3 style={{fontSize:'0.9rem',fontWeight:700,marginBottom:'1rem',
                        paddingBottom:'0.6rem',borderBottom:'1px solid var(--border)'}}>
              Tags
            </h3>
            <div style={{display:'flex',flexDirection:'column',gap:'0.3rem'}}>
              <div onClick={() => setActiveTag('')}
                style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                        padding:'0.4rem 0.5rem',borderRadius:'6px',cursor:'pointer',fontSize:'0.85rem',
                        color:activeTag===''?'var(--accent)':'var(--text-muted)',
                        background:activeTag===''?'rgba(79,140,255,0.08)':'transparent',
                        transition:'all var(--transition)'}}>
                All
                <span style={{fontSize:'0.75rem',color:'var(--text-dim)'}}>{posts?.length || 0}</span>
              </div>
              {tagsLoading ? <Spinner size={20}/> : tags?.map(t => (
                <div key={t.id} onClick={() => setActiveTag(activeTag===t.slug ? '' : t.slug)}
                  style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                          padding:'0.4rem 0.5rem',borderRadius:'6px',cursor:'pointer',fontSize:'0.85rem',
                          color:activeTag===t.slug?'var(--accent)':'var(--text-muted)',
                          background:activeTag===t.slug?'rgba(79,140,255,0.08)':'transparent',
                          transition:'all var(--transition)'}}>
                  #{t.name}
                </div>
              ))}
            </div>
          </div>

          {/* Trending (top 4 posts) */}
          {posts && posts.length > 0 && (
            <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',
                         padding:'1.4rem',backdropFilter:'blur(10px)'}}>
              <h3 style={{fontSize:'0.9rem',fontWeight:700,marginBottom:'1rem',
                          paddingBottom:'0.6rem',borderBottom:'1px solid var(--border)'}}>
                Trending
              </h3>
              <div style={{display:'flex',flexDirection:'column',gap:'0.8rem'}}>
                {posts.slice(0,4).map((p,i) => (
                  <div key={p.id} style={{display:'flex',gap:'0.8rem',fontSize:'0.82rem',cursor:'pointer',
                                          transition:'color var(--transition)'}}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'}
                    onMouseLeave={e=>e.currentTarget.style.color=''}>
                    <span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.2rem',
                                  color:'var(--text-dim)',minWidth:'24px'}}>{i+1}</span>
                    <span style={{lineHeight:1.4}}>{p.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </Layout>
  )
}
