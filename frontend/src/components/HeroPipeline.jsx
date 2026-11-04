import { useEffect, useState } from "react";
import { FileArchive, ScanText, Brain, Wand2, Trophy, Check } from "lucide-react";

const STEPS = [
  { icon: FileArchive, title: "resumes.zip uploaded", sub: "48 resumes · PDF & DOCX" },
  { icon: ScanText, title: "Reading every resume", sub: "Text extracted from each file" },
  { icon: Brain, title: "Understanding meaning", sub: "AI turns each resume into a vector" },
  { icon: Wand2, title: "Cleaning the job description", sub: "Buzzwords removed, real needs kept" },
  { icon: Trophy, title: "Ranking candidates", sub: "Closest meaning = highest score" },
];

const RESULTS = [
  { name: "Ananya_Rao_resume.pdf", score: 94 },
  { name: "Rohit_Kulkarni_cv.pdf", score: 87 },
  { name: "Sneha_Patil.docx", score: 72 },
];

const tier = (s) => (s >= 80 ? "high" : s >= 60 ? "mid" : "low");

export default function HeroPipeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % (STEPS.length + 2)), 1500);
    return () => clearInterval(id);
  }, []);

  const finished = active >= STEPS.length;

  return (
    <div className="card-glow p-5 md:p-6 w-full max-w-[460px] mx-auto" data-testid="hero-pipeline">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[11px] font-mono t-mute">live pipeline</span>
      </div>

      <div className="text-[13px] font-semibold t-ink mb-3">
        Role: <span className="t-soft font-medium">Frontend Developer (React)</span>
      </div>

      <div>
        {STEPS.map((s, i) => {
          const state = i < active ? "done" : i === active ? "active" : "";
          return (
            <div key={s.title}>
              <div className={`pipe-node ${state}`}>
                <div className={`icon-tile ${state ? "" : "soft"}`} style={{ width: 36, height: 36, borderRadius: 10 }}>
                  {i < active ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold t-ink">{s.title}</div>
                  <div className="text-[12px] t-mute">{s.sub}</div>
                </div>
                {i === active && <span className="spinner ml-auto" />}
              </div>
              {i < STEPS.length - 1 && <div className={`pipe-connector ${i < active ? "lit" : ""}`} />}
            </div>
          );
        })}
      </div>

      <div
        className="mt-4 rounded-2xl border p-3 transition-all duration-500"
        style={{ opacity: finished ? 1 : 0.35, borderColor: "var(--line)" }}
      >
        <div className="text-[11px] font-mono uppercase tracking-widest t-mute mb-2 px-1">
          Shortlist
        </div>
        {RESULTS.map((r, i) => (
          <div key={r.name} className="flex items-center gap-3 px-1 py-1.5">
            <span className="w-5 text-[12px] font-mono t-mute">{i + 1}</span>
            <span className="flex-1 text-[13px] font-medium t-ink truncate">{r.name}</span>
            <div className="meter-track w-20" style={{ height: 6 }}>
              <div className={`meter-fill ${tier(r.score)}`} style={{ width: finished ? `${r.score}%` : "0%" }} />
            </div>
            <span className={`score-badge ${tier(r.score)}`}>{r.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
