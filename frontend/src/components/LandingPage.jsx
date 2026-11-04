import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  FileArchive,
  FileText,
  ListOrdered,
  Brain,
  Wand2,
  Trophy,
  HelpCircle,
  Target,
  Cog,
  X,
  Check,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import HeroPipeline from "@/components/HeroPipeline";
import MockRankingPreview from "@/components/MockRankingPreview";

const GLANCE = [
  {
    icon: HelpCircle,
    label: "What is it?",
    title: "An AI resume screener",
    body: "Hire Help reads a whole batch of resumes for you and tells you which candidates best fit a job — no manual skimming.",
  },
  {
    icon: Target,
    label: "What does it do?",
    title: "Ranks candidates by fit",
    body: "Give it a ZIP of resumes and one job description. You get a ranked shortlist with a match score (%) and a link to each resume.",
  },
  {
    icon: Cog,
    label: "How does it work?",
    title: "Matches meaning, not keywords",
    body: "AI converts every resume and the job description into numbers that capture meaning, then measures how close they are.",
  },
];

const FLOW = [
  {
    icon: FileArchive,
    title: "Upload resumes",
    body: "Drop a .zip of PDF / DOCX resumes. Text is extracted from every file and the originals are stored securely.",
    tech: "PDF · DOCX parsing",
  },
  {
    icon: Brain,
    title: "AI understands them",
    body: "Each resume is turned into a 384‑number “meaning vector” by an embedding model and saved in a vector database.",
    tech: "BGE‑small · Qdrant",
  },
  {
    icon: Wand2,
    title: "Add the job description",
    body: "Upload the JD. An LLM strips fluff like “rockstar” and “fast‑paced”, keeping only real skills and requirements.",
    tech: "Gemini 2.5 Flash",
  },
  {
    icon: Trophy,
    title: "Get the ranked shortlist",
    body: "The cleaned JD is compared to every resume. The closer the meaning, the higher the match score.",
    tech: "Cosine similarity",
  },
];

