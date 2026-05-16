import { BarChart3, LogOut, FolderKanban } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useProfileQuery } from "@/features/profile/hooks";
import { useAuthStore } from "@/store/auth.store";
import { classNames } from "@/utils/className";

const navItems = [
  { to: "/projects", label: "My Projects", icon: FolderKanban },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
];

export function Sidebar() {
  const signOut = useAuthStore((state) => state.signOut);
  const queryClient = useQueryClient();
  const { data: profile } = useProfileQuery();

  function handleSignOut() {
    queryClient.removeQueries({ queryKey: ["profile"] });
    signOut();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[230px] flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <img
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          alt="HopIn logo"
          className="h-10 w-10"
        />
        <span className="text-lg font-semibold text-text-primary">HopIn</span>
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
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
            {profile?.avatarInitials ?? "—"}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{profile?.fullName ?? ""}</p>
            <p className="text-xs text-text-secondary">{profile?.email ?? ""}</p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
