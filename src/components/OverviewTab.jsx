import React from "react";
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Shield,
  Layers,
} from "lucide-react";

export function OverviewTab({
  financials,
  formatCOP,
  onOpenDebtModal,
  onOpenNewTx,
  inventory,
}) {
  const fin = financials;

  // Simple clean SVG Chart data for daily flow
  const chartDays = [
    { label: "11 Oct", entry: 220000, exit: 60500, balance: 159500 },
    { label: "15 Oct", entry: 85000, exit: 0, balance: 244500 },
    { label: "16 Oct", entry: 75000, exit: 0, balance: 319500 },
    { label: "17 Oct", entry: 0, exit: 90000, balance: 229500 },
    { label: "19 Oct", entry: 80000, exit: 0, balance: 309500 },
    { label: "30 Oct (Est.)", entry: 85000, exit: 0, balance: 394500 },
  ];

  const maxVal = 420000;

  return (
    <div className="overview-container">
      {/* Top Banner Alert for 30 Oct Payment */}
      <div className="alert-banner-gold">
        <div className="alert-content">
          <div className="alert-icon-box">
            <Calendar className="alert-icon" size={20} />
          </div>
          <div>
            <h4 className="alert-title">
              Próximo Cobro Programado: 30 de Octubre (Quincena)
            </h4>
            <p className="alert-desc">
              Hay una cuenta por cobrar de <strong>{formatCOP(85000)}</strong>{" "}
              correspondiente a la 4ª Venta de Reloj Invicta (Amiga). Al registrar el cobro, el
              efectivo físico en caja subirá automáticamente a{" "}
              <span className="mono-num font-bold text-emerald-light">
                {formatCOP(fin.cashProjected)}
              </span>.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenNewTx}
          className="btn-primary-gold btn-sm"
          style={{ whiteSpace: "nowrap" }}
        >
          <CheckCircle2 size={15} />
          Marcar Cobrado
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Card 1: Efectivo en Caja */}
        <div className="glass-panel glass-panel-gold kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-wrapper emerald-glow">
              <Wallet size={22} className="text-emerald-light" />
            </div>
            <span className="badge badge-emerald">En Caja Hoy</span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Efectivo Físico Disponible</span>
            <div className="kpi-value-row">
              <h2 className="kpi-value mono-num emerald-text">
                {formatCOP(fin.cashInHand)}
              </h2>
            </div>
            <p className="kpi-micro-text">
              Proyectado con cobro 30 Oct: <strong>{formatCOP(fin.cashProjected)}</strong>
            </p>
          </div>
          <div className="kpi-footer-strip">
            <div className="kpi-stat">
              <span>Entradas: {formatCOP(fin.totalEntriesCompleted)}</span>
            </div>
            <div className="kpi-stat">
              <span>Insumos: -{formatCOP(fin.totalExits)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ventas del Lote */}
        <div className="glass-panel kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-wrapper gold-glow">
              <TrendingUp size={22} className="text-gold-light" />
            </div>
            <span className="badge badge-gold">4 Relojes</span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Ventas Totales del Lote</span>
            <div className="kpi-value-row">
              <h2 className="kpi-value mono-num gold-text">
                {formatCOP(fin.totalSalesAll)}
              </h2>
            </div>
            <p className="kpi-micro-text">
              3 cobradas ({formatCOP(fin.totalSalesCompleted)}) + 1 por cobrar (
              {formatCOP(fin.totalSalesPending)})
            </p>
          </div>
          <div className="kpi-footer-strip">
            <div className="kpi-stat">
              <span>Costo Lote: {formatCOP(fin.lotBaseCost)}</span>
            </div>
            <div className="kpi-stat text-emerald-light">
              <span>Ganancia: +{formatCOP(fin.lotGrossProfit)}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Fondo de Reinversión */}
        <div className="glass-panel kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-wrapper cyan-glow">
              <Sparkles size={22} className="text-cyan-primary" />
            </div>
            <span className="badge badge-cyan">Regla 50% Krono</span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Fondo Próximo Lote (Rolex)</span>
            <div className="kpi-value-row">
              <h2 className="kpi-value mono-num" style={{ color: "var(--cyan-primary)" }}>
                {formatCOP(fin.reinvestmentFund50)}
              </h2>
            </div>
            <p className="kpi-micro-text">
              50% obligatorio de ganancias apartado para reinvestir
            </p>
          </div>
          <div className="kpi-footer-strip">
            <div className="kpi-stat">
              <span>Distribuible: {formatCOP(fin.distributableProfit50)}</span>
            </div>
            <div className="kpi-stat">
              <span>Meta Rolex: {formatCOP(600000)}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Deuda Juan a Elian */}
        <div className="glass-panel kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-wrapper rose-glow">
              <Coins size={22} className="text-amber-primary" />
            </div>
            <span className={`badge ${fin.juanRemainingDebt > 0 ? "badge-rose" : "badge-emerald"}`}>
              {fin.juanRemainingDebt > 0 ? "Pendiente" : "Saldada"}
            </span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Deuda Lote: Juan → Elian</span>
            <div className="kpi-value-row">
              <h2 className="kpi-value mono-num" style={{ color: fin.juanRemainingDebt > 0 ? "var(--rose-primary)" : "var(--emerald-light)" }}>
                {fin.juanRemainingDebt > 0 ? formatCOP(fin.juanRemainingDebt) : "$0 COP"}
              </h2>
            </div>
            <p className="kpi-micro-text">
              Juan abonó {formatCOP(fin.juanLotPaid)} de {formatCOP(fin.agreedPerPartner)} ({fin.juanDebtProgress}%)
            </p>
          </div>
          <div className="kpi-footer-strip">
            <div className="progress-bar-bg" style={{ flex: 1, marginRight: 8 }}>
              <div
                className="progress-bar-fill-emerald"
                style={{ width: `${fin.juanDebtProgress}%` }}
              />
            </div>
            {fin.juanRemainingDebt > 0 && (
              <button
                onClick={onOpenDebtModal}
                className="btn-link-action"
              >
                Abonar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="overview-analytics-grid">
        {/* Left: Financial Flow Chart */}
        <div className="glass-panel analytics-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Evolución de Caja & Rendimiento</h3>
              <p className="panel-subtitle">Histórico de entradas, salidas y saldo neto disponible</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot bg-emerald" /> Entradas</span>
              <span className="legend-item"><span className="legend-dot bg-rose" /> Insumos</span>
              <span className="legend-item"><span className="legend-dot bg-gold" /> Saldo Neto</span>
            </div>
          </div>

          <div className="custom-chart-container">
            <div className="chart-bars-wrap">
              {chartDays.map((d, i) => {
                const entryHeight = (d.entry / maxVal) * 160;
                const exitHeight = (d.exit / maxVal) * 160;
                const balanceHeight = (d.balance / maxVal) * 160;

                return (
                  <div key={i} className="chart-col">
                    <div className="chart-col-bars">
                      {d.entry > 0 && (
                        <div
                          className="bar bar-entry"
                          style={{ height: `${Math.max(12, entryHeight)}px` }}
                          title={`Entrada: ${formatCOP(d.entry)}`}
                        >
                          <span className="bar-tooltip">+{formatCOP(d.entry)}</span>
                        </div>
                      )}
                      {d.exit > 0 && (
                        <div
                          className="bar bar-exit"
                          style={{ height: `${Math.max(12, exitHeight)}px` }}
                          title={`Insumo: -${formatCOP(d.exit)}`}
                        >
                          <span className="bar-tooltip">-{formatCOP(d.exit)}</span>
                        </div>
                      )}
                      <div
                        className="bar bar-balance"
                        style={{ height: `${Math.max(16, balanceHeight)}px` }}
                        title={`Saldo: ${formatCOP(d.balance)}`}
                      />
                    </div>
                    <span className="chart-label">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart-summary-footer">
            <div className="summary-stat-box">
              <span className="stat-label">Inversión Insumos (Elian)</span>
              <span className="stat-val mono-num">{formatCOP(fin.elianSupplies)}</span>
              <span className="stat-sub">Tarjetas + Herramientas/Pilas</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-label">Inversión Insumos (Juan)</span>
              <span className="stat-val mono-num">{formatCOP(fin.juanSupplies)}</span>
              <span className="stat-sub">Paños microfibra + Bolsas</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-label">Stock Restante en Bodega</span>
              <span className="stat-val mono-num">4 Unidades</span>
              <span className="stat-sub">Valor est: ~{formatCOP(350000)}</span>
            </div>
          </div>
        </div>

        {/* Right: Partner Settlement & Quick Actions */}
        <div className="glass-panel partner-summary-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Liquidación Equitativa 50/50</h3>
              <p className="panel-subtitle">Desglose transparente si se liquidan utilidades hoy</p>
            </div>
            <span className="badge badge-gold">Sociedad Krono</span>
          </div>

          <div className="partner-settlement-boxes">
            {/* Elian Box */}
            <div className="settle-partner-box elian-box">
              <div className="partner-box-header">
                <div className="partner-avatar-circle bg-emerald">EN</div>
                <div>
                  <h4 className="partner-name">Elian Navarro</h4>
                  <span className="partner-role">Socio Operativo / Finanzas</span>
                </div>
              </div>
              <div className="settle-metrics">
                <div className="settle-row">
                  <span>Aporte Lote Pagado:</span>
                  <span className="mono-num text-emerald-light">{formatCOP(fin.elianLotPaid)} (100%)</span>
                </div>
                <div className="settle-row">
                  <span>Insumos Asumidos:</span>
                  <span className="mono-num">{formatCOP(fin.elianSupplies)}</span>
                </div>
                <div className="settle-row">
                  <span>Utilidad Base 50%:</span>
                  <span className="mono-num text-gold-light">{formatCOP(fin.elianNominalProfit)}</span>
                </div>
                <div className="settle-row highlight-row">
                  <span>Por Cobrar Deuda Juan:</span>
                  <span className="mono-num text-emerald-light">+{formatCOP(fin.juanRemainingDebt)}</span>
                </div>
                <div className="settle-divider" />
                <div className="settle-total-row">
                  <span>Total a Recibir:</span>
                  <span className="mono-num font-bold text-emerald-light">
                    {formatCOP(fin.elianNominalProfit + fin.juanRemainingDebt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Juan Box */}
            <div className="settle-partner-box juan-box">
              <div className="partner-box-header">
                <div className="partner-avatar-circle bg-gold">JS</div>
                <div>
                  <h4 className="partner-name">Juan</h4>
                  <span className="partner-role">Socio Comercial / Ventas</span>
                </div>
              </div>
              <div className="settle-metrics">
                <div className="settle-row">
                  <span>Aporte Lote Pagado:</span>
                  <span className="mono-num">{formatCOP(fin.juanLotPaid)} ({fin.juanDebtProgress}%)</span>
                </div>
                <div className="settle-row">
                  <span>Insumos Asumidos:</span>
                  <span className="mono-num">{formatCOP(fin.juanSupplies)}</span>
                </div>
                <div className="settle-row">
                  <span>Utilidad Base 50%:</span>
                  <span className="mono-num text-gold-light">{formatCOP(fin.juanNominalProfit)}</span>
                </div>
                <div className="settle-row highlight-row">
                  <span>Deducción Deuda Lote:</span>
                  <span className="mono-num text-rose-primary">-{formatCOP(fin.juanRemainingDebt)}</span>
                </div>
                <div className="settle-divider" />
                <div className="settle-total-row">
                  <span>Neto tras deducir deuda:</span>
                  <span className="mono-num font-bold">
                    {fin.juanNominalProfit >= fin.juanRemainingDebt 
                      ? formatCOP(fin.juanNominalProfit - fin.juanRemainingDebt) 
                      : `Debe ${formatCOP(fin.juanRemainingDebt - fin.juanNominalProfit)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="settle-rules-box">
            <h5 className="rules-heading">
              <Shield size={16} className="text-gold-light" />
              Regla de Transparencia Krono
            </h5>
            <p className="rules-text">
              Para garantizar armonía y confianza total entre amigos y socios, la deuda de <strong>{formatCOP(fin.juanRemainingDebt)}</strong> se compensa automáticamente de las utilidades que le corresponden a Juan o mediante abonos en efectivo directos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
