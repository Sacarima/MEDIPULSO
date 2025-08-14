// src/components/doctor/DoctorPlans.jsx
import { useMemo, useState } from "react";
import { FiCheck, FiMinus, FiZap, FiStar, FiShield, FiChevronDown, FiChevronUp } from "react-icons/fi";


/**
 * Props:
 * - doctorId?: string
 * - currentPlan?: 'free' | 'plus' | 'pro' | 'enterprise'
 * - onStartCheckout?: (payload: { planId: string; cycle: 'monthly'|'yearly' }) => Promise<void> | void
 * - onManageBilling?: () => Promise<void> | void
 *
 * All props are optional. If not provided, buttons do console.log only.
 */
export default function DoctorPlans({
  doctorId,
  currentPlan = "free",
  onStartCheckout,
  onManageBilling,
}) {
  const [cycle, setCycle] = useState("monthly"); // 'monthly' | 'yearly'
  const [showCompare, setShowCompare] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(""); // which plan is loading

  const plans = useMemo(
    () => [
      {
        id: "free",
        name: "Free",
        tagline: "Get started and set up your profile.",
        monthly: 0,
        yearly: 0,
        badge: null,
        cta: "Start free",
        features: [
          { label: "Public profile page", value: true },
          { label: "Appointments/month", value: "Up to 20" },
          { label: "Online consultations", value: false },
          { label: "Doctor calendar (basic)", value: true },
          { label: "Basic analytics", value: true },
          { label: "Email support", value: "Community" },
        ],
      },
      {
        id: "plus",
        name: "Plus",
        tagline: "Grow with better tools and automation.",
        monthly: 19,
        yearly: 190, // ~2 months free
        badge: "Most Popular",
        cta: "Upgrade to Plus",
        features: [
          { label: "Public profile page", value: true },
          { label: "Appointments/month", value: "Up to 200" },
          { label: "Online consultations", value: true },
          { label: "Doctor calendar (advanced)", value: true },
          { label: "Advanced analytics", value: true },
          { label: "Priority email support", value: true },
        ],
      },
      {
        id: "pro",
        name: "Pro",
        tagline: "For busy practices that need power features.",
        monthly: 39,
        yearly: 390, // ~2 months free
        badge: null,
        cta: "Upgrade to Pro",
        features: [
          { label: "Public profile page", value: true },
          { label: "Appointments/month", value: "Unlimited" },
          { label: "Online consultations", value: true },
          { label: "Doctor calendar (pro)", value: true },
          { label: "Pro analytics & exports", value: true },
          { label: "Priority support + SLA", value: true },
        ],
      },
      // card (no payment, contact only)
      // {
      //   id: "enterprise",
      //   name: "Enterprise",
      //   tagline: "Custom needs, SSO, SLA, onboarding.",
      //   monthly: null,
      //   yearly: null,
      //   badge: "Custom",
      //   cta: "Contact sales",
      //   features: [
      //     { label: "Everything in Pro", value: true },
      //     { label: "Team/clinic admin tools", value: true },
      //     { label: "SSO / SAML", value: true },
      //     { label: "Custom integrations", value: true },
      //     { label: "Dedicated support", value: true },
      //   ],
      // },
    ],
    []
  );

  // Find the current plan object
  const handleSelect = async (planId) => {
  setLoadingPlan(planId);

  try {
    const isCurrentPaidPlan = currentPlan && currentPlan !== "free";

    // If they’re on a paid plan already
    if (isCurrentPaidPlan) {
      // Switching to free → handle downgrade here (no Stripe portal)
      if (planId === "free") {
        console.log("[billing] switching to free plan");
        // You might call your backend here to update DB
        return;
      }

      // Switching between paid plans → open Stripe portal
      if (onManageBilling) {
        return await onManageBilling();
      }
      console.log("[billing] manage current plan");
      return;
    }

    // If they’re currently on free and want a paid plan
    if (planId !== "free") {
      const payload = {
        planId,
        cycle: cycle === "yearly" ? "yearly" : "monthly",
        doctorId
      };
      if (onStartCheckout) {
        await onStartCheckout(payload);
      } else {
        console.log("[checkout] start", payload);
      }
      return;
    }

    // If they’re on free and click free → just ignore
    if (planId === "free") {
      console.log("[billing] switching to free plan");

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/billing/downgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ doctorId })
      });

      return;
    }

  } catch (e) {
    console.error(e);
  } finally {
    setLoadingPlan("");
  }
};


  return (
    <div className="max-w-6xl mx-auto bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Choose your plan</h1>
          <p className="text-gray-600">
            Flexible pricing for doctors and clinics. Switch anytime.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center gap-3">
          <span className={`text-sm ${cycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setCycle((c) => (c === "monthly" ? "yearly" : "monthly"))}
            className="relative w-14 h-8 rounded-full bg-gray-200 transition"
            aria-label="Toggle billing cycle"
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                cycle === "yearly" ? "translate-x-6" : ""
              }`}
            />
          </button>
          <span className={`text-sm ${cycle === "yearly" ? "text-gray-900" : "text-gray-500"}`}>
            Yearly
          </span>
          <span className="ml-1 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
            <FiZap />
            Save ~2 months
          </span>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const isCurrent = currentPlan === p.id;
          const price =
            p.monthly == null
              ? null
              : cycle === "monthly"
              ? p.monthly
              : Math.round((p.yearly / 12) * 100) / 100;

          const isCurrentFree = isCurrent && p.id === "free";

        return (
          <div
            key={p.id}
            className={`relative bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col ${
              p.badge ? "ring-1 ring-[#00b39be6]/20" : ""
            }`}
          >
            {/* Badge */}
            {p.badge && (
              <div className="absolute right-3 top-3">
                <span className="text-xs font-semibold bg-[#00b39be6] text-white px-2 py-1 rounded">
                  {p.badge}
                </span>
              </div>
            )}

            {/* Header */}
            <div className="p-5 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                    <FiStar />
                    Current plan
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{p.tagline}</p>

              {/* Price */}
              {price !== null ? (
                <div className="mt-4">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    {price !== 0 && (
                      <span className="text-sm text-gray-500 mb-1">
                        /mo {cycle === "yearly" && <span className="ml-1">(billed yearly)</span>}
                      </span>
                    )}
                  </div>
                  {cycle === "yearly" && p.yearly > 0 && (
                    <div className="text-xs text-emerald-700 mt-1">
                      Pay ${p.yearly}/yr (save ~${p.monthly * 2})
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 text-3xl font-bold">Custom</div>
              )}
            </div>

            {/* Features */}
            <ul className="p-5 space-y-2 flex-1">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  {f.value === true ? (
                    <FiCheck className="min-w-[1rem] mt-0.5 text-emerald-600" />
                  ) : f.value === false ? (
                    <FiMinus className="min-w-[1rem] mt-0.5 text-gray-400" />
                  ) : (
                    <FiCheck className="min-w-[1rem] mt-0.5 text-[#00b39be6]" />
                  )}
                  <span className="text-gray-700">
                    {f.label}{" "}
                    {typeof f.value === "string" && (
                      <span className="text-gray-500">({f.value})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="p-5 border-t">
              <button
                onClick={() => handleSelect(p.id)}
                disabled={loadingPlan === p.id || isCurrentFree}
                aria-disabled={loadingPlan === p.id || isCurrentFree}
                className={`w-full py-2 rounded-md font-medium transition ${
                  isCurrent
                      ? isCurrentFree
                        ? "border text-gray-500 cursor-not-allowed bg-gray-50"
                        : "border text-[#00b39be6] hover:bg-gray-50"
                      : "bg-[#00b39be6] text-white hover:opacity-90"
                  } disabled:opacity-60`}
              >
                {loadingPlan === p.id
                  ? "Please wait…"
                  : isCurrent
                  ? (p.id === "free" ? "Current plan" : "Manage billing")
                  : p.cta}
              </button>
              <p className="text-[12px] text-gray-500 mt-2 text-center">
                Cancel anytime. No hidden fees.
              </p>
            </div>
          </div>
        )})}
      </div>

      {/* Trust row */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
        <TrustCard
          icon={<FiShield />}
          title="Secure payments"
          text="All payments are processed over encrypted connections."
        />
        <TrustCard
          icon={<FiZap />}
          title="Instant upgrades"
          text="Access premium features as soon as you upgrade."
        />
        <TrustCard
          icon={<FiStar />}
          title="Priority support"
          text="Plus & Pro plans get faster responses from our team."
        />
      </div>

      {/* Compare */}
      <div className="mt-8">
        <button
          onClick={() => setShowCompare((s) => !s)}
          className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 border rounded-md hover:bg-gray-50"
        >
          {showCompare ? <FiChevronUp /> : <FiChevronDown />}
          {showCompare ? "Hide comparison" : "Compare plans"}
        </button>

        {showCompare && <CompareTable plans={plans} />}
      </div>

      {/* Legal */}
      <p className="mt-8 text-xs text-gray-500">
        By subscribing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

function TrustCard({ icon, title, text }) {
  return (
    <div className="bg-white border rounded-xl p-4 flex items-start gap-3">
      <div className="text-[#00b39be6] text-xl">{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-600">{text}</div>
      </div>
    </div>
  );
}

function CompareTable({ plans }) {
  // Build a normalized list of all features
  const allLabels = Array.from(
    new Set(plans.flatMap((p) => p.features.map((f) => f.label)))
  );

  const getFeatureValue = (plan, label) => {
    const found = plan.features.find((f) => f.label === label);
    return found ? found.value : false;
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-[640px] w-full bg-white border rounded-xl overflow-hidden">
        <thead className="bg-gray-50 text-left text-sm">
          <tr>
            <th className="py-3 px-4">Feature</th>
            {plans.map((p) => (
              <th key={p.id} className="py-3 px-4">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {allLabels.map((label) => (
            <tr key={label} className="text-sm">
              <td className="py-3 px-4 font-medium">{label}</td>
              {plans.map((p) => {
                const val = getFeatureValue(p, label);
                return (
                  <td key={p.id} className="py-3 px-4">
                    {val === true ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <FiCheck /> Included
                      </span>
                    ) : val === false ? (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <FiMinus /> —
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        <FiCheck /> {String(val)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
