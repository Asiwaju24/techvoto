import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, noFooter = false }) {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">{children}</div>
      {!noFooter && <Footer />}
    </>
  )
}
