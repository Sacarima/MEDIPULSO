// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Calendar,
//   Video,
//   Receipt,
//   ShieldCheck,
//   MessageSquare,
//   HeartPulse,
//   Search,
//   Users,
//   Zap,
//   CheckCircle,
//   ArrowRight,
//   Globe,
//   Languages,
// } from "lucide-react";

// // Brand color (also used via Tailwind arbitrary colors)
// const BRAND = "#00b39b";

// export default function DiscoverMediPulsoPro() {
//   const [billing, setBilling] = useState("monthly"); // 'monthly' | 'annual'
//   const [openFAQ, setOpenFAQ] = useState(null);
//   const [showVideo, setShowVideo] = useState(false);

//   useEffect(() => {
//     document.title = "Discover Medi Pulso Pro | Medi Pulso";
//   }, []);

//   const price = useMemo(() => ({
//     monthly: { pro: 59, business: 99 },
//     annual: { pro: 49, business: 79 }, // effective monthly when billed yearly
//   }), []);

//   const features = [
//     {
//       icon: Calendar,
//       title: "Agenda inteligente",
//       body:
//         "Gestão de horários, cancelamentos e sobreposições com um clique. Sincronização com Google/Apple/Outlook.",
//       bullets: ["Slots dinâmicos", "Blocos de tempo", "Regras por serviço"],
//     },
//     {
//       icon: Video,
//       title: "Teleconsulta HD",
//       body:
//         "Chamadas seguras, partilha de ficheiros e notas clínicas. Link único para cada consulta.",
//       bullets: ["Sala virtual", "Testes de microfone/câmara", "Sem apps"],
//     },
//     {
//       icon: Receipt,
//       title: "Faturação & Recibos",
//       body:
//         "Crie e envie recibos/FTs em segundos, com impostos e numeração automática.",
//       bullets: ["Modelos PT/EU", "Exportação CSV", "Lembretes de pagamento"],
//     },
//     {
//       icon: MessageSquare,
//       title: "Mensagens & Lembretes",
//       body:
//         "Lembretes automáticos por SMS/email e mensagens pós-consulta com instruções.",
//       bullets: ["Templates", "Automação por evento", "Opt‑in do paciente"],
//     },
//     {
//       icon: ShieldCheck,
//       title: "Segurança & Verificação",
//       body:
//         "Perfis verificados, consentimentos e logs de auditoria. Controlo de acessos por função.",
//       bullets: ["2FA", "Registos de acesso", "RGPD pronto"],
//     },
//     {
//       icon: Search,
//       title: "Perfil com alcance",
//       body:
//         "Destaque nos resultados de pesquisa do Medi Pulso, com SEO otimizado e reviews moderadas.",
//       bullets: ["Rich snippets", "Galerias/Tratamentos", "Idiomas visíveis"],
//     },
//   ];

//   const faqs = [
//     {
//       q: "Posso experimentar antes de pagar?",
//       a: "Sim. Tens 14 dias de teste do Medi Pulso Pro, sem cartão. Podes cancelar a qualquer momento no painel.",
//     },
//     {
//       q: "O que muda do plano gratuito?",
//       a: "O Pro desbloqueia teleconsulta, faturação, automações, destaque no diretório e suporte prioritário.",
//     },
//     {
//       q: "Como funciona a faturação anual?",
//       a: "Pagas 12 meses de uma vez com desconto (2 meses grátis). O preço mostrado é o equivalente mensal.",
//     },
//     {
//       q: "E a segurança dos dados?",
//       a: "Seguimos boas práticas de segurança, encriptação em repouso e em trânsito, e ferramentas de gestão de consentimento.",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white text-gray-800">
//       <Hero onWatchDemo={() => setShowVideo(true)} />

//       {/* Trust / KPI Bar */}
//       <motion.section
//         initial={{ opacity: 0, y: 24 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.3 }}
//         className="mx-auto max-w-7xl px-4 sm:px-6 pt-8"
//       >
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-gray-200 p-4 sm:p-6 bg-white/80 backdrop-blur">
//           <KPI number="10k+" label="Consultas/semana" />
//           <KPI number="98%" label="Comparecência com lembretes" />
//           <KPI number="< 30s" label="Para marcar online" />
//           <KPI number="RGPD" label="Conformidade" />
//         </div>
//       </motion.section>

