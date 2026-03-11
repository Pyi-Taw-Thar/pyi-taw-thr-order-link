import HeroBanner from '../components/HeroBanner';
import CategorySection from '../components/CategorySection';
import LimitedSaleSection from '../components/LimitedSaleSection';

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <CategorySection />
      <LimitedSaleSection />
    </div>
  );
}
