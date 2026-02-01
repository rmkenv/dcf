
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ALL_STATE_CONFIGS } from './constants';
import { ViewType, PermitData, ApiTier } from './types';
import { GeminiService } from './services/geminiService';
import { PermitCard } from './components/PermitCard';

const DATE_RANGES = [
  { label: 'Last 7 Days', value: 'the last 7 days' },
  { label: 'Last 30 Days', value: 'the last 30 days' },
  { label: 'Last 90 Days', value: 'the last 3 months' },
  { label: 'Year to Date', value: 'since January 1st, 2025' },
];

const API_TIERS: ApiTier[] = [
  { name: 'Developer', price: '$0', limit: '100 req/mo', features: ['Public States Only', '7-day Lag', 'Standard Support'], color: 'slate' },
  { name: 'Professional', price: '$149', limit: '10,000 req/mo', features: ['All 50 States', 'Real-time Webhooks', 'CSV/JSON Exports'], color: 'indigo' },
  { name: 'Enterprise', price: 'Custom', limit: 'Unlimited', features: ['Bulk PDF OCR', 'Dedicated Support', 'White-label API'], color: 'emerald' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedStates, setSelectedStates] = useState<string[]>(['MD', 'VA']);
  const [selectedRange, setSelectedRange] = useState(DATE_RANGES[1].value);
  const [results, setResults] = useState<PermitData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [analyzeText, setAnalyzeText] = useState('');
  const [analyzerResult, setAnalyzerResult] = useState<PermitData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiDemoKey, setApiDemoKey] = useState('demo_key_123');
  const [syncMetadata, setSyncMetadata] = useState<{ timestamp: string | null; status: 'online' | 'error' | 'pending' }>({ 
    timestamp: null, 
    status: 'pending' 
  });

  const gemini = useMemo(() => new GeminiService(), []);

  const fetchAutomatedData = useCallback(async () => {
    try {
      setSyncMetadata(prev => ({ ...prev, status: 'pending' }));
      const response = await fetch(`/api/permits?key=${apiDemoKey}`);
      if (response.ok) {
        const data = await response.json();
        if (data.permits) {
          setResults(data.permits);
          setSyncMetadata({ timestamp: data.syncTimestamp, status: 'online' });
        }
      } else {
        throw new Error("API Offline");
      }
    } catch (e) {
      setSyncMetadata(prev => ({ ...prev, status: 'error' }));
      // Attempt JSON fallback
      try {
        const fallback = await fetch('/latest_permits.json');
        if (fallback.ok) {
           const data = await fallback.json();
           setResults(data.permits);
           setSyncMetadata({ timestamp: data.syncTimestamp, status: 'online' });
        }
      } catch (err) {
        console.error("Critical: No data found.");
      }
    }
  }, [apiDemoKey]);

  useEffect(() => {
    fetchAutomatedData();
  }, [fetchAutomatedData]);

  const nextRunDate = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 1).toLocaleDateString();
  }, []);

  const handleStateToggle = useCallback((code: string) => {
    setSelectedStates(prev => 
      prev.includes(code) ? prev.filter(s => s !== code) : [...prev, code]
    );
  }, []);

  const handleSelectAllStates = useCallback(() => {
    setSelectedStates(prev => 
      prev.length === Object.keys(ALL_STATE_CONFIGS).length ? [] : Object.keys(ALL_STATE_CONFIGS)
    );
  }, []);

  const runSearch = async () => {
    if (selectedStates.length === 0) return;
    setIsSearching(true);
    setErrorMessage(null);

    try {
      const liveData = await gemini.searchLivePermits(selectedStates, selectedRange);
      if (liveData.length === 0) {
        setErrorMessage("No real-time records found. Try adjusting states or dates.");
      } else {
        setResults(liveData);
      }
    } catch (err) {
      setErrorMessage("Network error during search.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalyze = async () => {
    if (!analyzeText.trim()) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalyzerResult(null);

    try {
      const extracted = await gemini.analyzePermitText(analyzeText);
      if (extracted) {
        setAnalyzerResult(extracted);
      } else {
        setErrorMessage("Extraction failed.");
      }
    } catch (e) {
      setErrorMessage("Analysis error.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportCSV = useCallback(() => {
    if (results.length === 0) return;
    const headers = ['ID', 'Facility', 'Location', 'Size', 'Fuel', 'Issue Date', 'Agency', 'Description', 'Source URL'];
    const csvRows = results.map(permit => [
      permit.id, permit.facility, permit.location, permit.size, permit.fuel, permit.issueDate, permit.agency, permit.description, permit.sourceUrl || ''
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `permits_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  }, [results]);

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="text-xl font-black tracking-tight uppercase italic">PermitEngine</h1>
              <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Sync v3.1</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {[
              { id: 'dashboard', label: 'Feed' },
              { id: 'analyzer', label: 'OCR' },
              { id: 'api-portal', label: 'API Portal' },
              { id: 'setup', label: 'Config' }
            ].map((nav) => (
              <button 
                key={nav.id}
                onClick={() => setActiveView(nav.id as ViewType)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  activeView === nav.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Vercel Status Bar */}
      <div className="bg-slate-950 border-b border-white/5 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                syncMetadata.status === 'online' ? 'bg-emerald-500' : 
                syncMetadata.status === 'error' ? 'bg-red-500' : 'bg-amber-500'
              }`}></span>
              GitHub Sync Status: {syncMetadata.status.toUpperCase()}
            </span>
            <span className="w-2 h-2 bg-slate-700 rounded-full"></span>
            <span>Last Push: {syncMetadata.timestamp ? new Date(syncMetadata.timestamp).toLocaleDateString() : 'None Recorded'}</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">Next Sync: {nextRunDate}</div>
             <div className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Engine: Gemini-3-Flash</div>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}

        {activeView === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Monthly Sync Stream</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Data Center Permit Surveillance</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  disabled={results.length === 0}
                  className="bg-white border-2 border-slate-100 text-slate-900 px-4 py-2 rounded-xl font-black text-xs uppercase hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  Export CSV
                </button>
                <button
                  onClick={runSearch}
                  disabled={isSearching || selectedStates.length === 0}
                  className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-indigo-100"
                >
                  {isSearching ? 'Bypassing Cache...' : 'Live Refetch'}
                </button>
              </div>
            </header>

            {syncMetadata.status === 'error' && (
              <div className="p-10 bg-amber-50 border-2 border-dashed border-amber-200 rounded-[40px] text-center space-y-4">
                <h3 className="text-amber-900 font-black uppercase text-sm">GitHub Sync Data Missing</h3>
                <p className="text-amber-700 text-xs font-medium max-w-lg mx-auto leading-relaxed">
                  Your automation has not populated <code className="bg-amber-100 px-1 rounded">latest_permits.json</code> yet. 
                  Go to the <strong>API Portal</strong> to complete the 3-step synchronization setup.
                </p>
              </div>
            )}

            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Regional Scraper Context</span>
                <button onClick={handleSelectAllStates} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Select All</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(ALL_STATE_CONFIGS).map(code => (
                  <button
                    key={code}
                    onClick={() => handleStateToggle(code)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                      selectedStates.includes(code)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.length > 0 ? (
                results.map((permit, idx) => (
                  <div key={`${permit.id}-${idx}`} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 20}ms` }}>
                    <PermitCard permit={permit} />
                  </div>
                ))
              ) : (
                !isSearching && syncMetadata.status !== 'error' && (
                  <div className="col-span-full py-32 text-center bg-slate-50/30 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                         <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </div>
                      <p className="text-slate-400 font-black text-xs tracking-[0.3em] uppercase">Checking Automation Logs...</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {activeView === 'api-portal' && (
          <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Monetization Console</h2>
              <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Setup GitHub Actions & Gated API Endpoints</p>
            </header>

            {/* Sync Troubleshooting Checklist */}
            <div className="bg-indigo-600 text-white p-10 rounded-[40px] shadow-2xl space-y-8">
              <h3 className="text-xl font-black uppercase tracking-widest border-b border-indigo-500 pb-4">Synchronization Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">1</span>
                    <h4 className="text-xs font-black uppercase">GitHub Secrets</h4>
                  </div>
                  <p className="text-[10px] text-indigo-100 leading-relaxed font-medium">
                    Go to <code className="bg-indigo-700 px-1 rounded">Settings > Secrets > Actions</code> in your repo. Add <code className="bg-indigo-700 px-1 rounded font-bold text-white">API_KEY</code> with your Gemini Pro key.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">2</span>
                    <h4 className="text-xs font-black uppercase">Run Workflow</h4>
                  </div>
                  <p className="text-[10px] text-indigo-100 leading-relaxed font-medium">
                    Navigate to the <code className="bg-indigo-700 px-1 rounded">Actions</code> tab in GitHub. Select <code className="bg-indigo-700 px-1 rounded">Monthly Permit Sync</code> and click <code className="bg-indigo-700 px-1 rounded font-bold text-white">Run workflow</code>.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">3</span>
                    <h4 className="text-xs font-black uppercase">Vercel Redepoy</h4>
                  </div>
                  <p className="text-[10px] text-indigo-100 leading-relaxed font-medium">
                    Vercel automatically re-deploys when the GitHub Action pushes the new <code className="bg-indigo-700 px-1 rounded">latest_permits.json</code>. Refresh the feed after 2 mins.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Endpoint Section */}
            <div className="bg-white border border-slate-100 p-10 rounded-[40px] shadow-sm">
               <div className="relative z-10 space-y-6">
                 <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-slate-900">
                   Active API Endpoint
                 </h3>
                 <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 font-mono text-indigo-600 space-y-4">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="overflow-x-auto text-xs font-bold">
                       <span className="text-slate-400">GET</span> 
                       <span className="ml-2 text-slate-900">https://{window.location.host}/api/permits?key={apiDemoKey}</span>
                     </div>
                     <button 
                      onClick={() => window.open(`/api/permits?key=${apiDemoKey}`)} 
                      className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all flex-shrink-0"
                     >
                       Test JSON Response
                     </button>
                   </div>
                 </div>
               </div>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {API_TIERS.map(tier => (
                  <div key={tier.name} className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-sm hover:border-indigo-600 transition-all">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">{tier.name}</h4>
                    <div className="text-3xl font-black text-slate-900 mb-6">{tier.price}</div>
                    <ul className="space-y-4 mb-8">
                      {tier.features.map(f => (
                        <li key={f} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-4 rounded-2xl bg-slate-950 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors">Generate Key</button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* OCR Section */}
        {activeView === 'analyzer' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
            <header>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Manual Data Lab</h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Instant Extract for Ad-Hoc Public Documents</p>
            </header>

            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
              <textarea
                value={analyzeText}
                onChange={(e) => setAnalyzeText(e.target.value)}
                placeholder="Paste OCR output from PDF or scanned permit here..."
                className="w-full h-48 p-6 rounded-3xl border-2 border-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-xs bg-slate-50/50"
              />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !analyzeText.trim()}
                  className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  {isAnalyzing ? 'Extracting Metadata...' : 'Run Lab Sync'}
                </button>
              </div>
            </div>

            {analyzerResult && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PermitCard permit={analyzerResult} />
              </div>
            )}
          </div>
        )}

        {/* Config Section */}
        {activeView === 'setup' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
            <header>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Source Clusters</h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Active State Scraper Metadata</p>
            </header>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(ALL_STATE_CONFIGS).map(config => (
                <div key={config.state_code} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-600 transition-all group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-900">{config.state}</span>
                    <span className="text-[8px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-black">{config.agency_abbreviation}</span>
                  </div>
                  <a href={config.permit_search_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 font-bold group-hover:text-indigo-600 flex items-center gap-1 transition-colors">Agency Portal ↗</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 text-slate-600 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
           <div className="flex items-center gap-4 opacity-50">
             <div className="text-[10px] font-black uppercase tracking-[0.5em]">PermitEngine • Optimized for Enterprise Sync</div>
           </div>
           <p className="text-[9px] font-bold uppercase max-w-lg leading-relaxed opacity-40">
             Official Data Stream powered by GitHub Actions and Gemini Pro 3. All records are verified via Google Search Grounding.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