//       {/* Features Grid */}
//       <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
//         <HeaderEyebrow title="Porquê o Medi Pulso Pro" subtitle="Ferramentas modernas para clínicas e especialistas" />
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {features.map((f, i) => (
//             <FeatureCard key={f.title} {...f} index={i} />
//           ))}
//         </div>
//       </section>

//       {/* How it works */}
//       <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
//         <HeaderEyebrow title="Como funciona" subtitle="Três passos para simplificar o teu dia" />
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <StepCard index={1} title="Cria o teu perfil" body="Importa dados existentes e verifica credenciais para ganhar confiança imediatamente." Icon={Users} />
//           <StepCard index={2} title="Configura serviços" body="Define duração, preço, teleconsulta/presencial e políticas de cancelamento." Icon={HeartPulse} />
//           <StepCard index={3} title="Ativa automações" body="Lembretes, follow‑ups e faturação em segundos. Menos tarefas repetitivas." Icon={Zap} />
//         </div>
//       </section>

//       {/* Comparison Table */}
//       <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
//         <HeaderEyebrow title="Comparação de planos" subtitle="Transparente e direto ao ponto" />
//         <div className="mt-6 overflow-x-auto">
//           <table className="min-w-[720px] w-full border-separate border-spacing-0 rounded-2xl overflow-hidden">
//             <thead>
//               <tr>
//                 <th className="text-left bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">Funcionalidade</th>
//                 <th className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">Gratuito</th>
//                 <th className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">Pro</th>
//                 <th className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">Business</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[
//                 { name: "Perfil público & SEO", free: true, pro: true, biz: true },
//                 { name: "Marcações online", free: true, pro: true, biz: true },
//                 { name: "Teleconsulta HD", free: false, pro: true, biz: true },
//                 { name: "Faturação & Recibos", free: false, pro: true, biz: true },
//                 { name: "Automação de lembretes", free: false, pro: true, biz: true },
//                 { name: "Múltiplas localizações", free: false, pro: true, biz: true },
//                 { name: "Equipa & permissões", free: false, pro: false, biz: true },
//                 { name: "Suporte prioritário", free: false, pro: true, biz: true },
//               ].map((row, idx) => (
//                 <tr key={row.name} className="odd:bg-white even:bg-gray-50">
//                   <td className="px-4 py-3 text-sm text-gray-700 border-t border-gray-100">{row.name}</td>
//                   <CellCheck val={row.free} />
//                   <CellCheck val={row.pro} highlight />
//                   <CellCheck val={row.biz} />
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Pricing */}
//       <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
//         <HeaderEyebrow title="Preços" subtitle="Paga apenas pelo que usas. Sem taxas escondidas." />

//         <div className="mt-6 flex items-center justify-center gap-3">
//           <span className={`text-sm ${billing === "monthly" ? "font-semibold" : "text-gray-500"}`}>Mensal</span>
//           <button
//             onClick={() => setBilling(billing === "monthly" ? "annual" : "monthly")}
//             aria-label="Alternar ciclo de faturação"
//             className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200 p-1 transition"
//           >
//             <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${billing === "annual" ? "translate-x-7" : "translate-x-0"}`} />
//             <span className="sr-only">Alternar faturação</span>
//           </button>
//           <span className={`text-sm ${billing === "annual" ? "font-semibold" : "text-gray-500"}`}>Anual <span className="ml-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700">2 meses grátis</span></span>
//         </div>

//         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//           <PriceCard
//             title="Pro"
//             price={billing === "monthly" ? price.monthly.pro : price.annual.pro}
//             tagline="Para especialistas e pequenas clínicas"
//             bullets={[
//               "Teleconsulta HD",
//               "Faturação integrada",
//               "Lembretes automáticos",
//               "Suporte prioritário",
//             ]}
//             ctaLabel="Começar teste gratuito"
//             highlight
//           />

//           <PriceCard
//             title="Business"
//             price={billing === "monthly" ? price.monthly.business : price.annual.business}
//             tagline="Para equipas e multi‑clínicas"
//             bullets={[
//               "Tudo do Pro",
//               "Equipa & permissões",
//               "Múltiplas localizações",
//               "Apoio dedicado",
//             ]}
//             ctaLabel="Falar com vendas"
//             secondary
//           />
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
//         <HeaderEyebrow title="Resultados reais" subtitle="Profissionais que já simplificaram o dia a dia" />
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Testimonial
//             quote="O número de faltas caiu drasticamente. Os lembretes automáticos são ouro."
//             author="Dra. Marta Silva"
//             role="Dermatologista em Lisboa"
//           />
//           <Testimonial
//             quote="Teleconsulta sem fricção. Os pacientes entram com um link e está feito."
//             author="Dr. João Pereira"
//             role="Cardiologista em Porto"
//           />
//           <Testimonial
//             quote="A faturação integrada poupou‑me horas por semana. Tudo alinhado para RGPD."
//             author="Clínica Vida +"
//             role="Secretariado"
//           />
//         </div>
//       </section>

//       {/* FAQ */}
//       <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
//         <HeaderEyebrow title="Perguntas frequentes" subtitle="Tudo o que precisas para começar" />
//         <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
//           {faqs.map((f, i) => (
//             <button
//               key={f.q}
//               onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
//               className="w-full text-left px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
//               aria-expanded={openFAQ === i}
//             >
//               <div className="flex items-start justify-between gap-4">
//                 <p className="text-base sm:text-lg font-semibold text-gray-800">{f.q}</p>
//                 <ArrowRight className={`h-5 w-5 flex-shrink-0 transition ${openFAQ === i ? "rotate-90 text-emerald-600" : "text-gray-400"}`} />
//               </div>
//               <div className={`grid transition-[grid-template-rows] duration-300 ${openFAQ === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
//                 <div className="overflow-hidden">
//                   <p className="mt-2 text-sm sm:text-base text-gray-600">{f.a}</p>
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-28 sm:pb-32">
//         <div className="relative overflow-hidden rounded-3xl border border-gray-200">
//           <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
//             <BackgroundGrid />
//           </div>
//           <div className="relative bg-gradient-to-br from-[rgb(0,179,155)] to-emerald-500 p-8 sm:p-12 text-white">
//             <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Pronto para descobrir o Medi Pulso Pro?</h2>
//             <p className="mt-2 text-white/90 max-w-2xl">Começa com um período de teste gratuito. Sem riscos. Sem cartão. Cancela quando quiseres.</p>
//             <div className="mt-6 flex flex-wrap items-center gap-3">
//               <Link to="/signup-doctor" className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow hover:shadow-md transition">
//                 Começar agora
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//               <button onClick={() => setShowVideo(true)} className="inline-flex items-center rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/15 transition">
//                 Ver demonstração
//               </button>
//               <span className="text-xs sm:text-sm text-white/85">14 dias grátis • Sem compromisso</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Sticky Mobile CTA */}
//       <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
//         <div className="mx-3 mb-3 rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
//           <div className="flex items-center justify-between px-4 py-3">
//             <div>
//               <p className="text-sm font-semibold text-gray-800">Experimenta o Pro</p>
//               <p className="text-xs text-gray-500">14 dias grátis, cancela quando quiseres</p>
//             </div>
//             <Link to="/signup-doctor" className="rounded-xl bg-[rgb(0,179,155)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95">
//               Começar
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Video Demo Modal (no external deps) */}
//       {showVideo && (
//         <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowVideo(false)}>
//           <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
//             <div className="aspect-video bg-black/90 flex items-center justify-center text-white">
//               {/* Replace with real video iframe/source */}
//               <div className="text-center p-6">
//                 <p className="text-lg font-semibold">Demonstração em breve</p>
//                 <p className="text-sm text-white/70 mt-1">Substitui por um iframe do teu vídeo (YouTube/Vimeo) ou um <code>video</code> local.</p>
//               </div>
//             </div>
//             <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
//               <div className="text-xs text-gray-600">Teleconsulta, marcações e faturação — tudo em ação.</div>
//               <button onClick={() => setShowVideo(false)} className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">Fechar</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ===================== Sections & Building Blocks ===================== */

// function Hero({ onWatchDemo }) {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
//       <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-30" style={{ background: BRAND }} aria-hidden />
//       <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-3xl opacity-20" style={{ background: BRAND }} aria-hidden />

//       <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-10 sm:pb-16">
//         <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} className="text-center">
//           <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
//             <ShieldCheck className="h-3.5 w-3.5" />
//             Descobre o Medi Pulso Pro
//           </span>
//           <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
//             Plataforma moderna para clínicas e especialistas
//           </h1>
//           <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-gray-600">
//             Marcações online, teleconsulta HD, faturação e automação — tudo num só lugar.
//           </p>
//           <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
//             <Link to="/signup-doctor" className="inline-flex items-center rounded-xl bg-[rgb(0,179,155)] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95">
//               Começar teste gratuito
//               <ArrowRight className="ml-2 h-4 w-4" />
//             </Link>
//             <button onClick={onWatchDemo} className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50">
//               Ver demonstração
//             </button>
//           </div>
//           <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
//             <div className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> RGPD pronto</div>
//             <div className="inline-flex items-center gap-1"><Globe className="h-4 w-4" /> Link único por consulta</div>
//             <div className="inline-flex items-center gap-1"><Languages className="h-4 w-4" /> Multi‑idioma</div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Placeholder phone mockup */}
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
//         <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-6">
//           <MockCard title="Marcações online" subtitle="30s a marcar" Icon={Calendar} />
//           <MockCard title="Teleconsulta" subtitle="HD + Link único" Icon={Video} />
//         </div>
//       </div>
//     </section>
//   );
// }

// function KPI({ number, label }) {
//   return (
//     <div className="rounded-xl border border-gray-200 p-4">
//       <p className="text-2xl font-extrabold tracking-tight" style={{ color: BRAND }}>{number}</p>
//       <p className="text-xs text-gray-600 mt-1">{label}</p>
//     </div>
//   );
// }

// function HeaderEyebrow({ title, subtitle }) {
//   return (
//     <div className="text-center">
//       <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">{title}</span>
//       <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{subtitle}</h2>
//     </div>
//   );
// }

// function FeatureCard({ icon: Icon, title, body, bullets, index }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, amount: 0.4 }}
//       transition={{ delay: (index % 3) * 0.05 }}
//       className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition"
//     >
//       <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl" style={{ background: BRAND }} aria-hidden />
//       <div className="flex items-start gap-3">
//         <div className="rounded-xl bg-emerald-50 p-2 ring-1 ring-emerald-200">
//           <Icon className="h-5 w-5 text-emerald-700" />
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//           <p className="mt-1 text-sm text-gray-600">{body}</p>
//           <ul className="mt-3 space-y-1">
//             {bullets.map((b) => (
//               <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
//                 <CheckCircle className="h-4 w-4 text-emerald-600" /> {b}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function StepCard({ index, title, body, Icon }) {
//   return (
//     <div className="relative rounded-2xl border border-gray-200 bg-white p-6">
//       <span className="absolute -top-3 left-6 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-600 px-2 text-xs font-bold text-white shadow">{index}</span>
//       <div className="flex items-start gap-3">
//         <div className="rounded-xl bg-emerald-50 p-2 ring-1 ring-emerald-200">
//           <Icon className="h-5 w-5 text-emerald-700" />
//         </div>
//         <div>
//           <h3 className="text-base font-semibold text-gray-900">{title}</h3>
//           <p className="mt-1 text-sm text-gray-600">{body}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CellCheck({ val, highlight }) {
//   return (
//     <td className={`px-4 py-3 text-center text-sm border-t border-gray-100 ${highlight ? "bg-emerald-50" : ""}`}>
//       {val ? (
//         <CheckCircle className="mx-auto h-5 w-5 text-emerald-600" />
//       ) : (
//         <span className="text-gray-400">—</span>
//       )}
//     </td>
//   );
// }

// function PriceCard({ title, price, tagline, bullets, ctaLabel, highlight, secondary }) {
//   return (
//     <div className={`relative rounded-2xl border p-6 transition ${highlight ? "border-emerald-200 bg-emerald-50/40" : "border-gray-200 bg-white"}`}>
//       {highlight && (
//         <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
//           Mais popular
//         </span>
//       )}
//       <div className="flex items-start justify-between">
//         <div>
//           <h3 className="text-lg font-bold text-gray-900">{title}</h3>
//           <p className="text-sm text-gray-600 mt-1">{tagline}</p>
//         </div>
//         <div className="text-right">
//           <div className="text-3xl font-extrabold text-gray-900">€{price}<span className="text-base font-medium text-gray-500">/mês</span></div>
//           <div className="text-[11px] text-gray-500">IVA não incluído</div>
//         </div>
//       </div>
//       <ul className="mt-4 space-y-2">
//         {bullets.map((b) => (
//           <li key={b} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle className="h-4 w-4 text-emerald-600" /> {b}</li>
//         ))}
//       </ul>
//       <div className="mt-6">
//         {secondary ? (
//           <Link to="/contact-sales" className="inline-flex items-center justify-center w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50">
//             {ctaLabel}
//           </Link>
//         ) : (
//           <Link to="/signup-doctor" className="inline-flex items-center justify-center w-full rounded-xl bg-[rgb(0,179,155)] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95">
//             {ctaLabel}
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }

