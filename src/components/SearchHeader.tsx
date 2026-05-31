import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchHeader() {
  const navigate = useNavigate();
  return (
    <div className="px-4 py-4 sticky top-16 z-40">
      <div
        onClick={() => navigate("/search")}
        className="relative max-w-2xl mx-auto cursor-text"
      >
        <div className="w-full bg-[#f8f9fa] border border-gray-200 rounded-full py-3 px-6 pr-12 text-sm text-gray-400">
          ဆေးဝါးနှင့်ကျန်းမာရေးပစ္စည်းများ ရှာဖွေရန်
        </div>
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
}
