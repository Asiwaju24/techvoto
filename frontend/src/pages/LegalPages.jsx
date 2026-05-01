import Layout from '../components/Layout'

function LegalPage({ title, children }) {
  return (
    <Layout>
      <div style={{background:'var(--bg2)',borderBottom:'1px solid var(--border)',padding:'70px 5% 50px',textAlign:'center'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',letterSpacing:'-1.5px'}}>{title}</h1>
        <p style={{color:'var(--text-muted)',marginTop:'0.5rem'}}>Last updated: January 1, 2025</p>
      </div>
      <div style={{maxWidth:'760px',margin:'0 auto',padding:'3rem 5%',color:'var(--text-muted)',lineHeight:1.9,fontSize:'0.9rem'}}>
        {children}
      </div>
    </Layout>
  )
}

const S = ({ title }) => <h2 style={{color:'var(--text)',fontFamily:'Syne,sans-serif',fontSize:'1.1rem',marginTop:'2rem',marginBottom:'0.5rem'}}>{title}</h2>

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <S title="1. Information We Collect"/>
      <p>We collect information you provide directly to us when you create an account, enroll in a course, or contact us. This includes your name, email address, and any other information you choose to provide.</p>
      <S title="2. How We Use Your Information"/>
      <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send technical notices, and respond to your comments and questions.</p>
      <S title="3. Information Sharing"/>
      <p>We do not sell, trade, or transfer your personal information to outside parties without your consent, except as described in this policy or as required by law.</p>
      <S title="4. Data Security"/>
      <p>We implement industry-standard security measures including encrypted storage, HTTPS, and JWT authentication to protect your personal information.</p>
      <S title="5. Contact Us"/>
      <p>Questions? Email us at <a href="mailto:privacy@techvoto.com" style={{color:'var(--accent)'}}>privacy@techvoto.com</a>.</p>
    </LegalPage>
  )
}

export function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <S title="1. Acceptance of Terms"/>
      <p>By accessing and using Techvoto's services, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
      <S title="2. User Accounts"/>
      <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
      <S title="3. Acceptable Use"/>
      <p>You agree not to use the platform to distribute unauthorized content, engage in abusive behavior toward other users, or attempt to circumvent our security measures.</p>
      <S title="4. Intellectual Property"/>
      <p>Course content, certifications, and platform design are protected under applicable copyright laws. Copying or redistribution without permission is prohibited.</p>
      <S title="5. Contact"/>
      <p>Questions? Email us at <a href="mailto:legal@techvoto.com" style={{color:'var(--accent)'}}>legal@techvoto.com</a>.</p>
    </LegalPage>
  )
}