// function Testimonial({ quote, author, role }) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5">
//       <p className="text-sm text-gray-800">“{quote}”</p>
//       <div className="mt-4 text-sm font-semibold text-gray-900">{author}</div>
//       <div className="text-xs text-gray-500">{role}</div>
//     </div>
//   );
// }

// function MockCard({ title, subtitle, Icon }) {
//   return (
//     <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
//       <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl" style={{ background: BRAND }} aria-hidden />
//       <div className="flex items-center gap-3">
//         <div className="rounded-xl bg-emerald-50 p-2 ring-1 ring-emerald-200">
//           <Icon className="h-5 w-5 text-emerald-700" />
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-900">{title}</p>
//           <p className="text-xs text-gray-600">{subtitle}</p>
//         </div>
//       </div>
//       <div className="mt-4 h-36 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 grid place-items-center text-gray-400 text-xs">
//         Pré‑visualização
//       </div>
//     </div>
//   );
// }

// function BackgroundGrid() {
//   return (
//     <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
//       <defs>
//         <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
//           <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
//         </pattern>
//       </defs>
//       <rect width="100%" height="100%" fill="url(#grid)" />
//     </svg>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Video,
  Receipt,
  ShieldCheck,
  MessageSquare,
  HeartPulse,
  Search,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Globe,
  Languages,
} from "lucide-react";

