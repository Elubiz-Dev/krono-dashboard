import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Package,
  Crown,
  Zap,
  Search,
  ArrowRight,
  ShieldCheck,
  BookmarkCheck,
  RotateCcw,
  MapPin,
  Tag,
  User,
  CreditCard,
  Calendar,
  Layers,
  TrendingUp,
  Copy,
  Sparkles,
} from "lucide-react";

// ═══════════════════════ LOT DEFINITIONS ═══════════════════════
const LOT_DEFS = {
  "invicta-core": {
    id: "invicta-core",
    label: "Lote #1 — Invicta Core",
    shortLabel: "Invicta Core",
    totalUnits: 8,
    investment: 260000,
    costPerUnit: 32500,
    color: "#10b981",
    badgeClass: "badge-emerald",
    icon: Zap,
    pendingRecovery: 20000,
  },
  "rolex-scale": {
    id: "rolex-scale",
    label: "Lote #2 — Rolex Escalamiento",
    shortLabel: "Rolex Scale",
    totalUnits: 6,
    investment: 200000,
    costPerUnit: 33333,
    color: "#6366f1",
    badgeClass: "badge-indigo",
    icon: Crown,
    pendingRecovery: 20000,
  },
};

function copyWhatsAppCard(item, formatCOP) {
  const lines = [
    `⌚ *${item.model}*`,
    `🏷️ ${item.brand}`,
    item.tags ? `✨ ${item.tags.join(" • ")}` : "",
    `💰 *Precio KRONO: ${formatCOP(item.targetPrice || 80000)} COP*`,
    ``,
    `✅ Garantía de autenticidad KRONO Timepieces`,
    `📦 Empaque de lujo + paño de microfibra`,
    `📲 ¡Escríbenos para separarlo con anticipo!`,
  ].filter(Boolean).join("\n");
  navigator.clipboard.writeText(lines);
}

