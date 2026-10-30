import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const InstallBanner: React.FC = () => {
  const { isInstallable, installApp } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('pwa_prompt_dismissed') === 'true';
  });

  // အကယ်၍ install မလုပ်နိုင်သေးလျှင် သို့မဟုတ် dismiss လုပ်ထားလျှင် မပြပါ
  if (!isInstallable || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    await installApp();
  };

  return (
    <aside
      aria-label="App installation banner"
      className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white rounded-2xl p-4 shadow-2xl border border-blue-100 flex items-center justify-between gap-3.5 backdrop-blur-md bg-white/95">
        {/* App Icon / Logo */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#014E9C] to-[#007FFF] flex items-center justify-center shrink-0 shadow-md text-white p-1">
          <img
            src="/pwa-192x192.png"
            alt="Pyi Taw Thar"
            className="w-full h-full object-contain rounded-lg"
            onError={(e) => {
              // fallback icon if image fails to load
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <Smartphone className="w-6 h-6 hidden only:block" />
        </div>

        {/* Info Text */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 leading-tight truncate">
            Pyi Taw Thar App
          </h4>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            Home Screen တွင် ထည့်သွင်းပြီး အမြန်မှာယူပါ
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#007FFF] hover:bg-[#014E9C] active:scale-95 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close install banner"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default InstallBanner;
