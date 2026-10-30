import React, { useState } from "react";
import {
  Wallet, TrendingUp, Sparkles, Coins, ArrowUpRight, ArrowDownRight,
  Calendar, CheckCircle2, Edit2, Check, X, Shield, Package
} from "lucide-react";
import { FinancialCharts } from "../components/FinancialCharts";

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
      color: "#e5b869",
      icon: TrendingUp,
      badge: `${fin.salesCountCompleted + fin.salesCountPending} Relojes`,
      badgeClass: "badge-gold",
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
          <button className="btn-sm btn-gold" onClick={() => { if(window.confirm("¿Marcar como cobrado?")) { onUpdateTx(pendingSale.id, { status: "completado" }); }}}>
            <CheckCircle2 size={14}/> Marcar Cobrado
          </button>
        </div>
      )}

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

      {/* Charts + Settlement Row */}
      <div className="two-col-grid">
        {/* Left: Financial Summary Table */}
        <div className="dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Resumen Contable del Lote</h3>
            <span className="badge badge-gold">Lote Inicial Invicta</span>
          </div>
          <div className="summary-table">
            {[
              { label: "Inversión Total del Lote (7 relojes)", val: formatCOP(fin.lotBaseCost), color: "#f43f5e" },
              { label: "Ventas Cobradas (3 relojes)", val: `+${formatCOP(fin.totalSalesCompleted)}`, color: "#10b981" },
              { label: "Ventas Pendientes (30 Oct)", val: `+${formatCOP(fin.totalSalesPending)}`, color: "#f59e0b" },
              { label: "Insumos y Gastos Operativos", val: `-${formatCOP(fin.totalSupplies)}`, color: "#f43f5e" },
              { label: "Ganancia Bruta del Lote", val: `+${formatCOP(fin.lotGrossProfit)}`, color: "#10b981", bold: true },
              { label: "Fondo Re-inversión 50%", val: formatCOP(fin.reinvestmentFund50), color: "#06b6d4" },
              { label: "Utilidad a Distribuir 50/50", val: formatCOP(fin.distributableProfit50), color: "#e5b869", bold: true },
            ].map((row, i) => (
              <div key={i} className={`st-row ${row.bold ? "st-row-bold" : ""}`}>
                <span className="st-label">{row.label}</span>
                <span className="st-val mono-num" style={{ color: row.color }}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Settlement */}
        <div className="dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Liquidación Equitativa</h3>
            <span className="badge badge-emerald">50/50 Krono</span>
          </div>
          <div className="settlement-grid">
            {[
              { name: "Elian Navarro", init: "EN", color: "#10b981", aporte: fin.elianLotPaid, insumos: fin.elianSupplies, total: fin.totalCapitalElian, ganancia: fin.elianNominalProfit, extra: fin.juanRemainingDebt, extraLabel: "Deuda Juan por cobrar" },
              { name: "Juan", init: "JS", color: "#e5b869", aporte: fin.juanLotPaid, insumos: fin.juanSupplies, total: fin.totalCapitalJuan, ganancia: fin.juanNominalProfit, extra: -fin.juanRemainingDebt, extraLabel: "Deuda pendiente a descontar" },
            ].map((s, i) => (
              <div key={i} className="settle-box" style={{ "--settle-color": s.color }}>
                <div className="sb-header">
                  <div className="sb-avatar" style={{ background: `${s.color}25`, color: s.color }}>{s.init}</div>
                  <div><strong className="sb-name">{s.name}</strong></div>
                </div>
                <div className="sb-rows">
                  <div className="sb-row"><span>Aporte lote:</span><span className="mono-num">{formatCOP(s.aporte)}</span></div>
                  <div className="sb-row"><span>Insumos propios:</span><span className="mono-num">{formatCOP(s.insumos)}</span></div>
                  <div className="sb-row sb-total"><span>Capital total:</span><span className="mono-num" style={{ color: s.color }}>{formatCOP(s.total)}</span></div>
                  <div className="sb-divider" />
                  <div className="sb-row"><span>Ganancia base 50%:</span><span className="mono-num">{formatCOP(s.ganancia)}</span></div>
                  <div className="sb-row" style={{ color: s.extra >= 0 ? "#10b981" : "#f43f5e" }}>
                    <span>{s.extraLabel}:</span>
                    <span className="mono-num">{s.extra >= 0 ? "+" : ""}{formatCOP(Math.abs(s.extra))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="settle-note">
            <Shield size={14} />
            <span>Transparencia total: Juan descuenta su deuda pendiente de las utilidades que le corresponden.</span>
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
