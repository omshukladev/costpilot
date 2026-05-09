import { FadeIn } from "../../../shared/components/animations/FadeIn";
import { HoverGlowCard } from "../../../shared/components/animations/HoverGlowCard";

const faqs = [
  {
    q: "Do I need to sign up before seeing savings?",
    a: "No. The audit result appears first. Email capture only appears after you see value.",
  },
  {
    q: "How accurate are the recommendations?",
    a: "Rules are deterministic and tied to current official vendor pricing. We avoid inflated savings claims.",
  },
  {
    q: "Which tools are supported?",
    a: "Cursor, Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf.",
  },
  {
    q: "Will my private details be public in reports?",
    a: "No. Public report pages remove identifying details like email and company name.",
  },
  {
    q: "When does Credex consultation appear?",
    a: "For high-savings audits, we surface Credex as a faster way to capture larger savings.",
  },
  {
    q: "Is there a limit to audits?",
    a: "No. You can audit as many stacks as you need to find the right configuration.",
  }
];

export function FAQSection() {
  return (
    <section className="relative bg-black px-6 py-48">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-24">
          <FadeIn>
            <div className="lg:sticky lg:top-40">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400/40">Support</p>
              <h2 className="mt-8 text-6xl font-bold tracking-tighter text-white leading-[0.9]">
                Common <br />
                <span className="text-white/10 italic">Questions.</span>
              </h2>
              <p className="mt-10 text-lg text-white/30 font-medium tracking-tight">
                Everything you need to know about the engine and our reporting.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map((item, idx) => (
              <FadeIn key={item.q} delay={idx * 0.05}>
                <HoverGlowCard>
                  <div className="rounded-3xl border border-white/[0.03] bg-white/[0.01] p-8 h-full backdrop-blur-sm transition-all hover:bg-white/[0.03]">
                    <p className="text-sm font-bold text-white/90 leading-tight">{item.q}</p>
                    <p className="mt-4 text-sm leading-relaxed text-white/30 font-medium">{item.a}</p>
                  </div>
                </HoverGlowCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

