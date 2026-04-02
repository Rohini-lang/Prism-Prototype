import { motion } from "motion/react";
import { Wrench, BarChart3 } from "lucide-react";
import { PrismLogo } from "../components/PrismLogo";

type Role = "dev" | "user";

interface HomePageProps {
  onSelectRole: (role: Role) => void;
}

const roles = [
  {
    id: "dev" as Role,
    title: "Dev Mode",
    description: "Full access to model configuration, raw data exports, and debug tools alongside the analytics dashboard.",
    icon: Wrench,
    color: "#00D4FF",
  },
  {
    id: "user" as Role,
    title: "User Mode",
    description: "Explore dashboards, run analyses, and query insights in a streamlined experience.",
    icon: BarChart3,
    color: "#9B51E0",
  },
];

export function HomePage({ onSelectRole }: HomePageProps) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full text-center"
      >
        {/* Branding */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <PrismLogo size={48} />
          <h1 className="font-display text-5xl tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B51E0] to-[#7B68EE]">
              Prism
            </span>
          </h1>
        </div>
        <p className="text-[#A0A0A0] text-sm mb-2">Counterfactual Pricing Analysis</p>

        {/* Greeting */}
        <div className="mt-10 mb-10">
          <h2 className="font-display text-3xl text-white tracking-tight mb-2">
            Welcome back
          </h2>
          <p className="text-[#A0A0A0] text-sm leading-relaxed">
            Choose how you'd like to explore today.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-6">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <motion.button
                key={role.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                onClick={() => onSelectRole(role.id)}
                className="group p-8 rounded-2xl border-2 border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#9B51E0] hover:bg-[#1E1E1E] transition-all text-left"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-shadow group-hover:shadow-lg"
                  style={{
                    backgroundColor: `${role.color}15`,
                    boxShadow: undefined,
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: role.color }} />
                </div>
                <h3 className="font-display text-xl text-white mb-2 group-hover:text-[#9B51E0] transition-colors">
                  {role.title}
                </h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  {role.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
