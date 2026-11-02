import React, { useState } from "react";
import {
  Wallet, TrendingUp, Sparkles, Coins, ArrowUpRight, ArrowDownRight,
  Calendar, CheckCircle2, Edit2, Check, X, Shield, Package
} from "lucide-react";
import { FinancialCharts } from "../components/FinancialCharts";
import { FounderMindsetBar } from "../components/FounderMindsetBar";
import { KronoVision50 } from "../components/KronoVision50";

function EditableValue({ value, onSave, isEditMode, format, suffix = "" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  if (!isEditMode) return <span>{format ? format(value) : value}{suffix}</span>;
  if (editing) return (
    <span className="inline-edit-wrap">
      <input className="inline-input" value={draft} onChange={e => setDraft(e.target.value)} autoFocus onKeyDown={e => { if (e.key === "Enter") { onSave(Number(draft) || draft); setEditing(false); } if (e.key === "Escape") setEditing(false); }} />
      <button className="ie-btn ie-save" onClick={() => { onSave(Number(draft) || draft); setEditing(false); }}><Check size={12}/></button>
      <button className="ie-btn ie-cancel" onClick={() => setEditing(false)}><X size={12}/></button>
    </span>
  );
  return (
    <span className="editable-val" onClick={() => setEditing(true)}>
      {format ? format(value) : value}{suffix}
      <Edit2 size={11} className="edit-pencil" />
    </span>
  );
}

export function OverviewPage({ financials: fin, formatCOP, onOpenDebtModal, onOpenNewTx, isEditMode, onUpdateTx, transactions, activeUser }) {
  const pendingSale = transactions.find(t => t.status === "pendiente" && t.category === "cuenta_cobrar");

  const kpiCards = [
    {
      label: "Efectivo en Caja",
      value: formatCOP(fin.cashInHand),
      sub: `Proyectado al cobrar 30 Oct: ${formatCOP(fin.cashProjected)}`,
      color: "#10b981",
      icon: Wallet,
      badge: "Disponible Hoy",
      badgeClass: "badge-emerald",
      up: true,
    },
    {
      label: "Ventas del Lote",
      value: formatCOP(fin.totalSalesAll),
      sub: `3 cobradas + 1 pendiente (${formatCOP(fin.totalSalesPending)})`,
      color: "#818cf8",
      icon: TrendingUp,
      badge: `${fin.salesCountCompleted + fin.salesCountPending} Relojes`,
      badgeClass: "badge-indigo",
      up: true,
    },
    {
      label: "Fondo Rolex (50%)",
      value: formatCOP(fin.reinvestmentFund50),
      sub: `Meta: ${formatCOP(600000)} — ${Math.round((fin.reinvestmentFund50/600000)*100)}% completado`,
      color: "#06b6d4",
      icon: Sparkles,
      badge: "Re-inversión",
      badgeClass: "badge-cyan",
      up: null,
    },
    {
      label: "Deuda Juan → Elian",
      value: fin.juanRemainingDebt > 0 ? formatCOP(fin.juanRemainingDebt) : "¡Saldada! 🎉",
      sub: `Juan abonó ${formatCOP(fin.juanLotPaid)} de ${formatCOP(fin.agreedPerPartner)} (${fin.juanDebtProgress}%)`,
      color: fin.juanRemainingDebt > 0 ? "#f43f5e" : "#10b981",
      icon: Coins,
      badge: fin.juanRemainingDebt > 0 ? "Pendiente" : "Al Día",
      badgeClass: fin.juanRemainingDebt > 0 ? "badge-rose" : "badge-emerald",
      up: fin.juanRemainingDebt === 0,
    },
  ];

  const activityItems = [...transactions].slice(0, 6);

  return (
    <div className="page-layout">
      {/* Alert banner */}
      {pendingSale && (
        <div className="alert-banner">
          <div className="ab-icon"><Calendar size={18} /></div>
          <div className="ab-body">
            <strong>Cobro Pendiente: 30 de Octubre</strong>
            <p>La 4ª venta de reloj Invicta (amiga) por <strong>{formatCOP(pendingSale.amount)}</strong> debe cobrarse hoy en la quincena.</p>
          </div>
          <button className="btn-sm btn-indigo" onClick={() => { if(window.confirm("¿Marcar como cobrado?")) { onUpdateTx(pendingSale.id, { status: "completado" }); }}}>
            <CheckCircle2 size={14}/> Marcar Cobrado
          </button>
        </div>
      )}

      {/* Banner Resumen Inventario Restante Actualizado */}
      <FounderMindsetBar />

      <div className="society-banner dash-panel" style={{ border: "1px solid rgba(99, 102, 241, 0.35)", marginBottom: 20 }}>
        <div className="sb-metric">
          <span className="sbm-label">Inventario Restante (5 Invictas + 4 Rolex)</span>
          <strong className="sbm-val mono-num text-emerald">+{formatCOP(fin.totalGrossRemainingRevenue || 805000)}</strong>
          <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Ingreso bruto por entrar</span>
        </div>
        <div className="sb-divv" />
        <div className="sb-metric">
          <span className="sbm-label">Faltante a Saldar ($0 Deuda)</span>
          <strong className="sbm-val mono-num text-rose">-{formatCOP(fin.totalPendingInvestmentRecovery || 40000)}</strong>
          <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>$20k Invictas + $20k Rolex</span>
        </div>
        <div className="sb-divv" />
        <div className="sb-metric">
          <span className="sbm-label">Ganancia Neta Limpia (50/50)</span>
          <strong className="sbm-val mono-num text-emerald" style={{ textShadow: "0 0 12px rgba(16, 185, 129, 0.3)" }}>{formatCOP(fin.netCleanProfitRemaining || 765000)}</strong>
          <span style={{ fontSize: "0.72rem", color: "#34d399" }}>{formatCOP(fin.netCleanProfit50Each || 382500)} c/u</span>
        </div>
        <div className="sb-divv" />
        <div className="sb-metric">
          <span className="sbm-label">Deuda Juan a Elian</span>
          <strong className="sbm-val mono-num text-rose">{formatCOP(fin.juanRemainingDebt || 37000)}</strong>
          <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Juan debe $37k</span>
        </div>
        <div className="sb-divv" />
        <div className="sb-metric">
          <span className="sbm-label">Retiro Rolex Elian</span>
          <strong className="sbm-val mono-num text-indigo">+{formatCOP(fin.elianRolexAdvance || 60000)}</strong>
          <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Capital puesto por Elian</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="kpi-card" style={{ "--kpi-color": card.color }}>
              <div className="kpi-card-top">
                <div className="kpi-icon-box" style={{ background: `${card.color}18`, border: `1px solid ${card.color}40` }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <span className={`badge ${card.badgeClass}`}>{card.badge}</span>
              </div>
              <p className="kpi-label">{card.label}</p>
              <h3 className="kpi-value mono-num" style={{ color: card.color }}>{card.value}</h3>
              <p className="kpi-sub">{card.sub}</p>
              {card.label === "Deuda Juan → Elian" && fin.juanRemainingDebt > 0 && (
                <>
                  <div className="kpi-progress-bar">
                    <div className="kpi-progress-fill" style={{ width: `${fin.juanDebtProgress}%`, background: "#10b981" }} />
                  </div>
                  <button className="btn-xs btn-emerald mt-1" onClick={onOpenDebtModal}>+ Registrar Abono</button>
                </>
              )}
            </div>
          );
        })}
      </div>
 
      {/* Interactive Visual Analytics & Charts */}
      <FinancialCharts financials={fin} transactions={transactions} formatCOP={formatCOP} />

      {/* Plan de Cosecha & Sueldo Mensual Limpio (Meta 50 Relojes) */}
      <KronoVision50 formatCOP={formatCOP} currentWatches={14} />

      {/* Resumen Oficial de Cierre de Inventario (8 Invictas & 6 Rolex) */}
      <div className="dash-panel" style={{ border: "1px solid rgba(129, 140, 248, 0.25)" }}>
        <div className="panel-head">
          <div>
            <h3 className="panel-title text-indigo font-bold">Balance del Negocio: Lotes Activos (8 Invictas & 6 Rolex)</h3>
            <p className="panel-subtitle" style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "var(--text-dim)" }}>
              Catálogo de 14 relojes: 5 unidades ya vendidas/entregadas y 9 unidades restantes en rotación para liquidar a $0 deuda.
            </p>
          </div>
          <span className="badge badge-indigo">Krono 50/50</span>
        </div>

        <div className="summary-table" style={{ marginTop: 14 }}>
          <div className="st-row">
            <span className="st-label">📦 Catálogo Total Adquirido</span>
            <span className="st-val mono-num text-main">14 Relojes (8 Invictas + 6 Rolex pedidos)</span>
          </div>
          <div className="st-row">
            <span className="st-label">✅ Relojes ya Vendidos / Salidos</span>
            <span className="st-val mono-num text-emerald">5 Unidades (3 Invictas cobrados + 2 Rolex entregados)</span>
          </div>
          <div className="st-row">
            <span className="st-label">⏳ Inventario Restante por Entrar</span>
            <span className="st-val mono-num text-main">9 Unidades (1 Invicta neg $85k + 4 Invictas $320k + 4 Rolex $400k)</span>
          </div>
          <div className="st-row">
            <span className="st-label">💵 Total Ingreso Bruto por Entrar</span>
            <span className="st-val mono-num text-emerald" style={{ fontWeight: 700 }}>+{formatCOP(fin.totalGrossRemainingRevenue || 805000)}</span>
          </div>
          <div className="st-row">
            <span className="st-label">📉 Descuento Inversión Pendiente (Para $0 Deuda)</span>
            <span className="st-val mono-num text-rose">-{formatCOP(fin.totalPendingInvestmentRecovery || 40000)} ($20k Invictas + $20k Rolex)</span>
          </div>
          <div className="st-row st-row-bold" style={{ background: "rgba(129, 140, 248, 0.08)" }}>
            <span className="st-label text-indigo font-bold">💰 Ganancia Neta Limpia Total Proyectada</span>
            <span className="st-val mono-num text-emerald font-bold" style={{ fontSize: "1.1rem" }}>+{formatCOP(fin.netCleanProfitRemaining || 765000)}</span>
          </div>
          <div className="st-row">
            <span className="st-label">🤝 Reparto Equitativo 50 / 50</span>
            <span className="st-val mono-num text-main">{formatCOP(fin.netCleanProfit50Each || 382500)} para Elian • {formatCOP(fin.netCleanProfit50Each || 382500)} para Juan</span>
          </div>
          <div className="st-row">
            <span className="st-label">👑 Ajustes de Socios</span>
            <span className="st-val mono-num text-dim">Juan debe $37.000 a Elian | Elian retira $60.000 puestos para Rolex</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dash-panel">
        <div className="panel-head">
          <h3 className="panel-title">Actividad Reciente</h3>
          <button className="btn-xs btn-outline" onClick={onOpenNewTx}>+ Nueva Operación</button>
        </div>
        <div className="activity-list">
          {activityItems.map((tx) => {
            const isIn = tx.type === "entrada";
            return (
              <div key={tx.id} className="activity-row">
                <div className={`activity-dot ${isIn ? "dot-green" : "dot-red"}`} />
                <div className="activity-info">
                  <span className="activity-desc">{tx.description}</span>
                  <span className="activity-date">{tx.date} — {tx.partner === "elian" ? "Elian" : tx.partner === "juan" ? "Juan" : "Ambos"}</span>
                </div>
                <span className={`activity-amount mono-num ${isIn ? "text-emerald" : "text-rose"}`}>
                  {isIn ? "+" : "-"}{formatCOP(tx.amount)}
                </span>
                <span className={`badge ${tx.status === "completado" ? "badge-emerald" : "badge-amber"}`}>
                  {tx.status === "completado" ? "✓" : "Pendiente"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
