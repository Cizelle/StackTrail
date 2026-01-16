import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api.js";
import Loader from "../components/Loader.jsx";
import Navbar from "../components/Navbar.jsx";

const ScenarioDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchScenario = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getScenarioById(id);
      setScenario(data.scenario);
    } catch (err) {
      setError(
        err.message || "Uplink failure: Unable to sync mission parameters."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchScenario();
  }, [fetchScenario]);

  const handleStart = async () => {
    try {
      await api.startScenario(id);
      navigate(`/play/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0c]">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <Loader />
          <span className="font-mono text-xs text-green-500 animate-pulse">
            DECRYPTING_ASSETS...
          </span>
        </div>
      </div>
    );

  if (!scenario && !error)
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center font-mono text-zinc-600">
        <span className="px-4 py-2 border border-zinc-800">
          404 // DATA_FRAGMENT_NOT_FOUND
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-400 selection:bg-green-500/20 selection:text-green-200">
      <Navbar />

      {/* Structural Background Lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      <main className="relative container mx-auto px-6 pt-32 pb-20 max-w-6xl">
        {/* Navigation & ID Tag */}
        <div className="flex justify-between items-center mb-12">
          <Link
            to="/scenarios"
            className="group flex items-center gap-3 text-[10px] font-black tracking-[.2em] uppercase text-zinc-500 hover:text-white transition-all"
          >
            <span className="w-6 h-px bg-zinc-700 group-hover:w-10 group-hover:bg-green-500 transition-all" />
            Return to Index
          </Link>
          <span className="font-mono text-[10px] text-zinc-700">
            OBJ_ID: {id?.slice(0, 8) || "UNKNOWN"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Area (8 columns) */}
          <div className="lg:col-span-8">
            <header className="relative mb-12">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">
                {scenario.title}
                <span className="text-green-500">.</span>
              </h1>

              <div className="flex flex-wrap gap-6 items-center border-y border-white/5 py-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                    Specialization
                  </p>
                  <p className="font-mono text-sm text-zinc-200">
                    {scenario.role}
                  </p>
                </div>
                <div className="w-px h-8 bg-zinc-800 hidden sm:block" />
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                    Risk Factor
                  </p>
                  <p
                    className={`font-mono text-sm uppercase ${
                      scenario.difficulty === "hard"
                        ? "text-red-500"
                        : scenario.difficulty === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {scenario.difficulty}
                  </p>
                </div>
              </div>
            </header>

            <section className="prose prose-invert max-w-none">
              <h3 className="text-xs font-black uppercase tracking-[.3em] text-zinc-500 mb-6 flex items-center gap-4">
                Operational Overview{" "}
                <span className="h-px flex-grow bg-zinc-900" />
              </h3>
              <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed">
                {scenario.description}
              </p>
            </section>
          </div>

          {/* Action Sidebar (4 columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 group">
              {/* The "Briefing Card" */}
              <div className="relative overflow-hidden rounded-2xl bg-[#0d0d0f] border border-white/10 p-8 shadow-2xl transition-all hover:border-green-500/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[60px] pointer-events-none" />

                <h4 className="font-mono text-[10px] text-zinc-500 mb-8 border-b border-white/5 pb-4 tracking-widest uppercase">
                  Execution Parameters
                </h4>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-zinc-600 italic">
                      Auth Status
                    </span>
                    <span className="text-xs font-mono text-green-500">
                      VERIFIED
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-zinc-600 italic">
                      Instance
                    </span>
                    <span className="text-xs font-mono text-zinc-300">
                      Ephemeral
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-zinc-600 italic">
                      Latency
                    </span>
                    <span className="text-xs font-mono text-zinc-300">
                      24ms
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono leading-tight">
                    &gt; {error}
                  </div>
                )}

                <button
                  onClick={handleStart}
                  className="w-full relative py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded hover:bg-green-500 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] active:scale-[0.98]"
                >
                  Initiate Sequence
                </button>
              </div>

              {/* Decorative Terminal Text Below Card */}
              <div className="mt-6 px-2 font-mono text-[9px] text-zinc-700 leading-relaxed uppercase tracking-tighter">
                System: Connection encrypted via TLS 1.3 // Neural-Link ready //
                All actions recorded for post-mission analysis.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScenarioDetails;
