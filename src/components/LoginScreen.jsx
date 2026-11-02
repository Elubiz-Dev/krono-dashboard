import React, { useState } from "react";
import { Wallet, CheckCircle2, Users } from "lucide-react";

export function LoginScreen({ onLogin, partners }) {
  const [hoveredUser, setHoveredUser] = useState(null);

  const users = [
    {
      id: "elian",
      ...partners.elian,
      color: "#10b981",
      colorBg: "rgba(16,185,129,0.12)",
      colorBorder: "rgba(16,185,129,0.4)",
      badge: "Socio Fundador",
      description: "Cofundador • Control financiero, balances y herramientas.",
      avatarBg: "linear-gradient(135deg, #10b981, #065f46)",
    },
    {
      id: "juan",
      ...partners.juan,
      color: "#818cf8",
      colorBg: "rgba(99,102,241,0.12)",
      colorBorder: "rgba(129,140,248,0.4)",
      badge: "Socio Fundador",
      description: "Cofundador • Estrategia comercial, logística y ventas.",
      avatarBg: "linear-gradient(135deg, #818cf8, #4f46e5)",
    },
  ];

  return (
    <div className="login-screen">
      {/* Background effects */}
      <div className="login-bg-glow login-bg-glow-1" />
      <div className="login-bg-glow login-bg-glow-2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <img
            src="/assets/krono_logo.png"
            alt="KRONO"
            className="login-logo-img"
          />
        </div>

        <div className="login-brand">
          <h1 className="login-brand-name">KRONO</h1>
          <p className="login-brand-sub">Sistema de Gestión Financiera & Asociados</p>
        </div>

        <div className="login-divider">
          <span>¿Quién eres hoy?</span>
        </div>

        <div className="login-users-grid">
          {users.map((user) => (
            <button
              key={user.id}
              className={`login-user-card ${hoveredUser === user.id ? "hovered" : ""}`}
              style={{
                "--user-color": user.color,
                "--user-bg": user.colorBg,
                "--user-border": user.colorBorder,
                "--avatar-bg": user.avatarBg,
              }}
              onMouseEnter={() => setHoveredUser(user.id)}
              onMouseLeave={() => setHoveredUser(null)}
              onClick={() => onLogin({ id: user.id, name: user.name, role: user.role, color: user.color })}
            >
              <div className="login-avatar">{user.avatarInitials}</div>
              <div className="login-user-info">
                <h3 className="login-user-name">{user.name}</h3>
                <p className="login-user-role">{user.role.split("•")[0].trim()}</p>
                <p className="login-user-desc">{user.description}</p>
              </div>
              <div className="login-enter-arrow">→</div>
            </button>
          ))}
        </div>

        <p className="login-footer-note">
          Los datos se guardan localmente en este navegador — accesible sin internet
        </p>
      </div>
    </div>
  );
}
