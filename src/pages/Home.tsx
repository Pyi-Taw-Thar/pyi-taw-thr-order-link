import HeroBanner from '../components/HeroBanner';
import SubCategorySection from '../components/SubCategorySection';
import LimitedSaleSection from '../components/LimitedSaleSection';

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <SubCategorySection />
      <LimitedSaleSection />
    </div>
  );
}
