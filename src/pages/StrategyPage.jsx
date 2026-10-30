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
} from "lucide-react";

export function StrategyPage({ financials, formatCOP, isEditMode, lotConfig, onUpdateLotConfig }) {
  const fin = financials;

  // Simulator State
  const [simUnits, setSimUnits] = useState(lotConfig?.targetUnits || 10);
  const [simBuyPrice, setSimBuyPrice] = useState(lotConfig?.targetCostPerUnit || 45000);
  const [simSellPrice, setSimSellPrice] = useState(lotConfig?.targetSellPerUnit || 90000);
  const [simSupplies, setSimSupplies] = useState(lotConfig?.suppliesBudget || 60000);

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

  // Custom milestones
  const [milestones, setMilestones] = useState([
    {
      id: "m-1",
      dateBadge: "30 de Octubre (Hoy)",
      badgeColor: "amber",
      tag: "Quincena Actual",
      title: "Cobro 4ª Venta Amiga & Cierre Mensual",
      desc: "Cobro de los $85.000 pactados. Cierre de balance y abono de deuda de Juan a Elian.",
      active: true,
    },
    {
      id: "m-2",
      dateBadge: "15 de Noviembre",
      badgeColor: "cyan",
      tag: "Quincena #1 Nov",
      title: "Campaña Liquidación Relojes Venom & Bolt Zeus",
      desc: "Promocionar en WhatsApp y catálogo los 4 relojes disponibles en inventario con fotos de alta calidad.",
      active: false,
    },
    {
      id: "m-3",
      dateBadge: "30 de Noviembre",
      badgeColor: "cyan",
      tag: "Black Friday",
      title: "Adquisición Lote Navideño Rolex / Invicta Master",
      desc: "Unificar el fondo de reinversión para hacer el pedido mayorista antes del alza de temporada decembrina.",
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

      {/* Simulator Section */}
      <div className="glass-panel simulator-panel">
        <div className="panel-header">
          <div>
            <div className="flex-row items-center gap-2">
              <Calculator size={22} className="text-gold-light" />
              <h3 className="panel-title">Simulador de Próximo Lote de Relojes</h3>
            </div>
            <p className="panel-subtitle">
              Calcula con tu socio el capital necesario, la ganancia estimada y el reparto 50/50
            </p>
          </div>
          <span className="badge badge-emerald">Tiempo Real</span>
        </div>

        <div className="sim-layout">
          {/* Controls Column */}
          <div className="sim-controls">
            <div className="control-group">
              <div className="control-header">
                <label>Cantidad de Relojes a Comprar:</label>
                <span className="mono-num font-bold text-gold-light">{simUnits} piezas</span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                step="1"
                value={simUnits}
                onChange={(e) => setSimUnits(Number(e.target.value))}
                className="sim-slider"
              />
              <div className="slider-ticks">
                <span>4 unids</span>
                <span>10 unids</span>
                <span>20 unids</span>
                <span>30 unids</span>
              </div>
            </div>

            <div className="control-group">
              <div className="control-header">
                <label>Costo de Compra por Unidad:</label>
                <span className="mono-num font-bold text-emerald-light">{formatCOP(simBuyPrice)}</span>
              </div>
              <input
                type="range"
                min="25000"
                max="150000"
                step="5000"
                value={simBuyPrice}
                onChange={(e) => setSimBuyPrice(Number(e.target.value))}
                className="sim-slider"
              />
              <div className="slider-ticks">
                <span>$25k (Básico)</span>
                <span>$60k (Pro)</span>
                <span>$150k (Rolex Edition)</span>
              </div>
            </div>

            <div className="control-group">
              <div className="control-header">
                <label>Precio de Venta al Público (PVP):</label>
                <span className="mono-num font-bold text-gold-light">{formatCOP(simSellPrice)}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="300000"
                step="5000"
                value={simSellPrice}
                onChange={(e) => setSimSellPrice(Number(e.target.value))}
                className="sim-slider"
              />
              <div className="slider-ticks">
                <span>$50k</span>
                <span>$90k (Actual)</span>
                <span>$180k (Rolex)</span>
                <span>$300k</span>
              </div>
            </div>

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
