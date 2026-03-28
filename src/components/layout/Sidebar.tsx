import { BarChart3, LogOut, FolderKanban } from "lucide-react";
import { NavLink } from "react-router-dom";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/utils/cn";

const navItems = [
  { to: "/projects", label: "My Projects", icon: FolderKanban },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
];

export function Sidebar() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <aside className="flex h-screen w-[236px] flex-col border-r border-border bg-surface">
      <div className="flex items-center border-b border-border px-6 py-8">
        <LogoLockup compact />
      </div>

      <nav className="space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition",
                  isActive && "bg-primary-soft text-primary",
                )
              }
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border p-6">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "mb-6 flex items-center gap-3 rounded-xl p-2 transition",
              isActive ? "bg-primary-soft" : "hover:bg-surface-muted",
            )
          }
        >
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">MI</div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Moshe Israeli</p>
            <p className="text-xs text-text-secondary">google-user@example.com</p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
