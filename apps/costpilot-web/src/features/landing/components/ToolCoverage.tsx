import { FadeIn } from "../../../shared/components/animations/FadeIn";
import { BackgroundBeamsWithCollision } from "../../../shared/components/animations/BackgroundBeamsWithCollision";

const supportedTools = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf",
];

export function ToolCoverage() {
  return (
    <section className="relative bg-black py-40 overflow-hidden">
      <BackgroundBeamsWithCollision className="flex-col py-28 px-6">
        <div className="mx-auto max-w-7xl w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-white/[0.05] pb-24 relative z-20">
            <FadeIn className="max-w-2xl">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400/40">Integrations</p>
              <h2 className="mt-8 text-6xl font-bold tracking-tighter text-white sm:text-7xl lg:text-8xl">
                Built for real <br />
                <div className="relative inline-block">
                  <span className="italic text-white/20">AI stacks.</span>
                  <div className="absolute -inset-x-4 -inset-y-2 bg-emerald-500/10 blur-2xl opacity-20 pointer-events-none" />
                </div>
              </h2>
            </FadeIn>
            <FadeIn className="max-w-xs lg:mb-4">
              <p className="text-lg text-white/30 leading-snug tracking-tight font-medium">
                Track seat-based subscriptions and API usage tools in one unified, defensible audit.
              </p>
            </FadeIn>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/[0.03] border border-white/[0.03] overflow-hidden rounded-3xl relative z-20 backdrop-blur-sm">
            {supportedTools.map((tool) => (
              <div 
                key={tool}
                className="group relative bg-black/40 p-12 transition-colors hover:bg-white/[0.01]"
              >
                <div className="absolute top-6 left-6 h-1 w-1 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                <span className="text-sm font-bold tracking-tight text-white/40 group-hover:text-white transition-colors">
                  {tool}
                </span>
              </div>
            ))}
          </div>
          
          <FadeIn className="mt-16 text-center relative z-20">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/10">
              + and 12 other emerging AI developer tools
            </p>
          </FadeIn>
        </div>
      </BackgroundBeamsWithCollision>
    </section>
  );
}

