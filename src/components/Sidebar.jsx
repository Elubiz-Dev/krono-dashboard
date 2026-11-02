import React from "react";
import {
  LayoutDashboard, Wallet, Users, Package,
  Target, LogOut, ChevronLeft, ChevronRight,
  AlertCircle, TrendingUp
} from "lucide-react";

const navItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "cashflow", label: "Flujo de Caja", icon: Wallet },
  { id: "partners", label: "Socios", icon: Users },
  { id: "inventory", label: "Inventario", icon: Package },
  { id: "strategy", label: "Estrategia", icon: Target },
];

export function Sidebar({ activePage, setActivePage, collapsed, setCollapsed, activeUser, partner, onLogout, juanRemainingDebt }) {
  const userColor = activeUser?.color || (activeUser?.id === "elian" ? "#10b981" : "#818cf8");

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      {/* Logo section */}
      <div className="sidebar-logo-section">
        <div className="sidebar-logo-wrap">
          <img
            src="/assets/krono_logo.png"
            alt="KRONO"
            className="sidebar-logo-img"
          />
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">KRONO</span>
            <span className="sidebar-brand-sub">Finanzas</span>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        className="sidebar-collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expandir" : "Colapsar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Nav Items */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const showAlert = item.id === "partners" && juanRemainingDebt > 0;

          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
              title={collapsed ? item.label : undefined}
              style={isActive ? { "--active-color": userColor } : {}}
            >
              <div className="nav-icon-wrap">
                <Icon size={20} />
                {showAlert && <span className="nav-alert-dot" />}
              </div>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {isActive && !collapsed && <span className="nav-active-bar" style={{ background: userColor }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom user profile */}
      <div className="sidebar-user-section">
        <div className="sidebar-user-avatar" style={{ background: `linear-gradient(135deg, ${userColor}40, ${userColor}20)`, border: `1.5px solid ${userColor}60` }}>
          <span style={{ color: userColor, fontSize: "0.9rem", fontWeight: 800 }}>
            {partner?.avatarInitials || activeUser?.name?.slice(0,2).toUpperCase() || "?"}
          </span>
        </div>
        {!collapsed && (
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{activeUser?.name}</span>
            <span className="sidebar-user-role" style={{ color: userColor }}>
              Cofundador • {activeUser?.id === "elian" ? "Finanzas" : "Ventas"}
            </span>
          </div>
        )}
        <button className="sidebar-logout-btn" onClick={onLogout} title="Cambiar cuenta">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