// Brand color (also used via Tailwind arbitrary colors)
const BRAND = "#00b39b";

export default function DiscoverMediPulsoPro() {
  const [billing, setBilling] = useState("monthly"); // 'monthly' | 'annual'
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    document.title = "Discover Medi Pulso Pro | Medi Pulso";
  }, []);

  const price = useMemo(
    () => ({
      monthly: { pro: 59, business: 99 },
      annual: { pro: 49, business: 79 }, // effective monthly when billed yearly
    }),
    []
  );

  const features = [
    {
      icon: Calendar,
      title: "Smart scheduling",
      body:
        "One‑click control of slots, cancellations, overlaps, and sync with Google/Apple/Outlook.",
      bullets: ["Dynamic slots", "Time blocks", "Per‑service rules"],
    },
    {
      icon: Video,
      title: "HD teleconsultation",
      body:
        "Secure calls with file sharing and clinical notes. A unique link for every appointment.",
      bullets: ["Virtual room", "Mic/camera checks", "No apps required"],
    },
    {
      icon: Receipt,
      title: "Billing & invoices",
      body:
        "Create and send invoices/receipts in seconds with taxes and automatic numbering.",
      bullets: ["EU templates", "CSV export", "Payment reminders"],
    },
    {
      icon: MessageSquare,
      title: "Messages & reminders",
      body:
        "Automatic SMS/email reminders and post‑visit messages with instructions.",
      bullets: ["Templates", "Event automations", "Patient opt‑in"],
    },
    {
      icon: ShieldCheck,
      title: "Security & verification",
      body:
        "Verified profiles, consents, audit logs, and role‑based access control.",
      bullets: ["2FA", "Access logs", "GDPR‑ready"],
    },
    {
      icon: Search,
      title: "Profile with reach",
      body:
        "Prominence in Medi Pulso search results, SEO‑optimized with moderated reviews.",
      bullets: ["Rich snippets", "Galleries/Treatments", "Visible languages"],
    },
  ];

  const faqs = [
    {
      q: "Can I try it before paying?",
      a: "Yes. You get a 14‑day Medi Pulso Pro trial, no card required. You can cancel anytime from the dashboard.",
    },
    {
      q: "What changes from the Free plan?",
      a: "Pro unlocks teleconsultation, billing, automations, directory boost, and priority support.",
    },
    {
      q: "How does annual billing work?",
      a: "You pay 12 months upfront with a discount (2 months free). The price shown is the monthly equivalent.",
    },
    {
      q: "What about data security?",
      a: "We follow industry best practices, with encryption at rest and in transit, plus consent‑management tools.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Hero onWatchDemo={() => setShowVideo(true)} />

      {/* Trust / KPI Bar */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 pt-8"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-gray-200 p-4 sm:p-6 bg-white/80 backdrop-blur">
          <KPI number="10k+" label="Appointments/week" />
          <KPI number="98%" label="Attendance with reminders" />
          <KPI number="< 30s" label="To book online" />
          <KPI number="GDPR" label="Compliant" />
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <HeaderEyebrow title="Why Medi Pulso Pro" subtitle="Modern tools for clinics and specialists" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <HeaderEyebrow title="How it works" subtitle="Three steps to simplify your day" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard index={1} title="Create your profile" body="Import existing data and verify credentials to build trust instantly." Icon={Users} />
          <StepCard index={2} title="Configure services" body="Set duration, price, virtual/in‑person, and cancellation policies." Icon={HeartPulse} />
          <StepCard index={3} title="Switch on automations" body="Reminders, follow‑ups, and invoicing in seconds. Fewer repetitive tasks." Icon={Zap} />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <HeaderEyebrow title="Plan comparison" subtitle="Transparent and to the point" />
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[720px] w-full border-separate border-spacing-0 rounded-2xl overflow-hidden">
            <thead>
              <tr>
                <th className="text-left bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">Feature</th>
                <th className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">Free</th>
                <th className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">Pro</th>
                <th className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">Business</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Public profile & SEO", free: true, pro: true, biz: true },
                { name: "Online bookings", free: true, pro: true, biz: true },
                { name: "HD teleconsultation", free: false, pro: true, biz: true },
                { name: "Billing & invoices", free: false, pro: true, biz: true },
                { name: "Automated reminders", free: false, pro: true, biz: true },
                { name: "Multiple locations", free: false, pro: true, biz: true },
                { name: "Team & permissions", free: false, pro: false, biz: true },
                { name: "Priority support", free: false, pro: true, biz: true },
              ].map((row) => (
                <tr key={row.name} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700 border-t border-gray-100">{row.name}</td>
                  <CellCheck val={row.free} />
                  <CellCheck val={row.pro} highlight />
                  <CellCheck val={row.biz} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <HeaderEyebrow title="Pricing" subtitle="Pay only for what you use. No hidden fees." />

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className={`text-sm ${billing === "monthly" ? "font-semibold" : "text-gray-500"}`}>Monthly</span>
          <button
            onClick={() => setBilling(billing === "monthly" ? "annual" : "monthly")}
            aria-label="Toggle billing cycle"
            className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200 p-1 transition"
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${billing === "annual" ? "translate-x-7" : "translate-x-0"}`} />
            <span className="sr-only">Toggle billing</span>
          </button>
          <span className={`text-sm ${billing === "annual" ? "font-semibold" : "text-gray-500"}`}>
            Annual <span className="ml-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700">2 months free</span>
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <PriceCard
            title="Pro"
            price={billing === "monthly" ? price.monthly.pro : price.annual.pro}
            tagline="For specialists and small clinics"
            bullets={[
              "HD teleconsultation",
              "Integrated billing",
              "Automated reminders",
              "Priority support",
            ]}
            ctaLabel="Start free trial"
            highlight
          />

          <PriceCard
            title="Business"
            price={billing === "monthly" ? price.monthly.business : price.annual.business}
            tagline="For teams and multi‑clinic setups"
            bullets={[
              "Everything in Pro",
              "Team & permissions",
              "Multiple locations",
              "Dedicated support",
            ]}
            ctaLabel="Contact sales"
            secondary
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <HeaderEyebrow title="Real results" subtitle="Professionals who already simplified their day" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Testimonial
            quote="No‑shows dropped dramatically. Automated reminders are gold."
            author="Dr. Marta Silva"
            role="Dermatologist in Lisbon"
          />
          <Testimonial
            quote="Frictionless teleconsultation. Patients join with a link and that’s it."
            author="Dr. João Pereira"
            role="Cardiologist in Porto"
          />
          <Testimonial
            quote="Integrated billing saves me hours every week. All aligned with GDPR."
            author="Vida+ Clinic"
            role="Front desk"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
        <HeaderEyebrow title="Frequently asked questions" subtitle="Everything you need to get started" />
        <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {faqs.map((f, i) => (
            <button
              key={f.q}
              onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              className="w-full text-left px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              aria-expanded={openFAQ === i}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-base sm:text-lg font-semibold text-gray-800">{f.q}</p>
                <ArrowRight className={`h-5 w-5 flex-shrink-0 transition ${openFAQ === i ? "rotate-90 text-emerald-600" : "text-gray-400"}`} />
              </div>
              <div className={`grid transition-[grid-template-rows] duration-300 ${openFAQ === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="mt-2 text-sm sm:text-base text-gray-600">{f.a}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-28 sm:pb-32">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200">
          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
            <BackgroundGrid />
          </div>
          <div className="relative bg-gradient-to-br from-[rgb(0,179,155)] to-emerald-500 p-8 sm:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to discover Medi Pulso Pro?</h2>
            <p className="mt-2 text-white/90 max-w-2xl">Start with a free trial. No risk. No card. Cancel anytime.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/signup/doctor-form" className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow hover:shadow-md transition">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <button onClick={() => setShowVideo(true)} className="inline-flex items-center rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/15 transition">
                Watch demo
              </button>
              <span className="text-xs sm:text-sm text-white/85">14‑day free trial • No commitment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
        <div className="mx-3 mb-3 rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">Try Pro</p>
              <p className="text-xs text-gray-500">14‑day free trial, cancel anytime</p>
            </div>
            <Link to="/signup/doctor-form" className="rounded-xl bg-[rgb(0,179,155)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95">
              Start
            </Link>
          </div>
        </div>
      </div>

      {/* Video Demo Modal (no external deps) */}
      {showVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-black/90 flex items-center justify-center text-white">
              {/* Replace with real video iframe/source */}
              <div className="text-center p-6">
                <p className="text-lg font-semibold">Demo coming soon</p>
                <p className="text-sm text-white/70 mt-1">
                  Video will be available shortly <code>video</code> element.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <div className="text-xs text-gray-600">Teleconsultation, bookings, and billing — all in action.</div>
              <button
                onClick={() => setShowVideo(false)}
                className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== Sections & Building Blocks ===================== */

function Hero({ onWatchDemo }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      <div
        className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-30"
        style={{ background: BRAND }}
        aria-hidden
      />
      <div
        className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-3xl opacity-20"
        style={{ background: BRAND }}
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-10 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Discover Medi Pulso Pro
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            A modern platform for clinics and specialists
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-gray-600">
            Online bookings, HD teleconsultations, billing, and automation — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup/doctor-form"
              className="inline-flex items-center rounded-xl bg-[rgb(0,179,155)] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
            >
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <button
              onClick={onWatchDemo}
              className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Watch demo
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="inline-flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> GDPR‑ready
            </div>
            <div className="inline-flex items-center gap-1">
              <Globe className="h-4 w-4" /> Unique link per visit
            </div>
            <div className="inline-flex items-center gap-1">
              <Languages className="h-4 w-4" /> Multi‑language
            </div>
          </div>
        </motion.div>
      </div>

      {/* Placeholder phone mockup */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-6">
          <MockCard title="Online bookings" subtitle="Book in under 30s" Icon={Calendar} />
          <MockCard title="Teleconsultation" subtitle="HD + unique link" Icon={Video} />
        </div>
      </div>
    </section>
  );
}

function KPI({ number, label }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-2xl font-extrabold tracking-tight" style={{ color: BRAND }}>
        {number}
      </p>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
    </div>
  );
}

function HeaderEyebrow({ title, subtitle }) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
        {title}
      </span>
      <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{subtitle}</h2>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, body, bullets, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: (index % 3) * 0.05 }}
      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition"
    >
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl"
        style={{ background: BRAND }}
        aria-hidden
      />
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-2 ring-1 ring-emerald-200">
          <Icon className="h-5 w-5 text-emerald-700" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{body}</p>
          <ul className="mt-3 space-y-1">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function StepCard({ index, title, body, Icon }) {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-6">
      <span className="absolute -top-3 left-6 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-600 px-2 text-xs font-bold text-white shadow">
        {index}
      </span>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-2 ring-1 ring-emerald-200">
          <Icon className="h-5 w-5 text-emerald-700" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{body}</p>
        </div>
      </div>
    </div>
  );
}

function CellCheck({ val, highlight }) {
  return (
    <td className={`px-4 py-3 text-center text-sm border-t border-gray-100 ${highlight ? "bg-emerald-50" : ""}`}>
      {val ? (
        <CheckCircle className="mx-auto h-5 w-5 text-emerald-600" />
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </td>
  );
}

function PriceCard({ title, price, tagline, bullets, ctaLabel, highlight, secondary }) {
  return (
    <div className={`relative rounded-2xl border p-6 transition ${highlight ? "border-emerald-200 bg-emerald-50/40" : "border-gray-200 bg-white"}`}>
      {highlight && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
          Most popular
        </span>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{tagline}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-gray-900">
            €{price}
            <span className="text-base font-medium text-gray-500">/mo</span>
          </div>
          <div className="text-[11px] text-gray-500">VAT not included</div>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle className="h-4 w-4 text-emerald-600" /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {secondary ? (
          <Link
            to="/contact-sales"
            className="inline-flex items-center justify-center w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50"
          >
            {ctaLabel}
          </Link>
        ) : (
          <Link
            to="/signup/doctor-form"
            className="inline-flex items-center justify-center w-full rounded-xl bg-[rgb(0,179,155)] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

function Testimonial({ quote, author, role }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-800">“{quote}”</p>
      <div className="mt-4 text-sm font-semibold text-gray-900">{author}</div>
      <div className="text-xs text-gray-500">{role}</div>
    </div>
  );
}

function MockCard({ title, subtitle, Icon }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl"
        style={{ background: BRAND }}
        aria-hidden
      />
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-2 ring-1 ring-emerald-200">
          <Icon className="h-5 w-5 text-emerald-700" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4 h-36 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 grid place-items-center text-gray-400 text-xs">
        Preview
      </div>
    </div>
  );
}

function BackgroundGrid() {
  return (
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}
