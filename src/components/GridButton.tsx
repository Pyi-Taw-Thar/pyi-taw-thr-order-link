interface GridButtonProps {
  label: string;
  onClick: () => void;
  animationDelay?: number;
}

export default function GridButton({ label, onClick, animationDelay = 0 }: GridButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-5 h-16 md:h-16 rounded-xl bg-white border border-gray-100 shadow-sm text-primary-dark font-semibold text-[13px] md:text-[18px] hover:bg-blue-50 hover:border-blue-200 hover:scale-105 transition-all text-center min-w-[100px] md:min-w-[160px] animate-in fade-in slide-in-from-bottom duration-500 font-ChivoMono"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {label}
    </button>
  );
}
