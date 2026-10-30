import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
  Crown,
  Calendar,
  Target,
  Zap,
} from "lucide-react";

export function FinancialCharts({ financials: fin, transactions, formatCOP }) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'sales' | 'distribution' | 'rolex'
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // ================= 1. PROCESAMIENTO VENTAS POR QUINCENA / PERÍODO =================
  const salesPeriods = useMemo(() => {
    // Definimos períodos clave del negocio Krono
    const periods = [
      {
        id: "oct-q1",
        label: "Quincena 1 Oct",
        range: "1 - 15 Oct",
        completed: 85000, // 1ª Venta Subaqua
        pending: 0,
        itemsCount: 1,
        detail: "1ª Venta: Invicta Subaqua ($85.000)",
      },
      {
        id: "oct-q2",
        label: "Quincena 2 Oct",
        range: "16 - 31 Oct",
        completed: 155000, // 2ª Venta Bolt (75k) + 3ª Venta Reserve (80k)
        pending: 85000, // 4ª Venta Amiga pendiente (85k)
        itemsCount: 3,
        detail: "2ª Bolt ($75k) + 3ª Reserve ($80k) + 4ª Amiga ($85k)",
      },
      {
        id: "nov-q1",
        label: "Quincena 1 Nov",
        range: "1 - 15 Nov",
        completed: 0,
        pending: 0,
        projected: 175000, // Meta 2 relojes
        itemsCount: 2,
        detail: "Meta proyectada: 2 unidades Venom & Bolt Zeus",
        isProjection: true,
      },
      {
        id: "nov-q2",
        label: "Quincena 2 Nov",
        range: "16 - 30 Nov",
        completed: 0,
        pending: 0,
        projected: 260000, // Meta Black Friday
        itemsCount: 3,
        detail: "Campaña Black Friday: Adquisición nuevo lote",
        isProjection: true,
      },
    ];

    // Buscar si hay transacciones adicionales registradas dinámicamente
    return periods;
  }, [transactions]);

  // Max value para escalar las barras
  const maxBarValue = 300000;

  // ================= 2. PROCESAMIENTO DONUT DE DISTRIBUCIÓN DEL DINERO =================
  const totalFinancialVolume =
    fin.lotBaseCost +
    fin.totalSupplies +
    fin.reinvestmentFund50 +
    fin.distributableProfit50;

  const donutSlices = useMemo(() => {
    const data = [
      {
        id: "lot-cost",
        label: "Inversión Base Lote (7 Relojes)",
        amount: fin.lotBaseCost,
        color: "#f43f5e", // Rose
        gradient: "linear-gradient(135deg, #fb7185, #e11d48)",
        desc: "Costo de compra inicial de la mercancía recuperado",
      },
      {
        id: "supplies",
        label: "Insumos & Operación (Empaques/Pilas)",
        amount: fin.totalSupplies,
        color: "#f59e0b", // Amber
        gradient: "linear-gradient(135deg, #fbbf24, #d97706)",
        desc: "Tarjetas, paños microfibra, bolsas de lujo y herramientas",
      },
      {
        id: "rolex-fund",
        label: "Fondo Re-inversión Rolex (50%)",
        amount: fin.reinvestmentFund50,
        color: "#06b6d4", // Cyan
        gradient: "linear-gradient(135deg, #22d3ee, #0891b2)",
        desc: "Reserva intocable para escalar a relojes de alta gama",
      },
      {
        id: "profit-50",
        label: "Ganancia Neta Distribuible (50/50)",
        amount: fin.distributableProfit50,
        color: "#e5b869", // Gold
        gradient: "linear-gradient(135deg, #f7d788, #b88628)",
        desc: "Utilidad disponible para reparto equitativo entre Elian y Juan",
      },
    ];

    // Calcular ángulos SVG
    let accumulatedAngle = 0;
    return data.map((slice) => {
      const percentage = totalFinancialVolume > 0 ? (slice.amount / totalFinancialVolume) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = accumulatedAngle;
      accumulatedAngle += angle;

      return {
        ...slice,
        percentage: Number(percentage.toFixed(1)),
        startAngle,
        angle,
      };
    });
  }, [fin, totalFinancialVolume]);

  // Hover default en el donut
  const currentDonutFocus = hoveredDonutSlice
    ? donutSlices.find((s) => s.id === hoveredDonutSlice)
    : donutSlices[3]; // Por defecto mostrar utilidad distribuible

  // ================= 3. CURVA / TERMÓMETRO FONDO ROLEX =================
  const rolexGoal = 600000;
  const currentRolexFund = fin.reinvestmentFund50 || 0;
  const rolexProgressPct = Math.min(100, Math.round((currentRolexFund / rolexGoal) * 100));
  const remainingForRolex = Math.max(0, rolexGoal - currentRolexFund);

  // Estimación de relojes Invicta restantes por vender (promedio de ganancia neta ~ $45.000 por reloj)
  const avgProfitPerWatch = 45000;
  const watchesNeeded = Math.ceil(remainingForRolex / (avgProfitPerWatch * 0.5));

  // Generador de arcos SVG para el gráfico de dona
  const radius = 70;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="financial-charts-container">
      {/* Chart Section Header */}
      <div className="fc-header-strip">
        <div className="fc-title-box">
          <div className="fc-icon-wrap">
            <TrendingUp size={20} className="text-gold-light" />
          </div>
          <div>
            <h3 className="fc-title">Analítica Visual & Evolución de Capital</h3>
            <p className="fc-subtitle">
              Métricas dinámicas de rotación de ventas, distribución de utilidades y fondo de escalamiento
            </p>
          </div>
        </div>

        <div className="fc-tabs-filter">
          <button
            className={`fc-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Vista Completa
          </button>
          <button
            className={`fc-tab-btn ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            Ventas Quincenales
          </button>
          <button
            className={`fc-tab-btn ${activeTab === "distribution" ? "active" : ""}`}
            onClick={() => setActiveTab("distribution")}
          >
            Distribución Dinero
          </button>
          <button
            className={`fc-tab-btn ${activeTab === "rolex" ? "active" : ""}`}
            onClick={() => setActiveTab("rolex")}
          >
            Meta Rolex
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="fc-charts-grid">
        {/* ================= PANEL 1: VENTAS POR QUINCENA ================= */}
        {(activeTab === "all" || activeTab === "sales") && (
          <div className="dash-panel fc-card">
            <div className="panel-head">
              <div className="flex-row items-center gap-2">
                <Calendar size={18} className="text-gold" />
                <h4 className="panel-title">Ventas por Quincena</h4>
              </div>
              <div className="fc-legend-row">
                <span className="fc-legend-item">
                  <span className="fc-dot bg-emerald" /> Cobrado
                </span>
                <span className="fc-legend-item">
                  <span className="fc-dot bg-amber" /> Por Cobrar
                </span>
                <span className="fc-legend-item">
                  <span className="fc-dot bg-cyan opacity-60" /> Proyección
                </span>
              </div>
            </div>

            <div className="fc-bar-chart-body">
              {salesPeriods.map((period, idx) => {
                const totalPeriodVal = period.isProjection
                  ? period.projected
                  : period.completed + period.pending;
                const completedPct = (period.completed / maxBarValue) * 100;
                const pendingPct = (period.pending / maxBarValue) * 100;
                const projectedPct = period.isProjection
                  ? (period.projected / maxBarValue) * 100
                  : 0;
                const isHovered = hoveredBarIndex === idx;

                return (
                  <div
                    key={period.id}
                    className={`fc-bar-col ${isHovered ? "bar-hovered" : ""}`}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="fc-bar-tooltip">
                        <strong>{period.label}</strong>
                        <span className="fc-tt-range">{period.range}</span>
                        <div className="fc-tt-val mono-num">
                          {formatCOP(totalPeriodVal)}
                        </div>
                        <p className="fc-tt-desc">{period.detail}</p>
                      </div>
                    )}

                    {/* Value label above bar */}
                    <div className="fc-bar-val mono-num">
                      {formatCOP(totalPeriodVal)}
                    </div>

                    {/* Bar track and fills */}
                    <div className="fc-bar-track">
                      {period.isProjection ? (
                        <div
                          className="fc-bar-fill-projection"
                          style={{ height: `${projectedPct}%` }}
                        />
                      ) : (
                        <>
                          {period.pending > 0 && (
                            <div
                              className="fc-bar-fill-pending"
                              style={{ height: `${pendingPct}%` }}
                              title={`Pendiente: ${formatCOP(period.pending)}`}
                            />
                          )}
                          {period.completed > 0 && (
                            <div
                              className="fc-bar-fill-completed"
                              style={{ height: `${completedPct}%` }}
                              title={`Cobrado: ${formatCOP(period.completed)}`}
                            />
                          )}
                        </>
                      )}
                    </div>

                    {/* Label below bar */}
                    <div className="fc-bar-footer">
                      <span className="fc-bar-label">{period.label}</span>
                      <span className="fc-bar-sub">{period.range}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="fc-card-subnote">
              <Zap size={14} className="text-gold" />
              <span>
                Quincena actual (16-31 Oct) superó la primera en <strong>+182%</strong> de rotación total.
              </span>
            </div>
          </div>
        )}

        {/* ================= PANEL 2: DONUT DISTRIBUCIÓN DEL DINERO ================= */}
        {(activeTab === "all" || activeTab === "distribution") && (
          <div className="dash-panel fc-card">
            <div className="panel-head">
              <div className="flex-row items-center gap-2">
                <PieIcon size={18} className="text-cyan" />
                <h4 className="panel-title">Distribución del Flujo de Capital</h4>
              </div>
              <span className="badge badge-gold">Volumen: {formatCOP(totalFinancialVolume)}</span>
            </div>

            <div className="fc-donut-wrapper">
              {/* SVG Donut Chart */}
              <div className="fc-donut-svg-box">
                <svg viewBox="0 0 200 200" className="fc-donut-svg">
                  {/* Background Track */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={strokeWidth}
                  />

                  {/* Render segments */}
                  {donutSlices.map((slice) => {
                    const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -((slice.startAngle / 360) * circumference);
                    const isFocus = currentDonutFocus.id === slice.id;

                    return (
                      <circle
                        key={slice.id}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth={isFocus ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`donut-segment ${isFocus ? "donut-active-segment" : ""}`}
                        onMouseEnter={() => setHoveredDonutSlice(slice.id)}
                        style={{
                          transform: "rotate(-90deg)",
                          transformOrigin: "center",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          opacity: isFocus ? 1 : 0.82,
                        }}
                      />
                    );
                  })}
                </svg>

                {/* Donut Center Display */}
                <div className="fc-donut-center">
                  <span className="fc-center-pct mono-num" style={{ color: currentDonutFocus.color }}>
                    {currentDonutFocus.percentage}%
                  </span>
                  <span className="fc-center-amt mono-num">
                    {formatCOP(currentDonutFocus.amount)}
                  </span>
                  <span className="fc-center-lbl">
                    {currentDonutFocus.id === "profit-50"
                      ? "Utilidad Distribuible"
                      : currentDonutFocus.id === "rolex-fund"
                      ? "Fondo Rolex"
                      : currentDonutFocus.id === "supplies"
                      ? "Insumos"
                      : "Costo Base"}
                  </span>
                </div>
              </div>

              {/* Donut Legends List */}
              <div className="fc-donut-legends">
                {donutSlices.map((slice) => {
                  const isFocus = currentDonutFocus.id === slice.id;
                  return (
                    <div
                      key={slice.id}
                      className={`fc-legend-row-card ${isFocus ? "legend-active" : ""}`}
                      onMouseEnter={() => setHoveredDonutSlice(slice.id)}
                      onMouseLeave={() => setHoveredDonutSlice(null)}
                    >
                      <div
                        className="fc-lrc-color"
                        style={{ background: slice.color, boxShadow: `0 0 10px ${slice.color}50` }}
                      />
                      <div className="fc-lrc-info">
                        <div className="fc-lrc-top">
                          <span className="fc-lrc-title">{slice.label}</span>
                          <strong className="fc-lrc-val mono-num" style={{ color: slice.color }}>
                            {formatCOP(slice.amount)}
                          </strong>
                        </div>
                        <div className="fc-lrc-bar">
                          <div
                            className="fc-lrc-bar-fill"
                            style={{ width: `${slice.percentage}%`, background: slice.color }}
                          />
                        </div>
                        <span className="fc-lrc-sub">{slice.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= PANEL 3: TERMÓMETRO / FONDO ROLEX ================= */}
        {(activeTab === "all" || activeTab === "rolex") && (
          <div className="dash-panel fc-card fc-rolex-card">
            <div className="panel-head">
              <div className="flex-row items-center gap-2">
                <Crown size={20} className="gold-text" />
                <h4 className="panel-title gold-text">Fondo Rolex Alta Gama (Meta: $600.000 COP)</h4>
              </div>
              <span className="badge badge-gold">
                <Sparkles size={12} /> {rolexProgressPct}% Financiado
              </span>
            </div>

            <div className="fc-rolex-body">
              {/* Progress Bar & Markers */}
              <div className="fc-thermometer-box">
                <div className="fc-thermo-track">
                  <div
                    className="fc-thermo-fill"
                    style={{ width: `${rolexProgressPct}%` }}
                  >
                    <div className="fc-thermo-glow" />
                  </div>

                  {/* Milestone Pins */}
                  <div className="fc-pin" style={{ left: "25%" }}>
                    <div className="fc-pin-dot" />
                    <span className="fc-pin-lbl mono-num">$150k</span>
                  </div>
                  <div className="fc-pin" style={{ left: "50%" }}>
                    <div className="fc-pin-dot" />
                    <span className="fc-pin-lbl mono-num">$300k</span>
                  </div>
                  <div className="fc-pin" style={{ left: "75%" }}>
                    <div className="fc-pin-dot" />
                    <span className="fc-pin-lbl mono-num">$450k</span>
                  </div>
                  <div className="fc-pin" style={{ left: "100%" }}>
                    <div className="fc-pin-dot pin-gold" />
                    <span className="fc-pin-lbl mono-num gold-text">$600k</span>
                  </div>
                </div>

                <div className="fc-thermo-stats-strip">
                  <div className="fcts-item">
                    <span>Fondo Acumulado:</span>
                    <strong className="text-cyan mono-num" style={{ fontSize: "1.2rem" }}>
                      {formatCOP(currentRolexFund)}
                    </strong>
                  </div>
                  <div className="fcts-div" />
                  <div className="fcts-item">
                    <span>Faltante para Compra:</span>
                    <strong className="text-gold mono-num" style={{ fontSize: "1.2rem" }}>
                      {formatCOP(remainingForRolex)}
                    </strong>
                  </div>
                  <div className="fcts-div" />
                  <div className="fcts-item">
                    <span>Rotación Estimada:</span>
                    <strong className="text-emerald mono-num" style={{ fontSize: "1.2rem" }}>
                      {watchesNeeded > 0 ? `~${watchesNeeded} Relojes Invicta` : "¡Meta Alcanzada!"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Scaling Insights banner */}
              <div className="fc-rolex-insight-card">
                <div className="ric-icon">
                  <Target size={22} className="text-cyan" />
                </div>
                <div className="ric-text">
                  <h5 className="ric-title">Plan de Escalamiento Auto-sostenible:</h5>
                  <p className="ric-desc">
                    Cada venta de Invicta aporta el <strong>50% de ganancia bruta</strong> al Fondo Rolex.
                    Con los <strong>4 relojes restantes del lote actual</strong>, el fondo superará los{" "}
                    <strong className="text-gold">$120.000 COP</strong>, dejando a Krono listo para adquirir la primera
                    unidad Rolex Submariner o Daytona sin requerir inyección de capital de los socios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinancialCharts;
