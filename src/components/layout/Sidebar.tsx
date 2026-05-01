import { BarChart3, LogOut, FolderKanban } from "lucide-react";
import { NavLink } from "react-router-dom";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { useAuthStore } from "@/store/auth.store";
import { classNames } from "@/utils/className";

const navItems = [
  { to: "/projects", label: "My Projects", icon: FolderKanban },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
];

export function Sidebar() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <aside className="sticky top-0 flex h-screen w-[230px] flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-center border-b border-border py-2">
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
                classNames(
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
            classNames(
              "mb-6 flex items-center gap-3 rounded-xl p-2 transition",
              isActive ? "bg-primary-soft" : "hover:bg-surface-muted",
            )
          }
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">MI</div>
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