export default function Landing() {
  return (
    <div data-testid="landing-page">
      {/* ================= HERO ================= */}
      <section className="hero-wash hero-grid overflow-hidden">
        <div className="relative max-w-[1180px] mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <Reveal>
              <div className="pill" data-testid="hero-eyebrow">
                <span className="pill-tag">AI</span>
                Resume analyzer for recruiters & hiring teams
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1
                className="hl-display mt-6 text-[clamp(40px,6vw,72px)] t-ink"
                data-testid="hero-title"
              >
                Find the best candidates in a pile of resumes —{" "}
                <span className="text-grad">in seconds.</span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-6 text-[18px] md:text-[19px] leading-relaxed t-soft max-w-[580px]">
                Upload a <b className="t-ink">ZIP of resumes</b> and a{" "}
                <b className="t-ink">job description</b>. Hire Help reads every resume, understands
                what each candidate can actually do, and gives you a{" "}
                <b className="t-ink">ranked shortlist with match scores</b>.
              </p>
            </Reveal>

            {/* Input → Output summary */}
            <Reveal delay={210}>
              <div className="mt-7 flex flex-wrap items-center gap-2.5 text-[13px] font-medium">
                <span className="chip"><FileArchive size={14} /> Resumes .zip</span>
                <span className="t-mute">+</span>
                <span className="chip"><FileText size={14} /> Job description</span>
                <ArrowRight size={16} className="t-mute" />
                <span
                  className="chip"
                  style={{ background: "rgba(16,185,129,.12)", color: "#059669" }}
                >
                  <ListOrdered size={14} /> Ranked shortlist
                </span>
              </div>
            </Reveal>

            <Reveal delay={270}>
              <div className="mt-9 flex items-center gap-3 flex-wrap">
                <Link to="/app" className="btn-apple btn-primary-apple" data-testid="hero-cta-launch">
                  Try it now <ArrowRight size={16} />
                </Link>
                <a href="#how" className="btn-apple btn-ghost-apple" data-testid="hero-cta-features">
                  See how it works
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] t-mute">
                <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> No signup</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={14} className="text-emerald-500" /> Results in under a minute</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Session‑isolated data</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <HeroPipeline />
          </Reveal>
        </div>
      </section>

      {/* ================= AT A GLANCE ================= */}
      <section className="relative -mt-6 pb-16 md:pb-24">
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-3 gap-5">
          {GLANCE.map((g, i) => (
            <Reveal key={g.label} delay={i * 80}>
              <div className="card card-hover p-7 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-tile"><g.icon size={20} /></div>
                  <span className="eyebrow">{g.label}</span>
                </div>
                <h3 className="hl-headline text-[22px] t-ink">{g.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] t-soft">{g.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="band-white py-20 md:py-28 border-y scroll-mt-16">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center max-w-[720px] mx-auto mb-14">
            <Reveal><span className="eyebrow">How it works</span></Reveal>
            <Reveal delay={80}>
              <h2 className="hl-display mt-3 text-[34px] md:text-[48px] t-ink">
                From a folder of files to a shortlist, in 4 steps.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 text-[17px] t-soft">
                Here's exactly what happens behind the scenes when you use Hire Help.
              </p>
            </Reveal>
          </div>

          <div className="flow">
            {FLOW.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className="flow-step">
                <div className="card card-hover p-6 h-full">
                  <div className="flex items-center justify-between">
                    <div className={`icon-tile ${i % 2 ? "cool" : ""}`} style={{ width: 52, height: 52, borderRadius: 14 }}>
                      <s.icon size={22} />
                    </div>
                    <span className="step-num">STEP 0{i + 1}</span>
                  </div>
                  <h3 className="hl-headline text-[19px] mt-5 t-ink">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] t-soft">{s.body}</p>
                  <div className="mt-4 text-[11.5px] font-mono t-mute border-t pt-3">{s.tech}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY SEMANTIC ================= */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1180px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal><span className="eyebrow">Why it's smarter</span></Reveal>
            <Reveal delay={80}>
              <h2 className="hl-display mt-3 text-[32px] md:text-[44px] t-ink">
                It understands <span className="text-grad">meaning</span>, not just matching words.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 text-[17px] leading-relaxed t-soft">
                Traditional ATS filters look for exact keywords, so great candidates get missed
                when they describe the same skill differently. Hire Help compares ideas — so
                “built UIs with React” matches a JD asking for a “frontend engineer”.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card p-6">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-red-500 mb-4">
                  <X size={16} /> Keyword filter
                </div>
                <div className="text-[12px] font-mono t-mute mb-2">JD wants: “Frontend engineer”</div>
                <div className="rounded-xl border p-3 text-[13.5px] t-soft">
                  Resume says: “UI developer, 3 yrs React”
                </div>
                <div className="mt-4 text-[13px] font-semibold text-red-500">Rejected — no exact match</div>
              </div>
              <div className="card-glow p-6">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-emerald-500 mb-4">
                  <Sparkles size={16} /> Hire Help
                </div>
                <div className="text-[12px] font-mono t-mute mb-2">JD wants: “Frontend engineer”</div>
                <div className="rounded-xl border p-3 text-[13.5px] t-soft">
                  Resume says: “UI developer, 3 yrs React”
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="score-badge high">91% match</span>
                  <span className="text-[13px] font-semibold text-emerald-500">Shortlisted</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= PREVIEW ================= */}
      <section className="band-white border-y py-20 md:py-24">
        <div className="max-w-[1080px] mx-auto px-6 text-center">
          <Reveal><span className="eyebrow">What you get</span></Reveal>
          <Reveal delay={80}>
            <h2 className="hl-display mt-3 text-[32px] md:text-[44px] t-ink">
              A clear, ranked list — best fit on top.
            </h2>
          </Reveal>
          <MockRankingPreview />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1000px] mx-auto px-6">
          <Reveal>
            <div
              className="rounded-[28px] p-10 md:p-16 text-center text-white relative overflow-hidden"
              style={{ background: "linear-gradient(130deg,#3b3bd8 0%,#7c3aed 50%,#db2777 100%)" }}
            >
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, #fff 0, transparent 30%), radial-gradient(circle at 80% 90%, #fff 0, transparent 25%)",
                }}
              />
              <h2 className="hl-display relative text-[34px] md:text-[52px]">
                Ready to screen your first batch?
              </h2>
              <p className="relative mt-4 text-[18px] text-white/85">
                Upload resumes, add a job description, and see your shortlist in under a minute.
              </p>
              <div className="relative mt-8 flex items-center justify-center gap-3 flex-wrap">
                <Link
                  to="/app"
                  className="btn-apple bg-white text-[#3b3bd8] shadow-xl"
                  data-testid="cta-launch-bottom"
                >
                  Launch the app <ArrowRight size={16} />
                </Link>
                <Link
                  to="/about"
                  className="btn-apple border-white/40 text-white hover:bg-white/10"
                  data-testid="cta-about-bottom"
                >
                  About the project
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
