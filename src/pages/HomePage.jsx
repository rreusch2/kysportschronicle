import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import ArticleFeed from '../components/ArticleFeed'
import About from '../components/About'
import Contact from '../components/Contact'
import Subscribe from '../components/Subscribe'
import Footer from '../components/Footer'

const HomePage = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'articles', 'about', 'contact', 'subscribe']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        activeSection={activeSection} 
        scrollToSection={scrollToSection}
      />
      
      <main>
        <section id="home">
          <Hero scrollToSection={scrollToSection} />
        </section>
        
        <section id="articles">
          <ArticleFeed />
        </section>
        
        <section id="about">
          <About />
        </section>
        
        <section id="contact">
          <Contact />
        </section>
        
        <section id="subscribe">
          <Subscribe />
        </section>
      </main>
      
      <Footer scrollToSection={scrollToSection} />
    </div>
  )
}

export default HomePage
