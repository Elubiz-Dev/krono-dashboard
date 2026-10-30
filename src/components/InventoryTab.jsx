import React, { useState } from "react";
import {
  ShieldCheck,
  Tag,
  Clock,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
} from "lucide-react";

export function InventoryTab({
  inventory,
  onSellWatch,
  formatCOP,
}) {
  const [filter, setFilter] = useState("all");

  const filteredInventory = inventory.filter((item) => {
    if (filter === "available") return item.stock > 0;
    if (filter === "sold") return item.stock === 0;
    return true;
  });

  const totalStockUnits = inventory.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  const soldUnits = inventory.reduce((acc, curr) => acc + ((curr.initialUnits || 1) - (curr.stock || 0)), 0);
  const estimatedStockValue = totalStockUnits * 87500; // Average ref price $87,500 COP

  return (
    <div className="inventory-container">
      {/* Top Inventory Summary Bar */}
      <div className="glass-panel inventory-kpi-bar">
        <div className="inv-stat">
          <div className="inv-stat-icon bg-emerald">
            <Package size={20} className="text-emerald-light" />
          </div>
          <div>
            <span className="inv-stat-label">Relojes Disponibles</span>
            <h3 className="inv-stat-val mono-num text-emerald-light">
              {totalStockUnits} Unidades
            </h3>
          </div>
        </div>

        <div className="inv-stat">
          <div className="inv-stat-icon bg-gold">
            <ShoppingBag size={20} className="text-gold-light" />
          </div>
          <div>
            <span className="inv-stat-label">Unidades Vendidas</span>
            <h3 className="inv-stat-val mono-num text-gold-light">
              {soldUnits} Relojes
            </h3>
          </div>
        </div>

        <div className="inv-stat">
          <div className="inv-stat-icon bg-cyan">
            <TrendingUp size={20} className="text-cyan-primary" />
          </div>
          <div>
            <span className="inv-stat-label">Valor Estimado en Stock</span>
            <h3 className="inv-stat-val mono-num">
              ~{formatCOP(estimatedStockValue)}
            </h3>
          </div>
        </div>

        <div className="inv-filter-pills no-print">
          <button
            className={`pill-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos ({inventory.length})
          </button>
          <button
            className={`pill-btn ${filter === "available" ? "active" : ""}`}
            onClick={() => setFilter("available")}
          >
            Disponibles ({totalStockUnits})
          </button>
          <button
            className={`pill-btn ${filter === "sold" ? "active" : ""}`}
            onClick={() => setFilter("sold")}
          >
            Agotados
          </button>
        </div>
      </div>

      {/* Watches Grid */}
      <div className="watches-grid">
        {filteredInventory.map((item) => {
          const isAvailable = item.stock > 0;

          return (
            <div
              key={item.id}
              className={`glass-panel watch-card ${isAvailable ? "watch-card-active" : "watch-card-sold"}`}
            >
              <div className="watch-img-wrap">
                <img
                  src={item.image || "/assets/invictaa.jpg"}
                  alt={item.model}
                  className="watch-img"
                  onError={(e) => {
                    e.target.src = "/assets/krono_logo.jpg";
                  }}
                />
                <div className="watch-badge-overlay">
                  <span
                    className={`badge ${
                      isAvailable ? (item.stock === 1 ? "badge-amber" : "badge-emerald") : "badge-rose"
                    }`}
                  >
                    {isAvailable ? `${item.stock} Disponible${item.stock > 1 ? "s" : ""}` : "Agotado / Vendido"}
                  </span>
                </div>
              </div>

              <div className="watch-details">
                <span className="watch-brand">{item.brand || "Krono Invicta"}</span>
                <h4 className="watch-title">{item.model}</h4>

                <div className="watch-price-row">
                  <div>
                    <span className="price-label">Precio Referencia</span>
                    <span className="price-val mono-num gold-text">{item.refPrice}</span>
                  </div>
                  {item.soldPrice && (
                    <div className="text-right">
                      <span className="price-label">Vendido Por</span>
                      <span className="price-val mono-num text-emerald-light">
                        {formatCOP(item.soldPrice)}
                      </span>
                    </div>
                  )}
                </div>

                {item.highlight && (
                  <p className="watch-highlight">
                    <Sparkles size={13} className="text-gold-light" />
                    <span>{item.highlight}</span>
                  </p>
                )}

                <div className="watch-footer-action no-print">
                  {isAvailable ? (
                    <button
                      onClick={() => onSellWatch(item)}
                      className="btn-primary-gold btn-full btn-sm"
                    >
                      <ShoppingBag size={15} />
                      Registrar Venta
                    </button>
                  ) : (
                    <div className="sold-tag">
                      <CheckCircle2 size={15} className="text-emerald-light" />
                      <span>Venta Concretada y Liquidada</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Preview: Next Rolex Lot */}
      <div className="glass-panel next-lot-card">
        <div className="next-lot-img-wrap">
          <img
            src="/assets/rolex.jpg"
            alt="Próximo Lote Rolex"
            className="next-lot-img"
            onError={(e) => {
              e.target.src = "/assets/krono_logo.jpg";
            }}
          />
        </div>
        <div className="next-lot-info">
          <div className="badge badge-gold">
            <Sparkles size={12} /> Próximo Objetivo • Temporada Alta
          </div>
          <h3 className="next-lot-title gold-text">
            Lote Premium Rolex Edition (Diciembre 2026)
          </h3>
          <p className="next-lot-desc">
            Gracias a la regla de reinversión del 50%, el capital generado por el lote actual
            se destinará a financiar el lote de cronógrafos de gama alta tipo Rolex Submariner y Datejust.
            Este lote proyecta un margen de ganancia superior al 100% por unidad vendida.
          </p>
          <div className="next-lot-stats">
            <div className="nl-stat">
              <span>Meta de Inversión:</span>
              <strong className="mono-num text-gold-light">{formatCOP(600000)}</strong>
            </div>
            <div className="nl-stat">
              <span>Precio Reventa Proyectado:</span>
              <strong className="mono-num text-emerald-light">{formatCOP(150000)} / unidad</strong>
            </div>
            <div className="nl-stat">
              <span>Margen Neto Estimado:</span>
              <strong className="mono-num text-emerald-light">~+105% ROI</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
