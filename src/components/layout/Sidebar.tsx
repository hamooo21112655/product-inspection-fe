import { NavLink, useLocation } from "react-router-dom";
import {
  Package,
  Building2,
  ClipboardCheck,
  FileBarChart,
  Shield,
} from "lucide-react";

const navItems = [
  { path: "/proizvodi", label: "Proizvodi", icon: Package },
  {
    path: "/inspekcijska-tijela",
    label: "Inspekcijska tijela",
    icon: Building2,
  },
  { path: "/kontrole", label: "Inspekcijske kontrole", icon: ClipboardCheck },
  { path: "/izvjestaji", label: "Izvještaji", icon: FileBarChart },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground text-sm">
              Kontrola kvaliteta
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              BiH Inspekcijski sistem
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">
          © 2026 Inspekcijski sistem BiH
        </p>
      </div>
    </aside>
  );
}
