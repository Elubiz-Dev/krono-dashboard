import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  Coins,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Receipt,
  Scale,
  Award,
  AlertTriangle,
} from "lucide-react";

export function PartnersTab({
  financials,
  formatCOP,
  onOpenDebtModal,
  agreements,
  onToggleAgreement,
}) {
  const fin = financials;
  const [showLiquidationModal, setShowLiquidationModal] = useState(false);

  return (
    <div className="partners-container">
      {/* Top Banner: Partnership Status */}
      <div className="partnership-status-bar glass-panel glass-panel-gold">
        <div className="status-item">
          <span className="status-label">Sociedad Comercial</span>
          <span className="status-title gold-text">KRONO Timepieces 50/50</span>
        </div>
        <div className="status-item">
          <span className="status-label">Capital Total Inyectado</span>
          <span className="status-title mono-num text-emerald-light">
            {formatCOP(fin.totalCapitalInjected)}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Deuda Activa del Lote</span>
          <span className={`status-title mono-num ${fin.juanRemainingDebt > 0 ? "text-rose-primary" : "text-emerald-light"}`}>
            {fin.juanRemainingDebt > 0 ? formatCOP(fin.juanRemainingDebt) : "Al Día ($0)"}
          </span>
        </div>
        <div className="status-action">
          {fin.juanRemainingDebt > 0 && (
            <button onClick={onOpenDebtModal} className="btn-emerald btn-sm">
              <Coins size={16} />
              Registrar Abono Juan
            </button>
          )}
        </div>
      </div>

      {/* Two Column Side-by-Side: Elian vs Juan */}
      <div className="partners-cards-grid">
        {/* ================= ELIAN NAVARRO ================= */}
        <div className="glass-panel partner-full-card elian-card">
          <div className="card-top-profile">
            <div className="profile-left">
              <div className="partner-avatar bg-emerald">EN</div>
              <div>
                <div className="partner-header-tag">
                  <span className="badge badge-emerald">Socio 1 • 50%</span>
                </div>
                <h3 className="partner-name-lg">Elian Navarro</h3>
                <p className="partner-subtitle">Finanzas, Administración & Kit de Herramientas</p>
              </div>
            </div>
            <div className="status-pill-ok">
              <CheckCircle2 size={16} className="text-emerald-light" />
              <span>Aporte Lote 100% Al Día</span>
            </div>
          </div>

          <div className="partner-financial-metrics">
            <div className="metric-box">
              <span className="m-label">Aporte Lote Acordado</span>
              <span className="m-val mono-num">{formatCOP(fin.agreedPerPartner)}</span>
              <span className="m-sub text-emerald-light">100% cubierto</span>
            </div>
            <div className="metric-box">
              <span className="m-label">Insumos Propios Pagados</span>
              <span className="m-val mono-num">{formatCOP(fin.elianSupplies)}</span>
              <span className="m-sub">Herramientas ($90k) + Tarjetas ($18.5k)</span>
            </div>
            <div className="metric-box">
              <span className="m-label">Inversión Total Aportada</span>
              <span className="m-val mono-num font-bold text-emerald-light">
                {formatCOP(fin.totalCapitalElian)}
              </span>
              <span className="m-sub">Capital real inyectado a Krono</span>
            </div>
            <div className="metric-box highlight-metric-emerald">
              <span className="m-label">Saldo a Favor por Cobrar</span>
              <span className="m-val mono-num font-bold text-emerald-light">
                {formatCOP(fin.juanRemainingDebt)}
              </span>
              <span className="m-sub">Deuda que Juan le debe saldar</span>
            </div>
          </div>

          <div className="partner-role-breakdown">
            <h4 className="section-mini-title">Responsabilidades y Aportes Clave:</h4>
            <ul className="role-list">
              <li>Adquisición y mantenimiento del kit de herramientas de relojería profesional.</li>
              <li>Suministro de tarjetas de presentación de la marca Krono.</li>
              <li>Control contable, flujo de caja y balances financieros de la sociedad.</li>
              <li>Financiación del diferencial inicial del lote para asegurar el stock de los relojes.</li>
            </ul>
          </div>
        </div>

        {/* ================= JUAN ================= */}
        <div className="glass-panel partner-full-card juan-card">
          <div className="card-top-profile">
            <div className="profile-left">
              <div className="partner-avatar bg-gold">JS</div>
              <div>
                <div className="partner-header-tag">
                  <span className="badge badge-gold">Socio 2 • 50%</span>
                </div>
                <h3 className="partner-name-lg">Juan</h3>
                <p className="partner-subtitle">Ventas Comerciales, Empaque & Punto de Entrega</p>
              </div>
            </div>
            <div className={`status-pill ${fin.juanRemainingDebt > 0 ? "status-pill-pending" : "status-pill-ok"}`}>
              {fin.juanRemainingDebt > 0 ? (
                <>
                  <AlertTriangle size={16} className="text-amber-primary" />
                  <span>Resta {formatCOP(fin.juanRemainingDebt)}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} className="text-emerald-light" />
                  <span>Lote 100% Saldado</span>
                </>
              )}
            </div>
          </div>

          <div className="partner-financial-metrics">
            <div className="metric-box">
              <span className="m-label">Aporte Lote Entregado</span>
              <span className="m-val mono-num">{formatCOP(fin.juanLotPaid)}</span>
              <span className="m-sub">Inicial ($80k) + Abono ($10k)</span>
            </div>
            <div className="metric-box">
              <span className="m-label">Insumos Propios Pagados</span>
              <span className="m-val mono-num">{formatCOP(fin.juanSupplies)}</span>
              <span className="m-sub">Bolsas ($24k) + Microfibras ($18k)</span>
            </div>
            <div className="metric-box">
              <span className="m-label">Inversión Total Aportada</span>
              <span className="m-val mono-num font-bold text-gold-light">
                {formatCOP(fin.totalCapitalJuan)}
              </span>
              <span className="m-sub">Capital real inyectado a Krono</span>
            </div>
            <div className={`metric-box ${fin.juanRemainingDebt > 0 ? "highlight-metric-rose" : "highlight-metric-emerald"}`}>
              <span className="m-label">Deuda Pendiente a Elian</span>
              <span className="m-val mono-num font-bold" style={{ color: fin.juanRemainingDebt > 0 ? "var(--rose-primary)" : "var(--emerald-light)" }}>
                {fin.juanRemainingDebt > 0 ? formatCOP(fin.juanRemainingDebt) : "$0 COP"}
              </span>
              <span className="m-sub">
                {fin.juanRemainingDebt > 0 ? "Para completar los $130k del lote" : "Lote completamente pagado"}
              </span>
            </div>
          </div>

          {/* Progress Bar of Juan's Debt Payoff */}
          <div className="debt-progress-container">
            <div className="debt-progress-header">
              <span className="text-sm font-semibold text-muted">Progreso de Pago del Lote Base:</span>
              <span className="mono-num text-sm font-bold text-gold-light">
                {formatCOP(fin.juanLotPaid)} / {formatCOP(fin.agreedPerPartner)} ({fin.juanDebtProgress}%)
              </span>
            </div>
            <div className="progress-bar-bg-lg">
              <div
                className="progress-bar-fill-gold"
                style={{ width: `${fin.juanDebtProgress}%` }}
              />
            </div>
            {fin.juanRemainingDebt > 0 && (
              <div className="debt-actions-row">
                <span className="text-xs text-dim">
                  Abonó $80,000 el 11/10 y $10,000 en abono posterior.
                </span>
                <button onClick={onOpenDebtModal} className="btn-emerald btn-xs">
                  <Coins size={14} /> Registrar Abono
                </button>
              </div>
            )}
          </div>

          <div className="partner-role-breakdown">
            <h4 className="section-mini-title">Responsabilidades y Aportes Clave:</h4>
            <ul className="role-list">
              <li>Punto de atención y ventas directas presenciales (2ª venta concretada en casa de Juan).</li>
              <li>Suministro de empaques y bolsas de cartón de presentación.</li>
              <li>Paños de microfibra de alta calidad para pulido y cuidado de los cronógrafos.</li>
              <li>Comercialización directa y captación de clientes de relojería.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Rules and Operating Agreements Section */}
      <div className="glass-panel agreements-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">📌 Reglas de Oro y Acuerdos de Sociedad</h3>
            <p className="panel-subtitle">Acuerdos formales establecidos para el crecimiento sustentable de Krono</p>
          </div>
          <span className="badge badge-emerald">Vigentes</span>
        </div>

        <div className="agreements-list">
          {agreements.map((agr) => (
            <div key={agr.id} className="agreement-item glass-panel">
              <div className="agr-left">
                <div className="agr-check-box" onClick={() => onToggleAgreement(agr.id)}>
                  <CheckCircle2 size={20} className={agr.active ? "text-emerald-light" : "text-dim"} />
                </div>
                <div>
                  <h4 className="agr-title">{agr.title}</h4>
                  <p className="agr-desc">{agr.desc || agr.description}</p>
                </div>
              </div>
              <span className="badge badge-gold">{agr.category || "Acuerdo"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
