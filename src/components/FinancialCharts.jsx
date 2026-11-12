import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
  Crown,
  Calendar,
  Target,
  Zap,
  PackageCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
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

  // ================= 2. PROCESAMIENTO DONUT DE DISTRIBUCIÓN DEL DINERO & GANANCIAS =================
  // Costo combinado de los lotes: 8 Invictas ($260k) + 6 Rolex ($200k) = $460.000 COP
  const totalCombinedLotCost = fin.lotBaseCost || 460000;
  const netCleanProfit = fin.netCleanProfitRemaining || 765000;
  const partnerProfitShare = fin.netCleanProfit50Each || 382500;
  const totalSuppliesAmt = fin.totalSupplies || 210500;

  // Volumen financiero total proyectado del modelo de negocio
  const totalFinancialVolume = totalCombinedLotCost + totalSuppliesAmt + netCleanProfit; // $1.435.500 COP

  const donutSlices = useMemo(() => {
    const data = [
      {
        id: "profit-partners",
        label: "Utilidad Líquida Socios (50%)",
        amount: partnerProfitShare,
        color: "#10b981", // Emerald
        gradient: "linear-gradient(135deg, #34d399, #059669)",
        desc: "Ganancia neta en efectivo para reparto equitativo entre Elian y Juan",
      },
      {
        id: "profit-reinvest",
        label: "Fondo Re-inversión Próximo Lote (50%)",
        amount: partnerProfitShare,
        color: "#06b6d4", // Cyan
        gradient: "linear-gradient(135deg, #22d3ee, #0891b2)",
        desc: "Capital protegido para autofinanciar la siguiente compra mayorista",
      },
      {
        id: "lot-cost",
        label: "Inversión en Mercancía (8 Invictas & 6 Rolex)",
        amount: totalCombinedLotCost,
        color: "#6366f1", // Electric Indigo (¡NADA DE ROJO!)
        gradient: "linear-gradient(135deg, #818cf8, #4f46e5)",
        desc: "Costo de compra de los 14 relojes ($260k Invictas + $200k Rolex). $420k ya retornados a caja (91.3%), restan solo $40k para $0 deuda",
      },
      {
        id: "supplies",
        label: "Insumos & Operación (Empaques/Pilas/Tarjetas)",
        amount: totalSuppliesAmt,
        color: "#f59e0b", // Amber
        gradient: "linear-gradient(135deg, #fbbf24, #d97706)",
        desc: "Tarjetas de presentación, paños de microfibra, bolsas de lujo y kit de herramientas",
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
  }, [totalCombinedLotCost, netCleanProfit, partnerProfitShare, totalSuppliesAmt, totalFinancialVolume]);

  // Hover default en el donut: Por defecto destacar la GANANCIA NETA TOTAL ($765.000)
  const defaultDonutFocus = {
    id: "total-profit",
    percentage: 53.3,
    amount: netCleanProfit,
    color: "#10b981",
    label: "Ganancia Neta Limpia",
  };

  const currentDonutFocus = hoveredDonutSlice
    ? donutSlices.find((s) => s.id === hoveredDonutSlice) || defaultDonutFocus
    : defaultDonutFocus;

  // ================= 3. CONTROL DE LOTES ACTIVOS (26 RELOJES EN 3 LOTES) =================
  const activeLotsMetrics = useMemo(() => {
    return {
      invictaTotal: 8,
      invictaSold: 3,
      invictaNegotiation: 1,
      invictaStock: 4,
      invictaGrossPending: 85000 + 4 * 80000, // $405.000 COP
      invictaDebtRecovery: 20000,

      rolexTotal: 6,
      rolexSold: 3,
      rolexStock: 3,
      rolexGrossPending: 3 * 100000, // $300.000 COP
      rolexDebtRecovery: 0, // 100% saldado

      lote3Total: 12,
      lote3Stock: 12,
      lote3GrossPending: 1095000, // 6 Rolex $600k + 3 Pro Diver $240k + 3 Ruleta $255k
      lote3Cost: 407000,

      totalWatches: 26,
      totalRemaining: 20,
      totalGrossPending: 1800000,
      totalDebtRecovery: 20000,
      totalNetProfit: 1373000,
      partnerBase50: 686500,

      juanDebtToElian: 30000,
      elianRolexAdvance: 0,
      elianRolexAdvanceRecovered: 60000,
      elianNetPayout: 716500, // 686.500 + 30.000
      juanNetPayout: 656500,  // 686.500 - 30.000
    };
  }, []);

  // Generador de arcos SVG para el gráfico de dona
  const radius = 70;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="financial-charts-container">
      {/* Chart Section Header */}
      <div className="fc-header-strip">
        <div className="fc-title-box">
          <div className="fc-icon-wrap" style={{ background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
            <TrendingUp size={20} className="text-indigo" />
          </div>
          <div>
            <h3 className="fc-title">Analítica Visual & Rendimiento de Capital</h3>
            <p className="fc-subtitle">
              Métricas dinámicas de rotación de ventas, distribución de utilidades y control de lotes activos
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
            Rentabilidad por Lote
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
            Lotes Activos (14 Relojes)
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="fc-charts-grid">
        {/* ================= PANEL 1: RENDIMIENTO & MARGEN POR LOTE (8 INVICTA vs 6 ROLEX) ================= */}
        {(activeTab === "all" || activeTab === "sales") && (
          <div className="dash-panel fc-card">
            <div className="panel-head">
              <div className="flex-row items-center gap-2">
                <TrendingUp size={18} className="text-emerald" />
                <h4 className="panel-title">Rendimiento & Margen por Lote</h4>
              </div>
              <div className="fc-legend-row">
                <span className="badge badge-emerald text-xs">Invicta +148% ROI</span>
                <span className="badge badge-indigo text-xs">Rolex +200% ROI</span>
              </div>
            </div>

            <div className="fc-perf-dual-grid">
              {/* Card Invicta */}
              <div className="fc-perf-card perf-invicta">
                <div className="fc-perf-top">
                  <strong className="text-white">Línea Invicta (8 Unidades)</strong>
                  <span className="badge badge-emerald">4 / 8 Colocados</span>
                </div>

                <div className="fc-perf-bar-wrap">
                  <div className="flex-between text-xs text-dim">
                    <span>Margen Bruto</span>
                    <strong className="text-emerald mono-num">59.7% (+148% ROI)</strong>
                  </div>
                  <div className="fc-perf-bar-track">
                    <div className="fc-perf-bar-fill-invicta" style={{ width: "60%" }} />
                  </div>
                </div>

                <div className="fc-perf-metrics-list">
                  <div className="fc-perf-metric-row">
                    <span>Costo de Compra Lote:</span>
                    <strong className="mono-num text-slate-300">$260.000 COP</strong>
                  </div>
                  <div className="fc-perf-metric-row">
                    <span>Costo Unitario Promedio:</span>
                    <strong className="mono-num text-slate-300">$32.500 COP / reloj</strong>
                  </div>
                  <div className="fc-perf-metric-row">
                    <span>PVP Venta Promedio:</span>
                    <strong className="mono-num text-cyan">$80.625 COP</strong>
                  </div>
                  <div className="fc-perf-metric-row perf-highlight">
                    <span>Ganancia Neta / Unidad:</span>
                    <strong className="mono-num text-emerald">+ $48.125 COP</strong>
                  </div>
                  <div className="fc-perf-metric-row" style={{ fontSize: "0.75rem" }}>
                    <span>Recaudo Restante (5 relojes):</span>
                    <strong className="mono-num text-white">$405.000 COP</strong>
                  </div>
                </div>
              </div>

              {/* Card Rolex */}
              <div className="fc-perf-card perf-rolex">
                <div className="fc-perf-top">
                  <strong className="text-white">Línea Rolex (6 Unidades)</strong>
                  <span className="badge badge-indigo">2 / 6 Movidos</span>
                </div>

                <div className="fc-perf-bar-wrap">
                  <div className="flex-between text-xs text-dim">
                    <span>Margen Bruto</span>
                    <strong className="text-indigo mono-num">66.7% (+200% ROI)</strong>
                  </div>
                  <div className="fc-perf-bar-track">
                    <div className="fc-perf-bar-fill-rolex" style={{ width: "67%" }} />
                  </div>
                </div>

                <div className="fc-perf-metrics-list">
                  <div className="fc-perf-metric-row">
                    <span>Costo de Compra Lote:</span>
                    <strong className="mono-num text-slate-300">$200.000 COP</strong>
                  </div>
                  <div className="fc-perf-metric-row">
                    <span>Costo Unitario Promedio:</span>
                    <strong className="mono-num text-slate-300">$33.333 COP / reloj</strong>
                  </div>
                  <div className="fc-perf-metric-row">
                    <span>PVP Venta Sugerido:</span>
                    <strong className="mono-num text-indigo">$100.000 COP</strong>
                  </div>
                  <div className="fc-perf-metric-row perf-highlight">
                    <span>Ganancia Neta / Unidad:</span>
                    <strong className="mono-num text-indigo">+ $66.667 COP</strong>
                  </div>
                  <div className="fc-perf-metric-row" style={{ fontSize: "0.75rem" }}>
                    <span>Recaudo Restante (4 Rolex):</span>
                    <strong className="mono-num text-white">$400.000 COP</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparativa Ganancia Unitaria */}
            <div className="fc-unit-gain-box">
              <div className="text-center">
                <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Ganancia Neta Invicta:</span>
                <div className="mono-num text-emerald font-bold" style={{ fontSize: "1rem" }}>
                  +$48.125 COP / ud
                </div>
              </div>
              <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.08)" }} />
              <div className="text-center">
                <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Ganancia Neta Rolex:</span>
                <div className="mono-num text-indigo font-bold" style={{ fontSize: "1rem" }}>
                  +$66.667 COP / ud
                </div>
              </div>
              <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.08)" }} />
              <div className="text-center">
                <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Ventaja Rolex:</span>
                <div className="mono-num text-emerald font-bold" style={{ fontSize: "1rem" }}>
                  +38.5% más ganancia
                </div>
              </div>
            </div>

            <div className="fc-card-subnote">
              <Sparkles size={14} className="text-emerald" />
              <span>
                Cada Rolex aporta <strong>+$18.542 COP más</strong> de ganancia que un Invicta con casi el mismo costo ($33.3k vs $32.5k). Es la línea más rentable para reinversión.
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
                <h4 className="panel-title">Distribución del Flujo & Ganancias Krono</h4>
              </div>
              <span className="badge badge-emerald">
                <Sparkles size={12} /> 53.3% Ganancia Neta Limpia
              </span>
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
                    {currentDonutFocus.id === "profit-partners"
                      ? "Utilidad Socios (50%)"
                      : currentDonutFocus.id === "profit-reinvest"
                      ? "Fondo Re-inversión (50%)"
                      : currentDonutFocus.id === "lot-cost"
                      ? "Inversión Lotes ($460k)"
                      : currentDonutFocus.id === "supplies"
                      ? "Insumos Operativos"
                      : "Ganancia Neta Limpia"}
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

            {/* Resumen Destacado de Ganancias & Recuperación */}
            <div
              style={{
                marginTop: 14,
                padding: "12px 18px",
                borderRadius: 12,
                background: "rgba(16, 185, 129, 0.05)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                fontSize: "0.82rem",
              }}
            >
              <div>
                <span style={{ color: "#94a3b8" }}>💰 Ganancia Neta Limpia Total: </span>
                <strong className="mono-num text-emerald" style={{ fontSize: "1rem" }}>
                  +{formatCOP(netCleanProfit)}
                </strong>
                <span style={{ color: "#6ee7b7", fontSize: "0.75rem", marginLeft: 8 }}>
                  (Reparto 50/50: {formatCOP(partnerProfitShare)} Elian / {formatCOP(partnerProfitShare)} Juan)
                </span>
              </div>
              <div>
                <span style={{ color: "#94a3b8" }}>📦 Inversión Combinada (14 Relojes): </span>
                <strong className="mono-num text-indigo" style={{ fontSize: "1rem" }}>
                  {formatCOP(totalCombinedLotCost)}
                </strong>
                <span style={{ color: "#a5b4fc", fontSize: "0.75rem", marginLeft: 8 }}>
                  ($420k ya recuperados • Faltan $40k para $0 deuda)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= PANEL 3: CONTROL DE LOTES ACTIVOS (8 INVICTA & 6 ROLEX) ================= */}
        {(activeTab === "all" || activeTab === "rolex") && (
          <div className="dash-panel fc-card fc-rolex-card">
            <div className="panel-head">
              <div className="flex-row items-center gap-2">
                <Layers size={20} className="text-indigo" />
                <h4 className="panel-title">Control de Lotes Activos: 8 Invictas & 6 Rolex (14 Unidades)</h4>
              </div>
              <span className="badge badge-emerald">
                <Sparkles size={12} /> Ambos Lotes Pedidos & En Circulación
              </span>
            </div>

            <div className="fc-rolex-body">
              {/* Dual Lot Status Grid */}
              <div className="fc-lots-dual-grid">
                {/* Card 1: Lote Invicta */}
                <div className="fc-lot-card fc-lot-card-invicta">
                  <div className="fc-lot-title-row">
                    <div className="flex-row items-center gap-2">
                      <span className="status-dot-pulse bg-emerald" />
                      <strong className="text-white text-base">Lote Invicta (8 Unidades)</strong>
                    </div>
                    <span className="badge badge-emerald">
                      4 / 8 Colocados (50%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="fc-lot-progress-bar">
                    <div className="fc-lot-progress-fill-invicta" style={{ width: "50%" }} />
                  </div>

                  <div className="fc-lot-stats-list">
                    <div className="fc-lot-stats-row">
                      <span>3 Vendidas & Cobradas:</span>
                      <strong className="mono-num text-emerald">+ $240.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row">
                      <span>1 En Negociación activa:</span>
                      <strong className="mono-num text-amber">$85.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row">
                      <span>4 Disponibles en Stock ($80k c/u):</span>
                      <strong className="mono-num text-cyan">$320.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row highlight-row">
                      <span>Recaudo bruto restante (5 relojes):</span>
                      <strong className="mono-num text-white">$405.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row" style={{ fontSize: "0.75rem" }}>
                      <span>Faltante p/ saldar inversión:</span>
                      <strong className="mono-num text-rose">-$20.000 COP ($0 deuda)</strong>
                    </div>
                  </div>
                </div>

                {/* Card 2: Lote Rolex */}
                <div className="fc-lot-card fc-lot-card-rolex">
                  <div className="fc-lot-title-row">
                    <div className="flex-row items-center gap-2">
                      <span className="status-dot-pulse bg-indigo" />
                      <strong className="text-white text-base">Lote Rolex (6 Unidades)</strong>
                    </div>
                    <span className="badge badge-emerald">
                      3 / 6 Vendidos (50%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="fc-lot-progress-bar">
                    <div className="fc-lot-progress-fill-rolex" style={{ width: "50%", background: "#10b981" }} />
                  </div>

                  <div className="fc-lot-stats-list">
                    <div className="fc-lot-stats-row">
                      <span>3 Vendidos & Cobrados:</span>
                      <strong className="mono-num text-emerald">+ $310.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row">
                      <span>3 Disponibles en Stock:</span>
                      <strong className="mono-num text-indigo">$300.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row">
                      <span>Precio Sugerido Pro:</span>
                      <strong className="mono-num text-slate-300">$100.000 COP c/u</strong>
                    </div>
                    <div className="fc-lot-stats-row highlight-row">
                      <span>Recaudo bruto restante (3 Rolex):</span>
                      <strong className="mono-num text-white">$300.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row" style={{ fontSize: "0.75rem" }}>
                      <span>Faltante p/ saldar inversión:</span>
                      <strong className="mono-num text-emerald">$0 (100% Saldado + Ganancia)</strong>
                    </div>
                  </div>
                </div>

                {/* Card 3: Lote #3 Expansión */}
                <div className="fc-lot-card" style={{ border: "1px solid rgba(245, 158, 11, 0.35)", background: "rgba(245, 158, 11, 0.04)" }}>
                  <div className="fc-lot-title-row">
                    <div className="flex-row items-center gap-2">
                      <span className="status-dot-pulse bg-amber" />
                      <strong className="text-white text-base">Lote #3 Novedades (12 Unidades)</strong>
                    </div>
                    <span className="badge badge-amber">
                      ¡Recién Llegado!
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="fc-lot-progress-bar">
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #f59e0b, #e5b869)", borderRadius: 6 }} />
                  </div>

                  <div className="fc-lot-stats-list">
                    <div className="fc-lot-stats-row">
                      <span>6 Rolex Submariner ($100k):</span>
                      <strong className="mono-num text-indigo">$600.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row">
                      <span>3 Invictas Pro Diver ($80k):</span>
                      <strong className="mono-num text-emerald">$240.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row">
                      <span>3 Invictas Ruleta ($85k):</span>
                      <strong className="mono-num text-amber">$255.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row highlight-row">
                      <span>Valor comercial Lote 3:</span>
                      <strong className="mono-num text-white">$1.095.000 COP</strong>
                    </div>
                    <div className="fc-lot-stats-row" style={{ fontSize: "0.75rem" }}>
                      <span>Ganancia neta proyectada:</span>
                      <strong className="mono-num text-emerald">+$688.000 COP</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strip Consolidado de Liquidación Total */}
              <div className="fc-thermo-stats-strip">
                <div className="fcts-item">
                  <span>Ingreso Bruto por Entrar (20 Relojes):</span>
                  <strong className="text-white mono-num" style={{ fontSize: "1.25rem" }}>
                    $1.800.000
                  </strong>
                  <small style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                    5 Invictas L1 + 3 Rolex L2 + 12 Lote 3
                  </small>
                </div>
                <div className="fcts-div" />
                <div className="fcts-item">
                  <span>Saldar Inversión L1 ($0 Deuda):</span>
                  <strong className="text-rose mono-num" style={{ fontSize: "1.25rem" }}>
                    -$20.000
                  </strong>
                  <small style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                    -$20k Invictas | Rolex 100% saldado
                  </small>
                </div>
                <div className="fcts-div" />
                <div className="fcts-item">
                  <span>Ganancia Neta Limpia Total:</span>
                  <strong className="text-emerald mono-num" style={{ fontSize: "1.25rem" }}>
                    $1.373.000
                  </strong>
                  <small style={{ fontSize: "0.72rem", color: "var(--emerald-light)" }}>
                    Reparto 50/50: $686.500 c/u
                  </small>
                </div>
              </div>

              {/* Liquidación Individual de Socios Fundadores */}
              <div className="fc-rolex-insight-card" style={{ background: "rgba(99, 102, 241, 0.05)", borderColor: "rgba(99, 102, 241, 0.2)" }}>
                <div className="ric-icon">
                  <ShieldCheck size={26} className="text-indigo" />
                </div>
                <div className="ric-text" style={{ width: "100%" }}>
                  <div className="flex-between items-center" style={{ marginBottom: "8px" }}>
                    <h5 className="ric-title text-indigo" style={{ margin: 0 }}>
                      Liquidación de Cierre por Socio Fundador (50/50):
                    </h5>
                    <span className="badge badge-indigo">Cuentas Claras</span>
                  </div>

                  <div className="fc-partner-payout-grid">
                    {/* Elian */}
                    <div className="fc-partner-payout-box elian-payout">
                      <div className="flex-between items-center mb-1">
                        <strong className="text-emerald">Elian Navarro</strong>
                        <span className="badge badge-emerald" style={{ fontSize: "0.7rem", padding: "2px 6px" }}>Cofundador</span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div>+ $686.500 (Ganancia base 50%)</div>
                        <div>+ $30.000 (Cobro deuda pendiente de Juan)</div>
                        <div className="text-emerald font-medium">✓ $60.000 préstamo Rolex ya recuperado</div>
                      </div>
                      <div className="flex-between items-center pt-2 mt-1 border-t border-white/10">
                        <span style={{ fontSize: "0.8rem", color: "#fff" }}>Liquidación a recibir:</span>
                        <strong className="mono-num text-white text-base">$716.500 COP</strong>
                      </div>
                    </div>

                    {/* Juan */}
                    <div className="fc-partner-payout-box juan-payout">
                      <div className="flex-between items-center mb-1">
                        <strong className="text-indigo">Juan</strong>
                        <span className="badge badge-indigo" style={{ fontSize: "0.7rem", padding: "2px 6px" }}>Cofundador</span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div>+ $686.500 (Ganancia base 50%)</div>
                        <div>- $30.000 (Descuento de su deuda con Elian)</div>
                        <div style={{ visibility: "hidden" }}>-</div>
                      </div>
                      <div className="flex-between items-center pt-2 mt-1 border-t border-white/10">
                        <span style={{ fontSize: "0.8rem", color: "#fff" }}>Liquidación a recibir:</span>
                        <strong className="mono-num text-white text-base">$656.500 COP</strong>
                      </div>
                    </div>
                  </div>
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
