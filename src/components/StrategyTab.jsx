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
} from "lucide-react";

export function StrategyTab({ financials, formatCOP }) {
  const fin = financials;

  // Simulator State
  const [simUnits, setSimUnits] = useState(10);
  const [simBuyPrice, setSimBuyPrice] = useState(45000);
  const [simSellPrice, setSimSellPrice] = useState(90000);
  const [simSupplies, setSimSupplies] = useState(60000);

  // Calculations
  const simTotalCost = simUnits * simBuyPrice + Number(simSupplies);
  const simTotalRevenue = simUnits * simSellPrice;
  const simGrossProfit = simTotalRevenue - simTotalCost;
  const simROI = simTotalCost > 0 ? Math.round((simGrossProfit / simTotalCost) * 100) : 0;

  const simReinvestment = Math.max(0, Math.round(simGrossProfit * 0.5));
  const simDistributable = Math.max(0, simGrossProfit - simReinvestment);
  const simPerPartner = Math.round(simDistributable * 0.5);

  const rolexGoal = 600000;
  const currentFund = fin.reinvestmentFund50;
  const fundProgress = Math.min(100, Math.round((currentFund / rolexGoal) * 100));

  return (
    <div className="strategy-container">
      {/* Top Reinvestment Fund Target Tracker */}
      <div className="glass-panel glass-panel-gold fund-target-panel">
        <div className="fund-top">
          <div className="fund-info">
            <span className="badge badge-gold">
              <Target size={13} /> Meta de Crecimiento
            </span>
            <h2 className="fund-title gold-text">
              Fondo de Re-inversión (50% Ganancias)
            </h2>
            <p className="fund-desc">
              Regla de oro de Krono: La mitad de toda ganancia neta se acumula exclusivamente
              para la adquisición de lotes superiores (Rolex / Invicta Pro Series).
            </p>
          </div>
          <div className="fund-stats-box">
            <span className="fs-label">Acumulado Hoy:</span>
            <span className="fs-val mono-num text-emerald-light">
              {formatCOP(currentFund)}
            </span>
            <span className="fs-target">Meta Lote Rolex: {formatCOP(rolexGoal)}</span>
          </div>
        </div>

        <div className="fund-progress-wrap">
          <div className="fund-progress-bar">
            <div
              className="fund-progress-fill"
              style={{ width: `${Math.max(5, fundProgress)}%` }}
            />
          </div>
          <div className="fund-progress-labels">
            <span>Inicio ($0)</span>
            <span className="mono-num text-gold-light">{fundProgress}% Completado</span>
            <span>Meta {formatCOP(rolexGoal)}</span>
          </div>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="glass-panel simulator-panel">
        <div className="panel-header">
          <div>
            <div className="flex-row items-center gap-2">
              <Calculator size={22} className="text-gold-light" />
              <h3 className="panel-title">Simulador de Próximo Lote (Diciembre 2026)</h3>
            </div>
            <p className="panel-subtitle">
              Calcula con Juan el capital a invertir, utilidades esperadas y reparto 50/50
            </p>
          </div>
          <span className="badge badge-emerald">Modo Interactivo</span>
        </div>

        <div className="sim-layout">
          {/* Controls Column */}
          <div className="sim-controls">
            <div className="control-group">
              <div className="control-header">
                <label>Cantidad de Relojes a Comprar:</label>
                <span className="mono-num font-bold text-gold-light">{simUnits} unidades</span>
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
                <span>4</span>
                <span>10</span>
                <span>20</span>
                <span>30 unidades</span>
              </div>
            </div>

            <div className="control-group">
              <div className="control-header">
                <label>Costo de Compra por Unidad (COP):</label>
                <span className="mono-num font-bold text-emerald-light">{formatCOP(simBuyPrice)}</span>
              </div>
              <input
                type="range"
                min="25000"
                max="120000"
                step="5000"
                value={simBuyPrice}
                onChange={(e) => setSimBuyPrice(Number(e.target.value))}
                className="sim-slider"
              />
              <div className="slider-ticks">
                <span>$25k (Invicta)</span>
                <span>$60k (Pro)</span>
                <span>$120k (Rolex Master)</span>
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
                max="250000"
                step="5000"
                value={simSellPrice}
                onChange={(e) => setSimSellPrice(Number(e.target.value))}
                className="sim-slider"
              />
              <div className="slider-ticks">
                <span>$50k</span>
                <span>$90k (Actual)</span>
                <span>$180k (Rolex)</span>
                <span>$250k</span>
              </div>
            </div>

            <div className="control-group">
              <label>Presupuesto Insumos & Empaques:</label>
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
                  {formatCOP(simTotalCost / 2)} por socio (50%)
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
                <span className="rc-sub text-emerald-light">
                  Retorno (ROI): +{simROI}%
                </span>
              </div>

              <div className="sim-res-card">
                <span className="rc-label">Fondo Re-inversión (50%)</span>
                <h3 className="rc-val mono-num text-cyan-primary">{formatCOP(simReinvestment)}</h3>
                <span className="rc-sub">
                  Para el siguiente ciclo
                </span>
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

      {/* Quincenas & Key Commercial Dates Calendar */}
      <div className="glass-panel calendar-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">📅 Calendario Comercial de Quincenas</h3>
            <p className="panel-subtitle">Fechas estratégicas con picos de liquidez y pago de quincenas en Colombia</p>
          </div>
          <span className="badge badge-gold">Plan de Ventas</span>
        </div>

        <div className="calendar-milestones-grid">
          <div className="milestone-card active-milestone">
            <div className="mc-header">
              <span className="badge badge-amber">30 de Octubre (Hoy)</span>
              <span className="mc-tag">Quincena Actual</span>
            </div>
            <h4 className="mc-title">Cobro 4ª Venta Amiga & Cierre Mensual</h4>
            <p className="mc-desc">
              Cobro de los <strong>{formatCOP(85000)}</strong> acordados. Cierre de cuentas del primer mes de Krono.
            </p>
          </div>

          <div className="milestone-card">
            <div className="mc-header">
              <span className="badge badge-cyan">15 de Noviembre</span>
              <span className="mc-tag">Quincena #1 Nov</span>
            </div>
            <h4 className="mc-title">Liquidación Relojes Venom & Bolt Zeus</h4>
            <p className="mc-desc">
              Promocionar en WhatsApp y redes los 4 relojes disponibles en inventario.
            </p>
          </div>

          <div className="milestone-card">
            <div className="mc-header">
              <span className="badge badge-cyan">30 de Noviembre</span>
              <span className="mc-tag">Black Friday</span>
            </div>
            <h4 className="mc-title">Adquisición del Lote Navideño Rolex</h4>
            <p className="mc-desc">
              Unificar fondos de reinversión para hacer el pedido mayorista antes del alza de diciembre.
            </p>
          </div>

          <div className="milestone-card">
            <div className="mc-header">
              <span className="badge badge-emerald">15 al 24 de Diciembre</span>
              <span className="mc-tag">Temporada Alta</span>
            </div>
            <h4 className="mc-title">Auge de Primas & Regalos de Navidad</h4>
            <p className="mc-desc">
              Pico máximo anual de ventas. Meta de vender 15 a 20 relojes con empaque de lujo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
