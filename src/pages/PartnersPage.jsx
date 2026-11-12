import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Coins, PlusCircle, Trash2, Crown, Sparkles } from "lucide-react";
import { FounderMindsetBar } from "../components/FounderMindsetBar";

export function PartnersPage({ financials: fin, formatCOP, onOpenDebtModal, agreements, onToggleAgreement, onAddAgreement, isEditMode }) {
  const [showNewAgrForm, setShowNewAgrForm] = useState(false);
  const [newAgrTitle, setNewAgrTitle] = useState("");
  const [newAgrDesc, setNewAgrDesc] = useState("");
  const [newAgrCat, setNewAgrCat] = useState("Acuerdo");

  const handleAddAgr = () => {
    if (!newAgrTitle.trim()) return;
    onAddAgreement({ id: `agr-${Date.now()}`, title: newAgrTitle, description: newAgrDesc, category: newAgrCat, active: true });
    setNewAgrTitle(""); setNewAgrDesc(""); setShowNewAgrForm(false);
  };

  return (
    <div className="page-layout">
      {/* Society header */}
      <div className="society-banner dash-panel">
        <div className="sb-metric"><span className="sbm-label">Sociedad</span><strong className="sbm-val text-indigo font-bold">KRONO Timepieces • Sociedad Fundadora 50/50</strong></div>
        <div className="sb-divv" />
        <div className="sb-metric"><span className="sbm-label">Capital Total Inyectado</span><strong className="sbm-val mono-num text-emerald">{formatCOP(fin.totalCapitalInjected)}</strong></div>
        <div className="sb-divv" />
        <div className="sb-metric"><span className="sbm-label">Deuda Activa del Lote</span><strong className={`sbm-val mono-num ${fin.juanRemainingDebt > 0 ? "text-rose" : "text-emerald"}`}>{fin.juanRemainingDebt > 0 ? formatCOP(fin.juanRemainingDebt) : "$0 — Saldada"}</strong></div>
        {fin.juanRemainingDebt > 0 && (
          <button className="btn-sm btn-emerald" onClick={onOpenDebtModal}><Coins size={15}/>Registrar Abono Juan</button>
        )}
      </div>

      <FounderMindsetBar />

      {/* Two partner cards */}
      <div className="partners-grid">
        {/* ELIAN */}
        <div className="partner-card" style={{ "--pc-color": "#10b981" }}>
          <div className="pc-header">
            <div className="pc-avatar" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981" }}>EN</div>
            <div>
              <div className="pc-badge-row"><span className="badge badge-emerald">Cofundador • 50%</span></div>
              <h3 className="pc-name">Elian Navarro</h3>
              <p className="pc-role">Finanzas, Administración & Herramientas</p>
            </div>
            <div className="pc-status status-ok">
              <CheckCircle2 size={14}/> Aporte 100%
            </div>
          </div>

          <div className="pc-metrics-grid">
            <div className="pcm-box"><span className="pcm-label">Aporte Acordado</span><strong className="pcm-val mono-num">{formatCOP(fin.agreedPerPartner)}</strong><span className="pcm-sub text-emerald">100% cubierto</span></div>
            <div className="pcm-box"><span className="pcm-label">Insumos Propios</span><strong className="pcm-val mono-num">{formatCOP(fin.elianSupplies)}</strong><span className="pcm-sub">Herramientas + Tarjetas</span></div>
            <div className="pcm-box highlight-emerald"><span className="pcm-label">Capital Total</span><strong className="pcm-val mono-num text-emerald">{formatCOP(fin.totalCapitalElian)}</strong></div>
            <div className="pcm-box highlight-emerald"><span className="pcm-label">Deuda Juan por cobrar</span><strong className="pcm-val mono-num text-emerald">{formatCOP(fin.juanRemainingDebt || 30000)}</strong></div>
            <div className="pcm-box highlight-indigo" style={{ gridColumn: "span 2" }}>
              <span className="pcm-label">👑 Préstamo Rolex Elian ($60.000)</span>
              <strong className="pcm-val mono-num text-indigo">¡Recuperado!</strong>
              <span className="pcm-sub">$60.000 descontados y recuperados íntegramente de ventas</span>
            </div>
          </div>

          <div className="pc-roles">
            <h5 className="pcr-title">Responsabilidades</h5>
            <ul className="pcr-list">
              <li>Herramientas de relojería y pilas para reparación y entrega</li>
              <li>Tarjetas de presentación de la marca KRONO</li>
              <li>Control financiero, contabilidad y balances</li>
              <li>Financiación del diferencial del lote base</li>
            </ul>
          </div>
        </div>

        {/* JUAN */}
        <div className="partner-card" style={{ "--pc-color": "#818cf8" }}>
          <div className="pc-header">
            <div className="pc-avatar" style={{ background: "rgba(129,140,248,0.2)", color: "#818cf8" }}>JS</div>
            <div>
              <div className="pc-badge-row"><span className="badge badge-indigo">Cofundador • 50%</span></div>
              <h3 className="pc-name">Juan</h3>
              <p className="pc-role">Ventas Comerciales, Empaque & Logística</p>
            </div>
            <div className={`pc-status ${fin.juanRemainingDebt > 0 ? "status-pending" : "status-ok"}`}>
              {fin.juanRemainingDebt > 0 ? <><AlertTriangle size={14}/> Debe {formatCOP(fin.juanRemainingDebt)}</> : <><CheckCircle2 size={14}/> Saldado</>}
            </div>
          </div>

          <div className="pc-metrics-grid">
            <div className="pcm-box"><span className="pcm-label">Aporte Entregado</span><strong className="pcm-val mono-num">{formatCOP(fin.juanLotPaid)}</strong><span className="pcm-sub">$80k inicial + $20k abonos</span></div>
            <div className="pcm-box"><span className="pcm-label">Insumos Propios</span><strong className="pcm-val mono-num">{formatCOP(fin.juanSupplies)}</strong><span className="pcm-sub">Bolsas + Microfibras</span></div>
            <div className="pcm-box highlight-indigo"><span className="pcm-label">Capital Total</span><strong className="pcm-val mono-num text-indigo">{formatCOP(fin.totalCapitalJuan)}</strong></div>
            <div className={`pcm-box ${fin.juanRemainingDebt > 0 ? "highlight-rose" : "highlight-emerald"}`}>
              <span className="pcm-label">Deuda a saldar con Elian</span>
              <strong className={`pcm-val mono-num ${fin.juanRemainingDebt > 0 ? "text-rose" : "text-emerald"}`}>{formatCOP(fin.juanRemainingDebt || 30000)}</strong>
            </div>
          </div>

          <div className="pc-debt-progress">
            <div className="pdp-labels">
              <span>Progreso pago del lote</span>
              <span className="mono-num text-indigo">{formatCOP(fin.juanLotPaid)} / {formatCOP(fin.agreedPerPartner)} ({fin.juanDebtProgress}%)</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill-indigo" style={{ width: `${fin.juanDebtProgress}%` }} />
            </div>
            {fin.juanRemainingDebt > 0 && (
              <button className="btn-sm btn-emerald mt-1" onClick={onOpenDebtModal}><Coins size={14}/> Registrar abono</button>
            )}
          </div>

          <div className="pc-roles">
            <h5 className="pcr-title">Responsabilidades</h5>
            <ul className="pcr-list">
              <li>Punto de ventas presencial en su residencia</li>
              <li>Bolsas de cartón de lujo para entrega de relojes</li>
              <li>Paños de microfibra para pulido y presentación</li>
              <li>Captación directa de clientes y redes de contacto</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resumen Oficial de Liquidación de Inventario Restante */}
      <div className="dash-panel" style={{ border: "1px solid rgba(129,140,248,0.25)" }}>
        <div className="panel-head">
          <div>
            <h3 className="panel-title text-indigo font-bold">Liquidación Proyectada: Cierre de Inventario Restante</h3>
            <p className="panel-subtitle" style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "var(--text-dim)" }}>
              20 Relojes restantes (5 Invictas L1, 3 Rolex L2 y 12 Lote 3) con liquidación a $0 deuda y cuentas entre socios.
            </p>
          </div>
          <span className="badge badge-indigo">Balance Oficial Krono</span>
        </div>

        <div className="summary-table" style={{ marginTop: 12 }}>
          <div className="st-row">
            <span className="st-label">1. Ingresos Brutos por Entrar (20 Relojes: 5 Invictas + 3 Rolex + 12 Lote 3)</span>
            <span className="st-val mono-num text-emerald">+{formatCOP(fin.totalGrossRemainingRevenue || 1800000)}</span>
          </div>
          <div className="st-row">
            <span className="st-label">2. Descuento Inversión Pendiente ($20k Invictas para $0 Deuda; Rolex 100% saldado)</span>
            <span className="st-val mono-num text-rose">-{formatCOP(fin.totalPendingInvestmentRecovery || 20000)}</span>
          </div>
          <div className="st-row st-row-bold">
            <span className="st-label">3. Ganancia Neta Limpia Total Proyectada</span>
            <span className="st-val mono-num text-emerald font-bold">+{formatCOP(fin.netCleanProfitRemaining || 1373000)}</span>
          </div>
          <div className="st-row">
            <span className="st-label">4. Reparto 50 / 50 Base Total</span>
            <span className="st-val mono-num text-main">{formatCOP(fin.netCleanProfit50Each || 686500)} c/u</span>
          </div>
          <div className="st-row">
            <span className="st-label">👑 Ajuste Elian: Préstamo Rolex ($60.000)</span>
            <span className="st-val mono-num text-indigo">¡100% Recuperado! (Descontado de ventas)</span>
          </div>
          <div className="st-row">
            <span className="st-label">🤝 Ajuste Juan: Pago de Deuda pendiente de Juan a Elian</span>
            <span className="st-val mono-num text-rose">-{formatCOP(fin.juanRemainingDebt || 30000)}</span>
          </div>
          <div className="st-row st-row-bold" style={{ background: "rgba(16,185,129,0.08)" }}>
            <span className="st-label text-emerald">💰 Pago Final Neto a Recibir: ELIAN NAVARRO</span>
            <span className="st-val mono-num text-emerald" style={{ fontSize: "1.05rem" }}>{formatCOP(fin.elianFinalProjectedPayout || 716500)}</span>
          </div>
          <div className="st-row st-row-bold" style={{ background: "rgba(129,140,248,0.08)" }}>
            <span className="st-label text-indigo">💰 Pago Final Neto a Recibir: JUAN</span>
            <span className="st-val mono-num text-indigo" style={{ fontSize: "1.05rem" }}>{formatCOP(fin.juanFinalProjectedPayout || 656500)}</span>
          </div>
        </div>
      </div>

      {/* Agreements Panel */}
      <div className="dash-panel">
        <div className="panel-head">
          <h3 className="panel-title">📌 Acuerdos y Reglas del Negocio</h3>
          {isEditMode && (
            <button className="btn-xs btn-outline" onClick={()=>setShowNewAgrForm(true)}>
              <PlusCircle size={13}/> Nuevo Acuerdo
            </button>
          )}
        </div>

        {showNewAgrForm && (
          <div className="agr-new-form">
            <input className="form-input-sm" placeholder="Título del acuerdo..." value={newAgrTitle} onChange={e=>setNewAgrTitle(e.target.value)} />
            <input className="form-input-sm" placeholder="Descripción..." value={newAgrDesc} onChange={e=>setNewAgrDesc(e.target.value)} />
            <select className="form-input-sm" value={newAgrCat} onChange={e=>setNewAgrCat(e.target.value)}>
              <option>Acuerdo</option><option>Estrategia</option><option>Sociedad</option><option>Crecimiento</option>
            </select>
            <div className="agr-form-actions">
              <button className="btn-xs btn-emerald" onClick={handleAddAgr}>Guardar</button>
              <button className="btn-xs btn-outline" onClick={()=>setShowNewAgrForm(false)}>Cancelar</button>
            </div>
          </div>
        )}

        <div className="agreements-list">
          {agreements.map(agr => (
            <div key={agr.id} className={`agr-row ${agr.active ? "agr-active" : "agr-inactive"}`}>
              <button className="agr-check" onClick={()=>onToggleAgreement(agr.id)}>
                <CheckCircle2 size={18} style={{ color: agr.active ? "#10b981" : "#475569" }} />
              </button>
              <div className="agr-body">
                <h4 className="agr-title">{agr.title}</h4>
                <p className="agr-desc">{agr.description}</p>
              </div>
              <span className="badge badge-indigo">{agr.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
