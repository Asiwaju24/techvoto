import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">Techvoto</div>
          <p>The Smart Way For Students to Break Into Tech</p>
          <div className="footer-socials">
            <a className="social-icon" href="https://x.com/Techvotos" target="_blank" rel="noreferrer" title="Twitter">𝕏</a>
            <a className="social-icon" href="#" title="LinkedIn">in</a>
            <a className="social-icon" href="#" title="GitHub">⌥</a>
            <a className="social-icon" href="#" title="YouTube">▶</a>
          </div>
        </div>

        <div className="footer-col">
          <h5>Product</h5>
          <ul>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/certifications">Certifications</Link></li>
            <li><Link to="/mentorship">Mentorship</Link></li>
            <li><Link to="/labs">Labs</Link></li>
            <li><Link to="/enterprise">Enterprise</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Community</h5>
          <ul>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/careers">Careers</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Legal</h5>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Techvoto, Inc. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
