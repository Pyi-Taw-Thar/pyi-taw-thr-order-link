import GridPage from "../../components/GridPage";

interface BrandGridProps {
  brands: string[];
  onSelect: (brand: string) => void;
}

export default function BrandGrid({ brands, onSelect }: BrandGridProps) {
  return <GridPage title="ဆေးအမှတ်တံဆိပ်များ" items={brands} onSelect={onSelect} />;
}
