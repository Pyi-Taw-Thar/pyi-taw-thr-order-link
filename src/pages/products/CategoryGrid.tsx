import GridPage from "../../components/GridPage";

interface CategoryGridProps {
  brand: string;
  categories: string[];
  loading: boolean;
  onSelect: (category: string) => void;
  onBack: () => void;
  onChangeBrand: () => void;
}

export default function CategoryGrid({
  brand,
  categories,
  loading,
  onSelect,
  onBack,
  onChangeBrand,
}: CategoryGridProps) {
  return (
    <GridPage
      title={brand}
      items={categories}
      onSelect={onSelect}
      loading={loading}
      loadingText="အမျိုးအစားများ ရှာဖွေနေပါသည်..."
      showBackButton
      onBack={onBack}
      actionButton={{ label: "ပြောင်းမယ်", onClick: onChangeBrand }}
      subtitle={`အမျိုးအစား ${categories.length} မျိုး`}
    />
  );
}
