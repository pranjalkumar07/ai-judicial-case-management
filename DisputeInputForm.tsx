import React, { useState } from 'react';
import { Upload, Sparkles, Check } from 'lucide-react';
import { Spinner } from './Spinner';
import { useTranslations } from '../hooks/useTranslations';

interface DisputeInputFormProps {
  onAnalyze: (disputeText: string) => void;
  isLoading: boolean;
}

export const DisputeInputForm: React.FC<DisputeInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [disputeText, setDisputeText] = useState('');
  const [fileName, setFileName] = useState('');
  const t = useTranslations();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setDisputeText(text);
        setFileName(file.name);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file.");
      setFileName('');
    }
    event.target.value = '';
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAnalyze(disputeText);
  };

  return (
    <div className="glass p-8 rounded-3xl shadow-premium border border-theme-border mb-10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--primary)] to-[var(--accent)]"></div>
      
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-theme-foreground">{t.disputeInput.title}</h2>
          <p className="text-theme-muted mt-2 leading-relaxed max-w-2xl">
            {t.disputeInput.description}
          </p>
        </div>
        <div className="hidden sm:flex p-3 bg-[var(--secondary)] rounded-2xl text-[var(--primary)]">
          <Sparkles className="w-8 h-8" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <textarea
            value={disputeText}
            onChange={(e) => setDisputeText(e.target.value)}
            placeholder={t.disputeInput.placeholder}
            className="w-full h-56 p-5 border border-theme-border rounded-2xl focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent outline-none transition-all duration-300 bg-theme-background text-theme-foreground resize-none placeholder:text-slate-400"
            disabled={isLoading}
          />
          <div className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[var(--primary)] transition-colors">
            {disputeText.length} characters
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <label className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 bg-[var(--secondary)] text-[var(--secondary-foreground)] font-bold rounded-xl cursor-pointer hover:bg-theme-border transition-all active:scale-95">
            <Upload className="w-5 h-5" />
            <span className="text-sm">{fileName ? t.disputeInput.uploading.replace('{fileName}', fileName) : t.disputeInput.upload}</span>
            <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" disabled={isLoading} />
          </label>
          <button
            type="submit"
            disabled={isLoading || !disputeText.trim()}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-[var(--primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {isLoading ? <><Spinner /> {t.disputeInput.analyzing}</> : <><Sparkles className="w-5 h-5" /> {t.disputeInput.analyze}</>}
          </button>
        </div>
      </form>
      
      <div className="mt-10 pt-6 border-t border-theme-border">
        <div className="flex items-center gap-3 text-xs text-theme-muted">
          <div className="p-1.5 bg-green-500/10 rounded-lg text-green-500">
            <Check className="h-4 w-4" />
          </div>
          <p>
            <span className="font-bold text-theme-foreground">{t.disputeInput.privacy}</span> {t.disputeInput.privacyDetails}
          </p>
        </div>
      </div>
    </div>
  );
};