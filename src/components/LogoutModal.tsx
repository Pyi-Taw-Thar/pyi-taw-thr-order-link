import { LogOut, X } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <LogOut className="w-8 h-8 text-red-500" />
          </div>

          {/* Title and Message */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">Logout (ပြန်ထွက်မယ်)</h3>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
            အကောင့်ထဲမှ ပြန်ထွက်မှာ သေချာပါသလား? <br />
            ပြန်ဝင်ရန် ဖုန်းနံပါတ်လိုအပ်ပါမည်။
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col w-full space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-lg hover:bg-red-600 active:scale-[0.98] transition-all"
            >
              ထွက်မယ်
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold text-lg hover:bg-gray-100 active:scale-[0.98] transition-all"
            >
              မထွက်တော့ပါ
            </button>
          </div>
        </div>

        {/* Close Button UI (Optional) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
