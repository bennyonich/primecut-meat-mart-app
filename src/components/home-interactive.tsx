"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const stages = [
  { title: "Discovery", text: "Stakeholder interviews, business case alignment, and risk mapping." },
  { title: "Planning", text: "Integrated PM plan with scope, schedule, procurement, and dependencies." },
  { title: "Execution", text: "Cross-functional delivery governance with proactive issue control." },
  { title: "Handover", text: "Operational readiness, KPI baselining, and lessons-learned closure." },
];

export function HomeInteractive() {
  const [budget, setBudget] = useState(60000000);
  const [complexity, setComplexity] = useState("medium");
  const [email, setEmail] = useState("");
  const [need, setNeed] = useState("Telecom deployment");
  const [teamSize, setTeamSize] = useState(12);

  const estimate = useMemo(() => {
    const multiplier = complexity === "high" ? 1.35 : complexity === "low" ? 0.85 : 1;
    const pmFee = budget * 0.12 * multiplier;
    const duration = Math.max(3, Math.round((teamSize / 5) * multiplier * 4));
    return { pmFee, duration };
  }, [budget, complexity, teamSize]);

  return (
    <section className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="albto-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold">Interactive Delivery Timeline</h3>
          <div className="mt-4 space-y-4">
            {stages.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-white/10 bg-[#0b1630] p-4"
              >
                <p className="text-sm font-semibold text-[var(--albto-secondary)]">{s.title}</p>
                <p className="mt-1 text-sm text-[var(--albto-muted)]">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="albto-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold">Project Scope Estimator</h3>
          <p className="mt-1 text-sm text-[var(--albto-muted)]">
            Quick model for planning conversations. Final fee depends on full scope.
          </p>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              Budget (NGN)
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#071126] p-2"
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </label>
            <label className="block text-sm">
              Complexity
              <select
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#071126] p-2"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="block text-sm">
              Project Team Size
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#071126] p-2"
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
              />
            </label>
            <div className="rounded-xl border border-[var(--albto-primary)]/30 bg-[#091733] p-4">
              <p className="text-sm text-[var(--albto-muted)]">Estimated PM fee</p>
              <p className="text-2xl font-bold">
                NGN {Math.round(estimate.pmFee).toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-[var(--albto-muted)]">
                Suggested timeline: {estimate.duration} weeks
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="albto-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold">Smart Consultation Form</h3>
          <p className="mt-1 text-sm text-[var(--albto-muted)]">
            We qualify opportunities quickly so you get a precise roadmap call.
          </p>
          <form className="mt-4 space-y-3">
            <input
              className="w-full rounded-lg border border-white/10 bg-[#071126] p-2"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-white/10 bg-[#071126] p-2"
              placeholder="Project need"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
            />
            <button
              type="button"
              className="w-full rounded-lg bg-[var(--albto-secondary)] px-4 py-2 font-semibold text-[#041022]"
            >
              Book Strategy Call
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#173067_0%,#0b1a35_45%,#10254b_100%)] p-6"
        >
          <h3 className="text-xl font-semibold">Chat With Albto</h3>
          <p className="mt-2 text-sm text-[var(--albto-muted)]">
            Speak with a consultant about your IT or telecom project.
          </p>
          <a
            href="https://wa.me/2348088778030"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 font-semibold text-[#0a1d3f]"
          >
            Chat on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
