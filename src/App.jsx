import CustomCursor from './components/ui/CustomCursor/CustomCursor'
import SmoothScroll from './components/ui/SmoothScroll/SmoothScroll'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Blog from './components/Blog/Blog'
import Contact from './components/Contact/Contact'


function App() {
  return (
    <>
      {/* CustomCursor sits outside SmoothScroll — it's fixed position */}
      <CustomCursor />

      <SmoothScroll>
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Contact />
      </SmoothScroll>
    </>
  )
}

export default App