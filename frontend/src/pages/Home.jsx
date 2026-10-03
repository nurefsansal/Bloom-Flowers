import Hero from '../components/Hero';
import Categories from '../components/Categories';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';

function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <About />
      <Gallery />
      <Contact />
    </div>
  );
}

export default Home;