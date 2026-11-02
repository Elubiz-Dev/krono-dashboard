import React, { useState } from "react";
import {
  Crown,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Coins,
  DollarSign,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function KronoVision50({ formatCOP, currentWatches = 14 }) {
  const [monthlySalesPace, setMonthlySalesPace] = useState(16); // 16 relojes al mes (4 por semana)
  const [avgSellPrice, setAvgSellPrice] = useState(95000); // PVP promedio
  const [avgUnitCost, setAvgUnitCost] = useState(34000); // Costo mayorista promedio de reposición
  const [monthlySuppliesCost, setMonthlySuppliesCost] = useState(70000); // Empaques, pilas, paños
  const [isExpanded, setIsExpanded] = useState(true);

  // Metas fijas del modelo 50 relojes
  const targetStock = 50;
  const progressPercent = Math.min(100, Math.round((currentWatches / targetStock) * 100));
  const remainingWatchesTo50 = Math.max(0, targetStock - currentWatches);

  // Finanzas del punto de cosecha (50 relojes)
  const monthlyRevenue = monthlySalesPace * avgSellPrice;
  const monthlyReplenishment = monthlySalesPace * avgUnitCost;
  const totalMonthlyOutflow = monthlyReplenishment + monthlySuppliesCost;
  const netMonthlyProfit = monthlyRevenue - totalMonthlyOutflow;
  const profitPerPartner = Math.round(netMonthlyProfit / 2);
  const profitPerQuincena = Math.round(profitPerPartner / 2);

  // Valor patrimonial del inventario en bodega (50 relojes 100% pagados)
  const inventoryAssetValue = targetStock * avgUnitCost; // Capital de trabajo intocable
  const inventoryCommercialValue = targetStock * avgSellPrice; // Valor PVP

  // Presets de ritmo de ventas mensual
  const SCENARIOS = [
    { label: "Ritmo Conservador", pace: 10, desc: "2-3 relojes x semana" },
    { label: "Ritmo Óptimo (Meta)", pace: 16, desc: "4 relojes x semana" },
    { label: "Pico Temporada Alta", pace: 25, desc: "6-7 relojes x semana (Navidad)" },
  ];

  return (
    <div className="dash-panel krono-vision-panel" style={{
      position: "relative",
      background: "linear-gradient(145deg, rgba(13, 18, 33, 0.95) 0%, rgba(8, 10, 16, 0.98) 100%)",
      border: "1px solid rgba(99, 102, 241, 0.35)",
      borderRadius: "16px",
      padding: "24px 26px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.12)",
      overflow: "hidden",
      marginBottom: "24px",
    }}>
      {/* Decorative top ambient glow line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "10%",
        right: "10%",
        height: "2px",
        background: "linear-gradient(90deg, transparent, #6366f1, #10b981, #06b6d4, transparent)",
        opacity: 0.8,
      }} />

      {/* Header section */}
      <div className="flex-between items-center" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
        <div className="flex-row items-center gap-3">
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.15))",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#818cf8",
            boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)",
          }}>
            <Target size={24} className="text-indigo" />
          </div>
          <div>
            <div className="flex-row items-center gap-2">
              <span className="badge badge-indigo" style={{ letterSpacing: "0.5px" }}>
                <Zap size={11} /> VISIÓN ESTRATÉGICA FUNDADORES
              </span>
              <span className="badge badge-emerald">
                Punto de Cosecha 50/50
              </span>
            </div>
            <h3 style={{
              margin: "4px 0 0 0",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              Horizonte KRONO 50: Stock Autosostenible & Sueldo Mensual Limpio
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem", color: "#94a3b8" }}>
              El plan exacto para llegar a 50 relojes de stock diverso donde <strong>se acaba la reinversión obligatoria</strong> y el margen se convierte en ganancia mensual neta para Elian y Juan.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-xs btn-outline"
          style={{ display: "flex", alignItems: "center", gap: "6px", borderColor: "rgba(255,255,255,0.15)" }}
        >
          {isExpanded ? (
            <><span>Ocultar Simulación</span> <ChevronUp size={14} /></>
          ) : (
            <><span>Ver Plan de Cosecha</span> <ChevronDown size={14} /></>
          )}
        </button>
      </div>

      {/* Progress Thermometer 14 -> 50 Watches */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: isExpanded ? "22px" : "0",
      }}>
        <div className="flex-between items-center" style={{ marginBottom: "8px" }}>
          <div className="flex-row items-center gap-2">
            <Package size={16} className="text-indigo" />
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ffffff" }}>
              Progreso hacia la Meta de 50 Relojes de Inventario:
            </span>
          </div>
          <div className="flex-row items-center gap-2">
            <strong className="mono-num text-emerald" style={{ fontSize: "1rem" }}>
              {currentWatches} de {targetStock} Unidades
            </strong>
            <span className="badge badge-emerald" style={{ fontSize: "0.75rem" }}>
              {progressPercent}% Completado
            </span>
          </div>
        </div>

        {/* Multi-step progress bar */}
        <div style={{
          height: "12px",
          borderRadius: "8px",
          background: "rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
          position: "relative",
          marginBottom: "10px",
        }}>
          <div style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, #6366f1, #06b6d4, #10b981)",
            boxShadow: "0 0 16px rgba(16, 185, 129, 0.6)",
            borderRadius: "8px",
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />
        </div>

        {/* Milestone Steps */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          fontSize: "0.75rem",
        }}>
          <div style={{ color: "#34d399", fontWeight: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 size={12} className="text-emerald" />
              <span>Fase 1: 14 Relojes</span>
            </div>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}>Lote Actual (8 Invictas + 6 Rolex)</span>
          </div>

          <div style={{ color: currentWatches >= 25 ? "#34d399" : "#c7d2fe" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span className={`status-dot-pulse ${currentWatches >= 25 ? "bg-emerald" : "bg-indigo"}`} style={{ width: 8, height: 8 }} />
              <span>Fase 2: 25 Relojes</span>
            </div>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}>Lote Black Friday / Navidad</span>
          </div>

          <div style={{ color: currentWatches >= 38 ? "#34d399" : "#94a3b8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#475569" }} />
              <span>Fase 3: 38 Relojes</span>
            </div>
            <span style={{ fontSize: "0.7rem", color: "#64748b", display: "block" }}>Catálogo Multi-Marca</span>
          </div>

          <div style={{ color: currentWatches >= 50 ? "#34d399" : "#a5b4fc", fontWeight: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Crown size={12} className="text-indigo" />
              <span>Fase 4: 50 Relojes ⭐</span>
            </div>
            <span style={{ fontSize: "0.7rem", color: "#10b981", display: "block" }}>¡Punto de Cosecha & Sueldo!</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Why 50 Watches? The Intelligent Financial Principle */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}>
            <div style={{
              background: "rgba(99, 102, 241, 0.06)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "12px",
              padding: "16px",
            }}>
              <div className="flex-row items-center gap-2 mb-2">
                <Sparkles size={16} className="text-indigo" />
                <strong style={{ fontSize: "0.88rem", color: "#e0e7ff" }}>
                  ¿Por qué a los 50 Relojes se acaba la reinversión?
                </strong>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5, margin: 0 }}>
                Hoy sacrificamos el 50% de las utilidades porque estamos <strong>construyendo el catálogo</strong>.
                Con 50 relojes surtidos en stock (alta gama, deportivos, ejecutivos y casuales), el negocio tiene el tamaño óptimo de rotación.
                <strong> Ya no hace falta retener utilidades para crecer</strong>: solo repones la pieza vendida y el resto es ganancia 100% líquida.
              </p>
            </div>

            <div style={{
              background: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "12px",
              padding: "16px",
            }}>
              <div className="flex-row items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-emerald" />
                <strong style={{ fontSize: "0.88rem", color: "#6ee7b7" }}>
                  La Regla de Reposición Automática (Sin Deuda)
                </strong>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5, margin: 0 }}>
                En fase 50 relojes, cuando vendes un reloj por <strong>$95.000 COP</strong>:
                separas <strong>$34.000</strong> para reponer la misma unidad con el mayorista y pagar insumos, y los <strong>+$61.000 COP limpios</strong> van a la caja de utilidades para repartir 50% a Elian y 50% a Juan.
                El stock de 50 nunca disminuye y la ganancia no para.
              </p>
            </div>
          </div>

          {/* Scenario Selector & Dynamic Projection Simulator */}
          <div style={{
            background: "rgba(0, 0, 0, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "18px 22px",
            marginBottom: "20px",
          }}>
            <div className="flex-between items-center" style={{ flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", fontWeight: 700 }}>
                  Simulador de Cosecha: Sueldo Mensual Libre a 50 Relojes
                </h4>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  Selecciona el ritmo de ventas mensual proyectado:
                </span>
              </div>

              {/* Preset buttons */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {SCENARIOS.map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => setMonthlySalesPace(sc.pace)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "0.76rem",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      background: monthlySalesPace === sc.pace ? "rgba(99, 102, 241, 0.3)" : "rgba(255, 255, 255, 0.05)",
                      border: monthlySalesPace === sc.pace ? "1px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.1)",
                      color: monthlySalesPace === sc.pace ? "#ffffff" : "#94a3b8",
                    }}
                  >
                    <span>{sc.label}</span>{" "}
                    <span style={{ color: monthlySalesPace === sc.pace ? "#34d399" : "#64748b" }}>
                      ({sc.pace}/mes)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider to customize sales pace */}
            <div style={{ marginBottom: "16px" }}>
              <div className="flex-between text-xs" style={{ marginBottom: "6px", color: "#94a3b8" }}>
                <span>Rotación mensual estimada de inventario:</span>
                <strong className="mono-num text-white" style={{ fontSize: "0.85rem" }}>
                  {monthlySalesPace} relojes / mes (~{(monthlySalesPace / 4).toFixed(1)} por semana)
                </strong>
              </div>
              <input
                type="range"
                min={6}
                max={35}
                step={1}
                value={monthlySalesPace}
                onChange={(e) => setMonthlySalesPace(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "#6366f1",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Financial Results Cards Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}>
              {/* Card 1: Ingreso Bruto Mensual */}
              <div style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "10px",
                padding: "14px",
              }}>
                <span style={{ fontSize: "0.72rem", color: "#94a3b8", display: "block" }}>
                  Ingreso Bruto de Ventas:
                </span>
                <strong className="mono-num text-cyan" style={{ fontSize: "1.2rem", display: "block", marginTop: "4px" }}>
                  {formatCOP(monthlyRevenue)}
                </strong>
                <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                  {monthlySalesPace} ventas @ {formatCOP(avgSellPrice)} prom.
                </span>
              </div>

              {/* Card 2: Costo de Reposición Intocable */}
              <div style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "10px",
                padding: "14px",
              }}>
                <span style={{ fontSize: "0.72rem", color: "#94a3b8", display: "block" }}>
                  Reposición de Stock + Insumos:
                </span>
                <strong className="mono-num text-rose" style={{ fontSize: "1.2rem", display: "block", marginTop: "4px" }}>
                  -{formatCOP(totalMonthlyOutflow)}
                </strong>
                <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                  Vuelve a compras para mantener los 50 relojes
                </span>
              </div>

              {/* Card 3: Utilidad Mensual Limpia */}
              <div style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "10px",
                padding: "14px",
              }}>
                <span style={{ fontSize: "0.72rem", color: "#34d399", display: "block", fontWeight: 600 }}>
                  💰 Ganancia Neta Limpia Total:
                </span>
                <strong className="mono-num text-emerald" style={{ fontSize: "1.3rem", display: "block", marginTop: "4px", textShadow: "0 0 12px rgba(16, 185, 129, 0.3)" }}>
                  +{formatCOP(netMonthlyProfit)} / mes
                </strong>
                <span style={{ fontSize: "0.7rem", color: "#34d399" }}>
                  Dinero 100% disponible para socios
                </span>
              </div>
            </div>

            {/* Payout by Partner 50/50 Box */}
            <div style={{
              marginTop: "14px",
              padding: "14px 18px",
              borderRadius: "10px",
              background: "linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}>
              <div>
                <span style={{ fontSize: "0.82rem", color: "#ffffff", fontWeight: 600, display: "block" }}>
                  Sueldo Mensual Libre por Cofundador (Reparto 50 / 50):
                </span>
                <span style={{ fontSize: "0.73rem", color: "#94a3b8" }}>
                  Cobro quincenal de ~{formatCOP(profitPerQuincena)} cada 15 y 30 de mes sin tocar capital personal.
                </span>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.7rem", color: "#34d399", display: "block" }}>Elian Navarro:</span>
                  <strong className="mono-num text-emerald" style={{ fontSize: "1.15rem" }}>
                    {formatCOP(profitPerPartner)} / mes
                  </strong>
                </div>
                <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.15)" }} />
                <div>
                  <span style={{ fontSize: "0.7rem", color: "#a5b4fc", display: "block" }}>Juan:</span>
                  <strong className="mono-num text-indigo" style={{ fontSize: "1.15rem" }}>
                    {formatCOP(profitPerPartner)} / mes
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Synergy Footer Note */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            fontSize: "0.78rem",
            color: "#94a3b8",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={14} className="text-emerald" />
              <span>
                <strong>Patrimonio KRONO Protegido:</strong> Los 50 relojes en bodega representan <strong>{formatCOP(inventoryAssetValue)}</strong> en activos tangibles que respaldan el negocio.
              </span>
            </div>
            <div style={{ color: "#c7d2fe" }}>
              Faltan <strong>{remainingWatchesTo50} unidades</strong> para la meta (~2 compras mayoristas).
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default KronoVision50;