export function InventoryPage({
  inventory,
  onSellWatch,
  onOpenReserve,
  onCompleteReservation,
  onCancelReservation,
  formatCOP,
  isEditMode,
}) {
  const [activeLot, setActiveLot] = useState("all"); // 'all' | 'invicta-core' | 'rolex-scale'
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedSku, setCopiedSku] = useState(null);

  // Group watches by lot
  const lotGroups = useMemo(() => {
    const groups = {};
    inventory.forEach((item) => {
      const lotKey = item.lot || (item.category === "rolex" ? "rolex-scale" : "invicta-core");
      if (!groups[lotKey]) groups[lotKey] = [];
      groups[lotKey].push(item);
    });
    return groups;
  }, [inventory]);

  // Compute lot-level metrics
  const lotMetrics = useMemo(() => {
    const metrics = {};
    Object.entries(LOT_DEFS).forEach(([key, def]) => {
      const items = lotGroups[key] || [];
      const sold = items.filter((i) => i.soldPrice && (i.stock === 0 || i.status === "Agotado"));
      const totalSoldRevenue = sold.reduce((a, i) => a + (i.soldPrice || 0) * (i.initialUnits || 1), 0);
      const inStock = items.filter((i) => i.stock > 0 && i.status !== "Agotado");
      const stockCount = inStock.reduce((a, i) => a + (i.stock || 0), 0);
      const negotiation = items.filter((i) => i.status === "En Negociación");
      const reserved = items.filter((i) => i.status === "Apartado");
      const projectedRemaining = inStock.reduce((a, i) => a + (i.targetPrice || 80000) * (i.stock || 0), 0);

      const recoveredPercent = def.investment > 0 ? Math.min(100, Math.round((totalSoldRevenue / def.investment) * 100)) : 0;

      metrics[key] = {
        ...def,
        items,
        sold,
        soldCount: sold.length,
        soldUnits: sold.reduce((a, i) => a + (i.initialUnits || 1), 0),
        totalSoldRevenue,
        inStock,
        stockCount,
        negotiation,
        negotiationCount: negotiation.length,
        reserved,
        reservedCount: reserved.length,
        projectedRemaining,
        recoveredPercent,
        netProfit: totalSoldRevenue - def.investment + projectedRemaining - def.pendingRecovery,
      };
    });
    return metrics;
  }, [lotGroups]);

  // Filter watches
  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const lotKey = item.lot || (item.category === "rolex" ? "rolex-scale" : "invicta-core");
      const matchLot = activeLot === "all" || lotKey === activeLot;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && item.stock > 0 && item.status !== "Apartado") ||
        (statusFilter === "reserved" && item.status === "Apartado") ||
        (statusFilter === "sold" && (item.stock === 0 || item.status === "Agotado"));
      const q = searchTerm.toLowerCase();
      const matchSearch =
        q === "" ||
        item.model.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        (item.sku && item.sku.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))) ||
        (item.reservation?.clientName && item.reservation.clientName.toLowerCase().includes(q));
      return matchLot && matchStatus && matchSearch;
    });
  }, [inventory, activeLot, statusFilter, searchTerm]);

  // Split filtered by lot for rendering
  const filteredByLot = useMemo(() => {
    const groups = {};
    filtered.forEach((item) => {
      const lotKey = item.lot || (item.category === "rolex" ? "rolex-scale" : "invicta-core");
      if (!groups[lotKey]) groups[lotKey] = [];
      groups[lotKey].push(item);
    });
    return groups;
  }, [filtered]);

  const handleCopyCard = (item) => {
    copyWhatsAppCard(item, formatCOP);
    setCopiedSku(item.sku || item.id);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const totalAllStock = inventory.reduce((a, i) => a + (i.stock > 0 && i.status !== "Apartado" ? i.stock : 0), 0);
  const totalReserved = inventory.filter((i) => i.status === "Apartado").length;
  const totalSold = inventory.filter((i) => i.status === "Agotado" || i.stock === 0).length;

  return (
    <div className="page-layout inventory-page-v2">
      {/* ═══════════════ LOT TAB SELECTOR ═══════════════ */}
      <div className="inv-lot-tabs" style={{
        display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap",
      }}>
        <button
          className={`inv-lot-tab ${activeLot === "all" ? "inv-lot-tab-active" : ""}`}
          onClick={() => setActiveLot("all")}
          style={{
            padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: 600,
            fontSize: "0.85rem", transition: "all 0.2s ease",
            background: activeLot === "all" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
            border: activeLot === "all" ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
            color: activeLot === "all" ? "#ffffff" : "#94a3b8",
          }}
        >
          <Layers size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Todos los Lotes ({inventory.length} piezas)
        </button>

        {Object.entries(LOT_DEFS).map(([key, def]) => {
          const Icon = def.icon;
          const m = lotMetrics[key];
          return (
            <button
              key={key}
              className={`inv-lot-tab ${activeLot === key ? "inv-lot-tab-active" : ""}`}
              onClick={() => setActiveLot(key)}
              style={{
                padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: 600,
                fontSize: "0.85rem", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "8px",
                background: activeLot === key ? `${def.color}18` : "rgba(255,255,255,0.03)",
                border: activeLot === key ? `1px solid ${def.color}60` : "1px solid rgba(255,255,255,0.06)",
                color: activeLot === key ? def.color : "#94a3b8",
              }}
            >
              <Icon size={14} />
              <span>{def.label}</span>
              <span style={{
                fontSize: "0.72rem", padding: "2px 8px", borderRadius: "6px",
                background: `${def.color}20`, color: def.color,
              }}>
                {m?.stockCount || 0} disp
              </span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════ LOT THERMOMETER CARDS ═══════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "14px", marginBottom: "18px" }}>
        {Object.entries(LOT_DEFS).map(([key, def]) => {
          const m = lotMetrics[key];
          if (!m) return null;
          if (activeLot !== "all" && activeLot !== key) return null;
          const Icon = def.icon;
          return (
            <div key={key} className="dash-panel" style={{
              border: `1px solid ${def.color}35`, padding: "18px 20px", borderRadius: "14px",
              background: `linear-gradient(135deg, ${def.color}08, transparent)`,
            }}>
              <div className="flex-between items-center" style={{ marginBottom: "12px" }}>
                <div className="flex-row items-center gap-2">
                  <Icon size={18} style={{ color: def.color }} />
                  <strong style={{ color: "#fff", fontSize: "0.95rem" }}>{def.label}</strong>
                  <span className={`badge ${def.badgeClass}`} style={{ fontSize: "0.7rem" }}>
                    {def.totalUnits} Unidades • {formatCOP(def.investment)} Inversión
                  </span>
                </div>
              </div>

              {/* Thermometer */}
              <div style={{ marginBottom: "10px" }}>
                <div className="flex-between text-xs" style={{ marginBottom: "4px", color: "#94a3b8" }}>
                  <span>Capital Recuperado del Lote:</span>
                  <strong className="mono-num" style={{ color: def.color }}>{m.recoveredPercent}%</strong>
                </div>
                <div style={{ height: "8px", borderRadius: "6px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${m.recoveredPercent}%`, borderRadius: "6px",
                    background: `linear-gradient(90deg, ${def.color}, ${def.color}cc)`,
                    boxShadow: `0 0 10px ${def.color}50`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", fontSize: "0.75rem" }}>
                <div>
                  <span style={{ color: "#64748b", display: "block" }}>Vendidos</span>
                  <strong className="mono-num text-emerald">{m.soldUnits} uds</strong>
                  <span style={{ color: "#475569", display: "block" }}>{formatCOP(m.totalSoldRevenue)}</span>
                </div>
                <div>
                  <span style={{ color: "#64748b", display: "block" }}>En Stock</span>
                  <strong className="mono-num" style={{ color: def.color }}>{m.stockCount} uds</strong>
                  <span style={{ color: "#475569", display: "block" }}>{formatCOP(m.projectedRemaining)}</span>
                </div>
                <div>
                  <span style={{ color: "#64748b", display: "block" }}>Negociación</span>
                  <strong className="mono-num text-amber">{m.negotiationCount} uds</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b", display: "block" }}>Faltante $0</span>
                  <strong className="mono-num text-rose">-{formatCOP(def.pendingRecovery)}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════ SEARCH & FILTERS ═══════════════ */}
      <div className="inv-controls-panel dash-panel">
        <div className="icp-top-row">
          <div className="icp-stats">
            <div className="icp-stat-box">
              <span className="icp-stat-label">Stock Disponible</span>
              <span className="icp-stat-val text-emerald mono-num">{totalAllStock} unidades</span>
            </div>
            <div className="icp-stat-div" />
            <div className="icp-stat-box">
              <span className="icp-stat-label">Apartados</span>
              <span className="icp-stat-val text-amber mono-num">{totalReserved} piezas</span>
            </div>
            <div className="icp-stat-div" />
            <div className="icp-stat-box">
              <span className="icp-stat-label">Vendidos</span>
              <span className="icp-stat-val text-indigo mono-num">{totalSold} vendidos</span>
            </div>
            <div className="icp-stat-div" />
            <div className="icp-stat-box">
              <span className="icp-stat-label">Catálogo Total</span>
              <span className="icp-stat-val text-main mono-num">{inventory.length} piezas</span>
            </div>
          </div>

          <div className="icp-search-wrap">
            <Search size={16} className="text-dim" />
            <input
              type="text"
              placeholder="Buscar por SKU, modelo, color, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="icp-search-input"
            />
          </div>
        </div>

        <div className="icp-filter-row">
          <div className="icp-group">
            <span className="icp-group-title">Estado:</span>
            {[
              { key: "all", label: "Todos" },
              { key: "available", label: `Disponibles (${totalAllStock})` },
              { key: "reserved", label: `Apartados (${totalReserved})` },
              { key: "sold", label: "Vendidos" },
            ].map((f) => (
              <button
                key={f.key}
                className={`filter-chip ${statusFilter === f.key ? "chip-active" : ""}`}
                onClick={() => setStatusFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ WATCHES BY LOT ═══════════════ */}
      {Object.entries(LOT_DEFS).map(([lotKey, lotDef]) => {
        const lotItems = filteredByLot[lotKey];
        if (!lotItems || lotItems.length === 0) return null;
        if (activeLot !== "all" && activeLot !== lotKey) return null;

        const Icon = lotDef.icon;
        return (
          <div key={lotKey} style={{ marginBottom: "24px" }}>
            {/* Lot Section Header */}
            <div className="flex-row items-center gap-2" style={{ marginBottom: "12px", paddingLeft: "4px" }}>
              <Icon size={18} style={{ color: lotDef.color }} />
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>
                {lotDef.label}
              </h3>
              <span style={{
                fontSize: "0.72rem", padding: "3px 10px", borderRadius: "6px",
                background: `${lotDef.color}15`, color: lotDef.color, border: `1px solid ${lotDef.color}30`,
              }}>
                {lotDef.totalUnits} Unidades • Costo {formatCOP(lotDef.costPerUnit)} c/u
              </span>
            </div>

            {/* Watch Cards Grid */}
            <div className="watches-grid-v2">
              {lotItems.map((item) => {
                const isReserved = item.status === "Apartado";
                const avail = !isReserved && item.stock > 0 && item.status !== "Agotado";
                const isSold = item.status === "Agotado" || (!avail && !isReserved && item.stock === 0);
                const isRolex = item.category === "rolex";
                const unitCost = item.unitCost || (isRolex ? 33333 : 32500);
                const salePrice = item.soldPrice || item.targetPrice || 80000;
                const unitProfit = salePrice - unitCost;

                return (
                  <div
                    key={item.id}
                    className={`watch-card-v2 ${isReserved ? "wcv2-reserved" : avail ? "wcv2-available" : "wcv2-sold"} ${isRolex ? "wcv2-rolex" : "wcv2-invicta"}`}
                  >
                    {/* ── SKU & Brand Header ── */}
                    <div className={`wcv2-brand-banner ${isRolex ? "banner-rolex" : "banner-invicta"}`}>
                      <div className="wcv2-brand-identity">
                        <div className={`wcv2-brand-icon-box ${isRolex ? "icon-box-rolex" : "icon-box-invicta"}`}>
                          {isRolex ? <Crown size={18} /> : <Zap size={18} />}
                        </div>
                        <div>
                          <span style={{ fontSize: "0.65rem", color: "#94a3b8", letterSpacing: "1px", fontWeight: 600 }}>
                            {item.sku || item.id.toUpperCase()}
                          </span>
                          <h4 className={`wcv2-brand-name ${isRolex ? "text-indigo" : "text-emerald"}`} style={{ margin: 0 }}>
                            {isRolex ? "ROLEX" : "INVICTA"}
                          </h4>
                        </div>
                      </div>

                      <span className={`wcv2-stock-badge ${
                        isReserved ? "stock-reserved"
                          : item.status === "En Negociación" ? "stock-negotiation"
                          : avail ? (item.stock === 1 ? "stock-single" : "stock-multi")
                          : "stock-sold"
                      }`}>
                        {isReserved ? "🔒 Apartado"
                          : item.status === "En Negociación" ? "🤝 Negociación"
                          : avail ? `${item.stock} en stock`
                          : "✓ Vendido"}
                      </span>
                    </div>

                    {/* ── Body ── */}
                    <div className="wcv2-body">
                      <div className="wcv2-header">
                        <span className="wcv2-subseries">{item.brand}</span>
                        <h3 className="wcv2-title">{item.model}</h3>
                      </div>

                      {/* Tags / Characteristics Pills */}
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", margin: "8px 0" }}>
                          {item.tags.map((tag, idx) => (
                            <span key={idx} style={{
                              padding: "2px 8px", borderRadius: "6px", fontSize: "0.68rem", fontWeight: 600,
                              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                              color: "#cbd5e1",
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Pricing & Margin Strip */}
                      <div className="wcv2-pricing-strip">
                        <div className="wcv2-price-col">
                          <span className="wcv2-price-label">Costo Mayorista:</span>
                          <span className="wcv2-price-ref mono-num">{formatCOP(unitCost)}</span>
                        </div>

                        {isSold && item.soldPrice ? (
                          <div className="wcv2-price-col text-right">
                            <span className="wcv2-price-label">Vendido por:</span>
                            <span className="wcv2-price-sold text-emerald mono-num">
                              {formatCOP(item.soldPrice)}
                            </span>
                          </div>
                        ) : (
                          <div className="wcv2-price-col text-right">
                            <span className="wcv2-price-label">PVP Krono:</span>
                            <span className="wcv2-price-target mono-num" style={{ color: isRolex ? "#818cf8" : "#10b981" }}>
                              {formatCOP(item.targetPrice || 80000)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Margin indicator */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "6px 10px", borderRadius: "8px", fontSize: "0.72rem",
                        background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.15)",
                        marginTop: "6px",
                      }}>
                        <span style={{ color: "#94a3b8" }}>
                          <TrendingUp size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                          Ganancia por unidad:
                        </span>
                        <strong className="mono-num text-emerald">+{formatCOP(unitProfit)}</strong>
                      </div>

                      {/* Sale Details (for sold watches) */}
                      {isSold && (item.soldBy || item.soldDate || item.payMethod) && (
                        <div style={{
                          marginTop: "8px", padding: "8px 10px", borderRadius: "8px",
                          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                          fontSize: "0.72rem", display: "flex", flexWrap: "wrap", gap: "10px",
                        }}>
                          {item.soldBy && (
                            <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                              <User size={11} />
                              Vendió: <strong style={{ color: item.soldBy === "elian" ? "#34d399" : "#a5b4fc" }}>
                                {item.soldBy === "elian" ? "Elian" : "Juan"}
                              </strong>
                            </span>
                          )}
                          {item.soldDate && (
                            <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Calendar size={11} />
                              {item.soldDate}
                            </span>
                          )}
                          {item.payMethod && (
                            <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                              <CreditCard size={11} />
                              {item.payMethod}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Custody badge (for available watches) */}
                      {avail && item.custody && (
                        <div style={{
                          marginTop: "6px", display: "flex", alignItems: "center", gap: "6px",
                          fontSize: "0.72rem", color: "#94a3b8",
                        }}>
                          <MapPin size={12} style={{ color: item.custody === "elian" ? "#10b981" : "#818cf8" }} />
                          <span>Custodia:</span>
                          <strong style={{ color: item.custody === "elian" ? "#34d399" : "#a5b4fc" }}>
                            {item.custody === "elian" ? "📍 Elian (Bodega)" : "📍 Juan (Vitrina)"}
                          </strong>
                        </div>
                      )}

                      {/* Reservation info */}
                      {isReserved && item.reservation && (
                        <div className="wcv2-reserved-info-box">
                          <div className="wrib-header">
                            <BookmarkCheck size={14} className="text-amber" />
                            <strong>Apartado: {item.reservation.clientName}</strong>
                          </div>
                          <div className="wrib-grid">
                            <div className="wrib-item">
                              <span>Anticipo:</span>
                              <strong className="text-emerald mono-num">+{formatCOP(item.reservation.depositAmount)}</strong>
                            </div>
                            <div className="wrib-item">
                              <span>Saldo:</span>
                              <strong className="text-amber mono-num">{formatCOP(item.reservation.remainingBalance)}</strong>
                            </div>
                            {item.reservation.dueDate && (
                              <div className="wrib-item full-w">
                                <span>Cobro:</span>
                                <strong className="mono-num text-main">{item.reservation.dueDate}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {item.highlight && !isReserved && !isSold && (
                        <p className="wcv2-highlight">
                          <ShieldCheck size={13} style={{ color: isRolex ? "#818cf8" : "#10b981" }} />
                          <span>{item.highlight}</span>
                        </p>
                      )}

                      {/* ── Footer Actions ── */}
                      <div className="wcv2-footer">
                        {isReserved ? (
                          <div className="wcv2-reserve-actions">
                            <button className="btn-sm btn-emerald" style={{ flex: 1.6 }} onClick={() => onCompleteReservation(item.id)}>
                              <CheckCircle2 size={14} /> <span>Completar Venta</span>
                            </button>
                            <button className="btn-sm btn-outline-rose" onClick={() => onCancelReservation(item.id)}>
                              <RotateCcw size={14} /> <span>Cancelar</span>
                            </button>
                          </div>
                        ) : avail ? (
                          <div className="wcv2-actions-duo">
                            <button
                              className={`wcv2-action-btn ${isRolex ? "btn-rolex-action" : "btn-invicta-action"}`}
                              style={{ flex: 1.3 }}
                              onClick={() => onSellWatch(item)}
                            >
                              <ShoppingBag size={14} /> <span>Venta</span>
                            </button>
                            <button className="wcv2-action-btn btn-reserve-action" onClick={() => onOpenReserve(item)}>
                              <BookmarkCheck size={14} /> <span>Apartar</span>
                            </button>
                            <button
                              className="wcv2-action-btn"
                              onClick={() => handleCopyCard(item)}
                              title="Copiar ficha para WhatsApp"
                              style={{
                                background: copiedSku === (item.sku || item.id) ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
                                border: copiedSku === (item.sku || item.id) ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.1)",
                                color: copiedSku === (item.sku || item.id) ? "#34d399" : "#94a3b8",
                                minWidth: "38px", padding: "6px",
                              }}
                            >
                              {copiedSku === (item.sku || item.id) ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        ) : (
                          <div className="wcv2-sold-banner">
                            <CheckCircle2 size={15} className="text-emerald" />
                            <span>Venta Concretada</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="empty-state-panel dash-panel">
          <Package size={48} className="text-dim" />
          <h3 className="empty-title">No se encontraron relojes con estos filtros</h3>
          <p className="empty-desc">Prueba cambiando el lote, estado o término de búsqueda.</p>
          <button
            className="btn-sm btn-indigo mt-2"
            onClick={() => { setActiveLot("all"); setStatusFilter("all"); setSearchTerm(""); }}
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
