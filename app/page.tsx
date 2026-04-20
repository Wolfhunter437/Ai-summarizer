'use client';

import { useActionState, useRef, useEffect, useState } from 'react';
import { summarizeFile, type SummaryState } from './actions';

const initialState: SummaryState = { error: null, summary: null };

export default function Home() {
  const [state, formAction, pending] = useActionState(summarizeFile, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Optional: clear file input on successful summarize if preferred
  useEffect(() => {
    if (state.summary && !pending) {
      formRef.current?.reset();
      setSelectedFile(null);
    }
  }, [state.summary, pending]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-gray-100 font-sans selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-neutral-950 to-neutral-950 -z-10 blur-3xl" />

      <div className="max-w-4xl w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-indigo-500/10">
        <div className="p-10 md:p-14 pb-0 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-6">
            AI-Powered Document Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent mb-4">
            Summarize Any Text File
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light">
            Drop your long documents, logs, or reports below and let Google Gemini extract the key insights in seconds.
          </p>
        </div>

        <div className="p-10 md:p-14">
          <form ref={formRef} action={formAction} className="space-y-8">
            <div className="group relative">
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-700/50 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800/50 hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center w-full max-w-[80%] mx-auto">
                  {selectedFile ? (
                    <>
                      <svg className="w-12 h-12 mb-4 text-green-400 group-hover:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mb-2 text-base text-neutral-200 font-semibold truncate w-full">{selectedFile.name}</p>
                      <p className="text-xs text-neutral-500 font-mono">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-10 h-10 mb-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-neutral-300"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-neutral-500 font-mono">TXT, MD, CSV, JSON</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept=".txt,.csv,.md,.json"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={pending}
              className={`w-full py-4 px-6 flex justify-center items-center rounded-2xl text-white font-medium text-lg transition-all shadow-lg overflow-hidden relative group ${pending
                  ? 'bg-neutral-800 text-neutral-400 cursor-wait border border-neutral-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 hover:shadow-indigo-500/25 active:scale-[0.98]'
                }`}
            >
              {!pending && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              )}
              {pending ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reading & Reflecting...
                </span>
              ) : (
                'Generate Summary ✨'
              )}
            </button>
          </form>

          {state.error && (
            <div className="mt-8 p-5 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-start gap-4">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong className="block font-medium text-red-300 mb-1">Error processing doc</strong>
                {state.error}
              </div>
            </div>
          )}

          <div
            className={`transition-all duration-700 ease-in-out ${state.summary && !pending ? 'opacity-100 max-h-[2000px] mt-10' : 'opacity-0 max-h-0 overflow-hidden'
              }`}
          >
            <div className="relative p-8 rounded-2xl bg-neutral-900/80 border border-indigo-500/20 backdrop-blur-md shadow-2xl">
              <div className="absolute top-0 left-8 -translate-y-1/2 bg-neutral-900 border border-indigo-500/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">Summary Ready</span>
              </div>
              <div className="prose prose-invert prose-indigo max-w-none prose-p:leading-relaxed prose-headings:text-indigo-100 prose-a:text-indigo-400">
                {/* Fallback to simple markdown parsing since we don't have react-markdown installed. Using whitespace-pre-wrap for basic formatting. */}
                <div className="whitespace-pre-wrap text-neutral-300 leading-relaxed font-sans text-lg">
                  {state.summary}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframes to global styles for shimmer effect inline */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
