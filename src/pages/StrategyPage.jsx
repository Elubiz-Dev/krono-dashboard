import React, { useState } from "react";
import {
  Sparkles,
  Calculator,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldAlert,
  Edit2,
  Check,
  X,
  PlusCircle,
  Trash2,
  Crown,
  Zap,
  ArrowRight,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { KronoVision50 } from "../components/KronoVision50";

// Precision Slider Component with Live Floating Price Bubble & Glowing Fill
function PrecisionSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1000,
  format = (v) => v,
  color = "gold",
  ticks = [],
  suffix = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  // Compute thumb position percentage (0% to 100%)
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleStep = (delta) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };

  const handleInputSubmit = () => {
    let num = Number(inputValue.replace(/[^0-9]/g, ""));
    if (isNaN(num) || num === 0) num = value;
    num = Math.min(max, Math.max(min, num));
    onChange(num);
    setIsEditing(false);
  };

  const colorHex = color === "emerald" ? "#10b981" : color === "cyan" ? "#06b6d4" : "#e5b869";

  return (
    <div className={`precision-slider-group color-${color}`}>
      <div className="control-header">
        <label>{label}</label>
        <div className="psg-header-controls">
          <button
            type="button"
            className="psg-step-btn"
            onClick={() => handleStep(-step)}
            title="Reducir"
          >
            -
          </button>

          {isEditing ? (
            <input
              type="text"
              className="psg-manual-input mono-num"
              value={inputValue}
              autoFocus
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInputSubmit();
                if (e.key === "Escape") setIsEditing(false);
              }}
            />
          ) : (
            <span
              className="mono-num font-bold psg-clickable-val"
              style={{ color: colorHex }}
              onClick={() => {
                setInputValue(String(value));
                setIsEditing(true);
              }}
              title="Haz clic para escribir el precio exacto"
            >
              {format(value)}{suffix}
              <Edit2 size={11} className="psg-edit-icon" />
            </span>
          )}

          <button
            type="button"
            className="psg-step-btn"
            onClick={() => handleStep(step)}
            title="Aumentar"
          >
            +
          </button>
        </div>
      </div>

      {/* Slider Track with Live Floating Price Tooltip */}
      <div className="psg-slider-track-wrap">
        {/* Floating Tooltip Bubble directly above the Thumb */}
        <div
          className="psg-floating-bubble"
          style={{
            left: `calc(${percent}% + (${10 - percent * 0.2}px))`,
            borderColor: colorHex,
            boxShadow: `0 4px 14px ${colorHex}50`,
          }}
        >
          <span className="psg-bubble-text mono-num">{format(value)}{suffix}</span>
          <div className="psg-bubble-arrow" style={{ borderTopColor: colorHex }} />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="sim-slider-v2"
          style={{
            background: `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${percent}%, rgba(255, 255, 255, 0.12) ${percent}%, rgba(255, 255, 255, 0.12) 100%)`,
          }}
        />
      </div>

      {ticks && ticks.length > 0 && (
        <div className="slider-ticks">
          {ticks.map((t, idx) => (
            <span
              key={idx}
              className="tick-label-clickable"
              onClick={() => onChange(t.val)}
              title={`Fijar a ${t.label}`}
            >
              {t.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function StrategyPage({ financials, formatCOP, isEditMode, lotConfig, onUpdateLotConfig }) {
  const fin = financials;

  // Simulator State
  const [simUnits, setSimUnits] = useState(lotConfig?.targetUnits || 10);
  const [simBuyPrice, setSimBuyPrice] = useState(lotConfig?.targetCostPerUnit || 35000);
  const [simSellPrice, setSimSellPrice] = useState(lotConfig?.targetSellPerUnit || 100000);
  const [simSupplies, setSimSupplies] = useState(lotConfig?.suppliesBudget || 40000);

  // Calculations
  const simTotalCost = simUnits * simBuyPrice + Number(simSupplies);
  const simTotalRevenue = simUnits * simSellPrice;
  const simGrossProfit = simTotalRevenue - simTotalCost;
  const simROI = simTotalCost > 0 ? Math.round((simGrossProfit / simTotalCost) * 100) : 0;

  const simReinvestment = Math.max(0, Math.round(simGrossProfit * 0.5));
  const simDistributable = Math.max(0, simGrossProfit - simReinvestment);
  const simPerPartner = Math.round(simDistributable * 0.5);

  const rolexGoal = lotConfig?.targetCostTotal || 600000;
  const currentFund = fin.reinvestmentFund50;
  const fundProgress = Math.min(100, Math.round((currentFund / rolexGoal) * 100));

  // Quick Simulation Presets
  const PRESETS = [
    {
      name: "👑 4 Rolex Actuales ($100k PVP)",
      units: 4,
      buyPrice: 35000,
      sellPrice: 100000,
      supplies: 20000,
    },
    {
      name: "⚡ 4 Invicta Actuales ($80k PVP)",
      units: 4,
      buyPrice: 30000,
      sellPrice: 80000,
      supplies: 20000,
    },
    {
      name: "🚀 Lote Escalamiento (10 unids)",
      units: 10,
      buyPrice: 40000,
      sellPrice: 100000,
      supplies: 40000,
    },
    {
      name: "🌟 Lote Alto Volumen (20 unids)",
      units: 20,
      buyPrice: 35000,
      sellPrice: 95000,
      supplies: 60000,
    },
  ];

  const applyPreset = (p) => {
    setSimUnits(p.units);
    setSimBuyPrice(p.buyPrice);
    setSimSellPrice(p.sellPrice);
    setSimSupplies(p.supplies);
  };

  // Custom milestones
  const [milestones, setMilestones] = useState([
    {
      id: "m-1",
      dateBadge: "30 de Octubre (Hoy)",
      badgeColor: "amber",
      tag: "Quincena Actual",
      title: "Cobro Invicta en Negociación ($85.000)",
      desc: "Cobro del reloj en negociación pactada. Cierre de balance e ingreso a caja de Krono.",
      active: true,
    },
    {
      id: "m-2",
      dateBadge: "15 de Noviembre",
      badgeColor: "cyan",
      tag: "Quincena #1 Nov",
      title: "Venta Lote Invicta & Rolex en Rotación",
      desc: "Rotación activa de los 4 Invictas restantes ($80k c/u) y los 4 Rolex restantes ($100k c/u).",
      active: false,
    },
    {
      id: "m-3",
      dateBadge: "30 de Noviembre",
      badgeColor: "cyan",
      tag: "Black Friday",
      title: "Liquidación a $0 Deuda & Adquisición Mayorista",
      desc: "Recuperar los $40.000 faltantes de inversión y unificar el fondo para el pedido navideño.",
      active: false,
    },
    {
      id: "m-4",
      dateBadge: "15 al 24 de Diciembre",
      badgeColor: "emerald",
      tag: "Temporada Alta",
      title: "Pico de Primas & Regalos de Navidad",
      desc: "Pico máximo de ventas en Colombia. Meta de venta: 15 a 20 relojes con empaque de lujo y garantía Krono.",
      active: false,
    },
  ]);

  const [newMilestoneText, setNewMilestoneText] = useState("");

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestones([
      ...milestones,
      {
        id: `m-${Date.now()}`,
        dateBadge: "Próxima Fecha",
        badgeColor: "gold",
        tag: "Estrategia",
        title: newMilestoneText.trim(),
        desc: "Hito agregado por el equipo de Krono.",
        active: false,
      },
    ]);
    setNewMilestoneText("");
  };

  const handleDeleteMilestone = (id) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  return (
    <div className="page-container strategy-page">
      {/* Top Banner - Fondo Re-inversión */}
      <div className="glass-panel glass-panel-gold fund-target-panel">
        <div className="fund-top">
          <div className="fund-info">
            <div className="flex-row items-center gap-2 mb-2">
              <span className="badge badge-gold">
                <Target size={13} /> Meta de Escalamiento
              </span>
              <span className="badge badge-emerald">Regla 50%</span>
            </div>
            <h2 className="fund-title gold-text">
              Fondo de Re-inversión (50% de Utilidades Netas)
            </h2>
            <p className="fund-desc">
              Pilar estratégico de Krono: El 50% de cada ganancia neta se reserva intocable
              para financiar el siguiente lote sin necesidad de inyectar más capital de bolsillo.
            </p>
          </div>

          <div className="fund-stats-box">
            <span className="fs-label">Acumulado a la Fecha:</span>
            <span className="fs-val mono-num text-emerald-light">
              {formatCOP(currentFund)}
            </span>
            <span className="fs-target">Meta Lote Superior: {formatCOP(rolexGoal)}</span>
          </div>
        </div>

        <div className="fund-progress-wrap">
          <div className="fund-progress-bar">
            <div
              className="fund-progress-fill"
              style={{ width: `${Math.max(6, fundProgress)}%` }}
            />
          </div>
          <div className="fund-progress-labels">
            <span>$0 COP</span>
            <span className="mono-num text-gold-light font-bold">
              {fundProgress}% Meta alcanzada
            </span>
            <span>{formatCOP(rolexGoal)}</span>
          </div>
        </div>
      </div>

      {/* Horizonte KRONO 50: Punto de Cosecha & Sueldo Mensual Limpio */}
      <KronoVision50 formatCOP={formatCOP} currentWatches={14} />

      {/* Simulator Section with Precision Sliders and Real-time Floating Price Indicator */}
      <div className="glass-panel simulator-panel">
        <div className="panel-header">
          <div>
            <div className="flex-row items-center gap-2">
              <Calculator size={22} className="text-gold-light" />
              <h3 className="panel-title">Simulador de Próximo Lote de Relojes</h3>
            </div>
            <p className="panel-subtitle">
              Calcula con tu socio el capital necesario, la ganancia estimada y el reparto 50/50.
              Mueve la barra o escribe el precio exacto en cualquier momento.
            </p>
          </div>
          <span className="badge badge-emerald">Tiempo Real</span>
        </div>

        {/* Quick presets buttons */}
        <div className="sim-presets-bar">
          <span className="sim-presets-label">Plantillas Rápidas:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="sim-preset-btn"
              onClick={() => applyPreset(p)}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="sim-layout">
          {/* Controls Column with Dynamic Sliders */}
          <div className="sim-controls">
            {/* Cantidad de Relojes */}
            <PrecisionSlider
              label="Cantidad de Relojes a Comprar:"
              value={simUnits}
              onChange={setSimUnits}
              min={1}
              max={40}
              step={1}
              format={(v) => v}
              suffix=" piezas"
              color="gold"
              ticks={[
                { label: "4 unids", val: 4 },
                { label: "10 unids", val: 10 },
                { label: "20 unids", val: 20 },
                { label: "30 unids", val: 30 },
                { label: "40 unids", val: 40 },
              ]}
            />

            {/* Costo de Compra por Unidad */}
            <PrecisionSlider
              label="Costo de Compra por Unidad:"
              value={simBuyPrice}
              onChange={setSimBuyPrice}
              min={15000}
              max={150000}
              step={1000}
              format={formatCOP}
              color="emerald"
              ticks={[
                { label: "$25k", val: 25000 },
                { label: "$35k (Rolex Actual)", val: 35000 },
                { label: "$60k (Pro)", val: 60000 },
                { label: "$100k", val: 100000 },
              ]}
            />

            {/* Precio de Venta al Público (PVP) */}
            <PrecisionSlider
              label="Precio de Venta al Público (PVP):"
              value={simSellPrice}
              onChange={setSimSellPrice}
              min={30000}
              max={250000}
              step={1000}
              format={formatCOP}
              color="gold"
              ticks={[
                { label: "$50k", val: 50000 },
                { label: "$80k (Invicta Actual)", val: 80000 },
                { label: "$100k (Rolex Actual)", val: 100000 },
                { label: "$150k", val: 150000 },
              ]}
            />

            {/* Presupuesto Insumos */}
            <div className="control-group">
              <label>Presupuesto Empaques & Almohadillas (COP):</label>
              <input
                type="number"
                step="5000"
                value={simSupplies}
                onChange={(e) => setSimSupplies(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          {/* Results Column */}
          <div className="sim-results">
            <h4 className="sim-results-title">Proyección de Rentabilidad</h4>

            <div className="sim-results-grid">
              <div className="sim-res-card">
                <span className="rc-label">Capital Total Requerido</span>
                <h3 className="rc-val mono-num text-rose-primary">{formatCOP(simTotalCost)}</h3>
                <span className="rc-sub">
                  {formatCOP(Math.round(simTotalCost / 2))} por socio (50%)
                </span>
              </div>

              <div className="sim-res-card">
                <span className="rc-label">Ingresos Brutos Estimados</span>
                <h3 className="rc-val mono-num text-emerald-light">{formatCOP(simTotalRevenue)}</h3>
                <span className="rc-sub">
                  {simUnits} relojes vendidos
                </span>
              </div>

              <div className="sim-res-card highlight-gold-box">
                <span className="rc-label">Ganancia Neta del Lote</span>
                <h3 className="rc-val mono-num gold-text">{formatCOP(simGrossProfit)}</h3>
                <span className="rc-sub text-emerald-light font-bold">
                  Retorno (ROI): +{simROI}%
                </span>
              </div>

              <div className="sim-res-card">
                <span className="rc-label">Fondo Re-inversión (50%)</span>
                <h3 className="rc-val mono-num text-cyan-primary">{formatCOP(simReinvestment)}</h3>
                <span className="rc-sub">Para el próximo lote</span>
              </div>
            </div>

            {/* Dividend distribution preview */}
            <div className="sim-dividends-strip">
              <div className="div-partner">
                <span className="dp-label">Ganancia Elian (25% total):</span>
                <span className="dp-val mono-num text-emerald-light">{formatCOP(simPerPartner)}</span>
              </div>
              <div className="div-divider" />
              <div className="div-partner">
                <span className="dp-label">Ganancia Juan (25% total):</span>
                <span className="dp-val mono-num text-gold-light">{formatCOP(simPerPartner)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROYECCIÓN OFICIAL DEL INVENTARIO RESTANTE (KRONO TIMEPIECES - BALANCE ACTUALIZADO) */}
      <div className="krono-actual-projection-panel">
        <div className="kap-header">
          <div>
            <div className="kap-title-row">
              <ShieldCheck size={24} className="text-emerald" />
              <h3 className="panel-title gold-text">
                Proyección Oficial de Cierre: Inventario Restante KRONO
              </h3>
            </div>
            <p className="panel-subtitle">
              Balance consolidado en tiempo real con 20 relojes por vender (5 Invictas L1, 3 Rolex L2, 12 Lote 3), liquidación $0 deuda y cuentas entre socios.
            </p>
          </div>
          <span className="badge badge-emerald">Krono 50/50</span>
        </div>

        <div className="kap-grid">
          {/* 1. Ingresos por Entrar */}
          <div className="kap-card">
            <div>
              <div className="kap-card-title text-emerald">
                <Wallet size={16} /> 1. Ingresos Brutos por Entrar
              </div>
              <ul className="kap-list">
                <li>
                  <span>Invicta en negociación (1 ud):</span>
                  <strong className="mono-num text-main">
                    {formatCOP(fin.remainingInvictaNegotiation || 85000)}
                  </strong>
                </li>
                <li>
                  <span>4 Invictas restantes L1 ($80k c/u):</span>
                  <strong className="mono-num text-main">
                    {formatCOP(fin.remainingInvictaStockValue || 320000)}
                  </strong>
                </li>
                <li>
                  <span>3 Rolex restantes L2 ($100k c/u):</span>
                  <strong className="mono-num text-main">
                    {formatCOP(fin.remainingRolexStockValue || 300000)}
                  </strong>
                </li>
                <li>
                  <span>Lote #3 (6 Rolex, 3 Pro Diver, 3 Ruleta):</span>
                  <strong className="mono-num text-main">
                    {formatCOP(fin.lote3StockValue || 1095000)}
                  </strong>
                </li>
              </ul>
            </div>
            <div className="kap-card-total">
              <span>Total Ingreso Bruto:</span>
              <strong className="mono-num text-emerald">
                {formatCOP(fin.totalGrossRemainingRevenue || 1800000)}
              </strong>
            </div>
          </div>

          {/* 2. Descuento Inversión Pendiente */}
          <div className="kap-card">
            <div>
              <div className="kap-card-title text-rose">
                <Coins size={16} /> 2. Descuento de Inversión Pendiente
              </div>
              <ul className="kap-list">
                <li>
                  <span>Faltante para saldar Invictas:</span>
                  <strong className="mono-num text-rose">
                    -{formatCOP(fin.pendingInvictaRecovery || 20000)}
                  </strong>
                </li>
                <li>
                  <span>Faltante para saldar Rolex:</span>
                  <strong className="mono-num text-emerald">
                    $0 (100% Saldado)
                  </strong>
                </li>
                <li>
                  <span>Costo Mercancía Lote #3:</span>
                  <strong className="mono-num text-rose">
                    -{formatCOP(fin.lote3LotCost || 407000)}
                  </strong>
                </li>
                <li>
                  <span>Objetivo:</span>
                  <span className="badge badge-emerald">Quedar en $0 Deuda</span>
                </li>
              </ul>
            </div>
            <div className="kap-card-total">
              <span>Total Inversión a Cubrir:</span>
              <strong className="mono-num text-rose">
                -{formatCOP((fin.pendingInvictaRecovery || 20000) + (fin.lote3LotCost || 407000))}
              </strong>
            </div>
          </div>

          {/* 3. Ganancia Neta Limpia Total */}
          <div className="kap-card" style={{ border: "1px solid rgba(229, 184, 105, 0.4)" }}>
            <div>
              <div className="kap-card-title gold-text">
                <Sparkles size={16} /> 3. Ganancia Neta Limpia Total
              </div>
              <ul className="kap-list">
                <li>
                  <span>Ingreso Bruto (20 relojes):</span>
                  <strong className="mono-num text-emerald">
                    {formatCOP(fin.totalGrossRemainingRevenue || 1800000)}
                  </strong>
                </li>
                <li>
                  <span>Menos Costos & Saldos:</span>
                  <strong className="mono-num text-rose">
                    -{formatCOP((fin.pendingInvictaRecovery || 20000) + (fin.lote3LotCost || 407000))}
                  </strong>
                </li>
                <li>
                  <span>Estado Lotes Previos:</span>
                  <strong className="text-emerald">Rolex 100% Ganancia / Invictas $20k</strong>
                </li>
              </ul>
            </div>
            <div className="kap-card-total">
              <span className="gold-text">Ganancia Neta Limpia:</span>
              <strong className="mono-num gold-text" style={{ fontSize: "1.1rem" }}>
                {formatCOP(fin.netCleanProfitRemaining || 1373000)}
              </strong>
            </div>
          </div>
        </div>

        {/* Reparto 50/50 y Liquidación con Ajustes */}
        <div className="kap-settle-strip">
          <div className="kap-settle-partner">
            <span className="badge badge-emerald">Para ti (Elian Navarro)</span>
            <div className="text-xs text-dim">
              Ganancia 50% ({formatCOP(fin.netCleanProfit50Each || 686500)}) + Cobro Deuda Juan ({formatCOP(fin.juanRemainingDebt || 30000)})
            </div>
            <strong className="mono-num text-emerald" style={{ fontSize: "1.25rem" }}>
              {formatCOP(fin.elianFinalProjectedPayout || 716500)}
            </strong>
          </div>

          <div className="div-divider" style={{ height: 40 }} />

          <div className="kap-settle-partner">
            <span className="badge badge-gold">Para Juan</span>
            <div className="text-xs text-dim">
              Ganancia 50% ({formatCOP(fin.netCleanProfit50Each || 686500)}) - Pago Deuda a Elian (-{formatCOP(fin.juanRemainingDebt || 30000)})
            </div>
            <strong className="mono-num text-gold" style={{ fontSize: "1.25rem" }}>
              {formatCOP(fin.juanFinalProjectedPayout || 656500)}
            </strong>
          </div>
        </div>
      </div>

      {/* Calendario de Quincenas */}
      <div className="glass-panel calendar-panel">
        <div className="panel-header">
          <div>
            <div className="flex-row items-center gap-2">
              <Calendar size={22} className="text-gold-light" />
              <h3 className="panel-title">Calendario Comercial & Quincenas Clave</h3>
            </div>
            <p className="panel-subtitle">Fechas estratégicas de mayor liquidez en Colombia para impulsar ventas</p>
          </div>
          <span className="badge badge-gold">Plan Comercial</span>
        </div>

        <div className="calendar-milestones-grid">
          {milestones.map((m) => (
            <div key={m.id} className={`milestone-card ${m.active ? "active-milestone" : ""}`}>
              <div className="mc-header">
                <span className={`badge badge-${m.badgeColor}`}>{m.dateBadge}</span>
                <span className="mc-tag">{m.tag}</span>
                {isEditMode && (
                  <button
                    className="delete-item-btn"
                    onClick={() => handleDeleteMilestone(m.id)}
                    title="Eliminar hito"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <h4 className="mc-title">{m.title}</h4>
              <p className="mc-desc">{m.desc}</p>
            </div>
          ))}
        </div>

        {isEditMode && (
          <div className="add-milestone-bar">
            <input
              type="text"
              placeholder="Agregar nuevo hito u objetivo comercial..."
              value={newMilestoneText}
              onChange={(e) => setNewMilestoneText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMilestone()}
              className="form-input"
            />
            <button className="btn btn-gold" onClick={handleAddMilestone}>
              <PlusCircle size={16} /> Agregar Hito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default StrategyPage;
