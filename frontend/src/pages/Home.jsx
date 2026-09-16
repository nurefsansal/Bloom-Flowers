import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Categories from '../components/Categories';
import Campaign from '../components/Campaign';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';

function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Campaign />
      <About />
      <Gallery />
      <Contact />
    </div>
  );
}

export default Home;