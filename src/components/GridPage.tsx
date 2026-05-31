import { ArrowLeft } from "lucide-react";
import SearchHeader from "./SearchHeader";
import GridButton from "./GridButton";

interface GridPageProps {
  title: string;
  items: string[];
  onSelect: (item: string) => void;
  loading?: boolean;
  loadingText?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  actionButton?: { label: string; onClick: () => void };
  subtitle?: string;
}

export default function GridPage({
  title,
  items,
  onSelect,
  loading,
  loadingText,
  showBackButton,
  onBack,
  actionButton,
  subtitle,
}: GridPageProps) {
  return (
    <div className="bg-[#f8f9fa] container mx-auto min-h-screen pb-20 font-ChivoMono">
      <SearchHeader />
      <div className="px-4 py-6 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {showBackButton && (
                <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h1 className="text-[14px] md:text-2xl font-bold text-primary">{title}</h1>
              {actionButton && (
                <button
                  onClick={actionButton.onClick}
                  className="border border-primary text-primary px-3 py-1 rounded-full text-[8px] md:text-[12px] font-bold hover:bg-blue-50 transition-colors"
                >
                  {actionButton.label}
                </button>
              )}
            </div>
            {subtitle && (
              <p className="text-gray-500 text-[10px] ml-10">{subtitle}</p>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-primary font-bold animate-pulse">
              {loadingText || "Loading..."}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, index) => (
              <GridButton
                key={item}
                label={item}
                onClick={() => onSelect(item)}
                animationDelay={index * 50}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
