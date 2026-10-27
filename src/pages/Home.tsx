import HeroBanner from '../components/HeroBanner';
import SubCategorySection from '../components/SubCategorySection';
import LimitedSaleSection from '../components/LimitedSaleSection';
import SearchHeader from '../components/SearchHeader';

export default function Home() {
  return (
    <div>
      {/* Home မှ တိုက်ရိုက် ရှာဖွေနိုင်ရန် (/search သို့ ပို့) */}
      <SearchHeader />
      <HeroBanner />
      <SubCategorySection />
      <LimitedSaleSection />
    </div>
  );
}
