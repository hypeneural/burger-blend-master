import { BookOpen, FlaskConical, Flame, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BottomTab = "lab" | "wiki" | "grill" | "tools";

interface BottomNavProps {
  activeTab: BottomTab;
  onChange: (tab: BottomTab) => void;
}

const tabs: { id: BottomTab; label: string; icon: typeof FlaskConical }[] = [
  { id: "lab", label: "Laboratorio", icon: FlaskConical },
  { id: "wiki", label: "Enciclopedia", icon: BookOpen },
  { id: "grill", label: "Minha Grelha", icon: Flame },
  { id: "tools", label: "Ferramentas", icon: Wrench },
];

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-x-1 top-1 h-10 rounded-2xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                />
              )}
              <span
                className={cn(
                  "relative w-9 h-9 rounded-xl flex items-center justify-center",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
