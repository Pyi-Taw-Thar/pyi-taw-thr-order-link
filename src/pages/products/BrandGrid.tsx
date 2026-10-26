import GridPage from "../../components/GridPage";

interface BrandGridProps {
  brands: string[];
  onSelect: (brand: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  subtitle?: string;
}

export default function BrandGrid({
  brands,
  onSelect,
  showBackButton = false,
  onBack,
  subtitle,
}: BrandGridProps) {
  return (
    <GridPage
      title="ဆေးအမှတ်တံဆိပ်များ"
      items={brands}
      onSelect={onSelect}
      showBackButton={showBackButton}
      onBack={onBack}
      subtitle={subtitle || `အမှတ်တံဆိပ် ${brands.length} ခု`}
    />
  );
}
