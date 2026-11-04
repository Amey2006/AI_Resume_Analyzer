import { useState } from "react";
import { ExternalLink, Info, Trophy, Users, Gauge, Check, FileSearch } from "lucide-react";
import UploadZip from "@/components/UploadZip";
import UploadJD from "@/components/UploadJD";

const tier = (s) => (s >= 75 ? "high" : s >= 50 ? "mid" : "low");
const tierLabel = { high: "Strong fit", mid: "Possible fit", low: "Weak fit" };

function Stepper({ current }) {
  const steps = ["Upload resumes", "Add job description", "Review shortlist"];
  return (
    <ol className="flex items-center justify-center gap-2 md:gap-4 flex-wrap" data-testid="app-stepper">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                  done || active ? "text-white" : "t-mute border"
                }`}
                style={done || active ? { background: "var(--grad)" } : undefined}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className={`text-[13.5px] font-semibold ${active || done ? "t-ink" : "t-mute"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <span className="hidden sm:block w-8 md:w-14 h-px" style={{ background: "var(--line-strong)" }} />}
          </li>
        );
      })}
    </ol>
  );
}

export default function AppExperience() {
  const [sessionId] = useState(
    () => `session-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`
  );
  const [candidates, setCandidates] = useState([]);
  const [resumesReady, setResumesReady] = useState(false);

  const rows = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));
  const current = rows.length > 0 ? 3 : resumesReady ? 1 : 0;
  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + (r.score || 0), 0) / rows.length) : 0;
  const strong = rows.filter((r) => r.score >= 75).length;

  return (
    <div className="hero-wash min-h-screen" data-testid="app-experience-page">
      <section className="pt-14 pb-10 md:pt-20">
        <div className="max-w-[1080px] mx-auto px-6 text-center">
          <span className="eyebrow">Resume ranking workspace</span>
          <h1 className="hl-display mt-3 text-[clamp(34px,5vw,56px)] t-ink" data-testid="app-title">
            Rank resumes against <span className="text-grad">any role.</span>
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed t-soft max-w-[620px] mx-auto">
            Two uploads, one ranked shortlist. Start with your resumes, then add the job
            description — results appear below automatically.
          </p>
          <div className="mt-8">
            <Stepper current={current} />
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="max-w-[1080px] mx-auto px-6 grid md:grid-cols-2 gap-5">
          <UploadZip sessionId={sessionId} onReady={setResumesReady} />
          <UploadJD sessionId={sessionId} setCandidates={setCandidates} locked={!resumesReady} />
        </div>
        <div className="max-w-[1080px] mx-auto px-6 mt-5">
          <div className="card p-4 md:p-5 flex items-start gap-3 text-[13.5px] t-soft">
            <Info size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
            <p>
              <b className="t-ink">What happens behind the scenes:</b> resumes are text‑extracted and
              converted into AI “meaning vectors”. Your JD is cleaned of buzzwords, converted the same
              way, and compared to every resume. The <b className="t-ink">match score</b> shows how
              closely each resume's content matches the role (higher = better fit).
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <span className="eyebrow">Step 3 · Results</span>
              <h2 className="hl-headline mt-1 text-[26px] md:text-[32px] t-ink">Ranked candidates</h2>
            </div>
            {rows.length > 0 && <div className="text-[12px] font-mono t-mute">{rows.length} scored</div>}
          </div>

          {rows.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-4 mb-5 fade-in">
              {[
                { icon: Trophy, label: "Top match", value: `${rows[0].score}%` },
                { icon: Users, label: "Strong fits (75%+)", value: strong },
                { icon: Gauge, label: "Average score", value: `${avg}%` },
              ].map((s) => (
                <div key={s.label} className="card p-5 flex items-center gap-4">
                  <div className="icon-tile"><s.icon size={18} /></div>
                  <div>
                    <div className="text-[12px] t-mute font-medium">{s.label}</div>
                    <div className="hl-headline text-[24px] t-ink">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {rows.length === 0 ? (
            <div className="card p-12 text-center" data-testid="results-empty">
              <div className="icon-tile soft mx-auto" style={{ width: 56, height: 56, borderRadius: 16 }}>
                <FileSearch size={24} />
              </div>
              <h3 className="hl-headline mt-4 text-[19px] t-ink">No candidates yet</h3>
              <p className="mt-1 text-[14.5px] t-mute">
                Complete steps 1 and 2 above — your ranked shortlist will show up here.
              </p>
            </div>
          ) : (
            <div className="card overflow-hidden fade-in">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-[11px] font-semibold uppercase tracking-wider t-mute border-b">
                      <th className="px-6 py-3.5 text-left">Rank</th>
                      <th className="px-6 py-3.5 text-left">Resume</th>
                      <th className="px-6 py-3.5 text-left">Match score</th>
                      <th className="px-6 py-3.5 text-left">Fit</th>
                      <th className="px-6 py-3.5 text-right">Resume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((candidate, index) => {
                      const resumeName =
                        candidate.file_name || candidate.name || candidate.fileName || "Unknown Document";
                      const scoreValue = typeof candidate.score === "number" ? candidate.score : 0;
                      const t = tier(scoreValue);
                      return (
                        <tr
                          key={candidate.id || `${resumeName}-${index}`}
                          data-testid={`result-row-${index}`}
                          className="border-b last:border-b-0 transition-colors hover:bg-[var(--brand-soft)]"
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-[12px] font-bold ${
                                index < 3 ? "text-white" : "t-mute border"
                              }`}
                              style={index < 3 ? { background: "var(--grad)" } : undefined}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-[14px] font-semibold t-ink truncate max-w-[340px]" title={resumeName}>
                              {resumeName}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 min-w-[180px]">
                              <div className="meter-track w-28 flex-shrink-0">
                                <div className={`meter-fill ${t}`} style={{ width: `${scoreValue}%` }} />
                              </div>
                              <span className="text-[13px] font-mono font-semibold t-ink">{scoreValue}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`score-badge ${t}`}>{tierLabel[t]}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {candidate.resume_url ? (
                              <a
                                href={candidate.resume_url}
                                target="_blank"
                                rel="noreferrer"
                                data-testid={`result-link-${index}`}
                                className="link-apple text-[13px]"
                              >
                                Open <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span className="text-[13px] t-mute">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
