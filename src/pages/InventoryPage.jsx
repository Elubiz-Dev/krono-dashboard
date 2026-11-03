import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Package,
  Crown,
  Zap,
  Search,
  ShieldCheck,
  BookmarkCheck,
  RotateCcw,
  MapPin,
  User,
  CreditCard,
  Calendar,
  Layers,
  TrendingUp,
  Copy,
  ChevronDown,
  ChevronUp,
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
    colorLight: "#34d399",
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
    colorLight: "#a5b4fc",
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

// ═══════════════════════ LOT ACCORDION COMPONENT ═══════════════════════
function LotAccordion({ lotKey, lotDef, metrics, items, isOpen, onToggle, formatCOP, renderWatchCard }) {
  const Icon = lotDef.icon;
  const m = metrics;

  return (
    <div className="lot-accordion" style={{
      border: `1px solid ${lotDef.color}${isOpen ? "40" : "20"}`,
      borderRadius: "16px",
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      background: isOpen
        ? `linear-gradient(135deg, ${lotDef.color}08, transparent)`
        : "rgba(14, 19, 26, 0.6)",
      marginBottom: "14px",
    }}>
      {/* ── Accordion Header (always visible) ── */}
      <button
        onClick={onToggle}
        className="lot-accordion-header"
        style={{
          width: "100%", cursor: "pointer", padding: "16px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "transparent", border: "none", color: "#fff",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: `${lotDef.color}18`, border: `1px solid ${lotDef.color}35`,
          }}>
            <Icon size={18} style={{ color: lotDef.color }} />
          </div>

          <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <h3 style={{
              margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#fff",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {lotDef.label}
            </h3>
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
              {lotDef.totalUnits} unidades • Inversión {formatCOP(lotDef.investment)}
            </span>
          </div>
        </div>

        {/* ── Mini stats (visible when collapsed) ── */}
        <div className="lot-accordion-mini-stats" style={{
          display: "flex", alignItems: "center", gap: "12px",
          opacity: isOpen ? 0 : 1,
          maxWidth: isOpen ? "0px" : "500px",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}>
          <div className="lot-mini-stat">
            <span className="lot-mini-stat-dot" style={{ background: "#10b981" }} />
            <span className="lot-mini-stat-val mono-num">{m?.soldUnits || 0}</span>
            <span className="lot-mini-stat-label">vendidos</span>
          </div>
          <div className="lot-mini-stat">
            <span className="lot-mini-stat-dot" style={{ background: lotDef.color }} />
            <span className="lot-mini-stat-val mono-num">{m?.stockCount || 0}</span>
            <span className="lot-mini-stat-label">stock</span>
          </div>
          <div className="lot-mini-stat">
            <span className="lot-mini-stat-dot" style={{ background: "#f59e0b" }} />
            <span className="lot-mini-stat-val mono-num">{m?.negotiationCount || 0}</span>
            <span className="lot-mini-stat-label">negoc.</span>
          </div>

          {/* Mini thermometer */}
          <div style={{ width: "60px", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              flex: 1, height: "5px", borderRadius: "4px", background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${m?.recoveredPercent || 0}%`,
                background: lotDef.color, borderRadius: "4px",
              }} />
            </div>
            <span style={{ fontSize: "0.65rem", color: lotDef.color, fontWeight: 600 }} className="mono-num">
              {m?.recoveredPercent || 0}%
            </span>
          </div>
        </div>

        <div style={{
          width: "32px", height: "32px", borderRadius: "8px", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "10px",
          background: isOpen ? `${lotDef.color}15` : "rgba(255,255,255,0.04)",
          transition: "all 0.2s ease",
        }}>
          {isOpen
            ? <ChevronUp size={16} style={{ color: lotDef.color }} />
            : <ChevronDown size={16} style={{ color: "#94a3b8" }} />
          }
        </div>
      </button>

      {/* ── Accordion Content (expandable) ── */}
      <div className={`lot-accordion-content ${isOpen ? "lot-accordion-open" : ""}`}>
        {isOpen && (
          <div style={{ padding: "0 20px 20px" }}>
            {/* Thermometer */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.78rem", color: "#94a3b8" }}>
                <span>Capital Recuperado del Lote:</span>
                <strong className="mono-num" style={{ color: lotDef.color }}>{m.recoveredPercent}%</strong>
              </div>
              <div style={{
                height: "10px", borderRadius: "6px", background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${m.recoveredPercent}%`, borderRadius: "6px",
                  background: `linear-gradient(90deg, ${lotDef.color}, ${lotDef.color}cc)`,
                  boxShadow: `0 0 12px ${lotDef.color}50`,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>

            {/* Stats grid */}
            <div className="lot-stats-grid">
              <div className="lot-stat-card">
                <span className="lot-stat-icon" style={{ color: "#10b981" }}>
                  <CheckCircle2 size={14} />
                </span>
                <div>
                  <span className="lot-stat-value mono-num text-emerald">{m.soldUnits} uds</span>
                  <span className="lot-stat-subtitle mono-num">{formatCOP(m.totalSoldRevenue)}</span>
                  <span className="lot-stat-label">Vendidos</span>
                </div>
              </div>
              <div className="lot-stat-card">
                <span className="lot-stat-icon" style={{ color: lotDef.color }}>
                  <Package size={14} />
                </span>
                <div>
                  <span className="lot-stat-value mono-num" style={{ color: lotDef.color }}>{m.stockCount} uds</span>
                  <span className="lot-stat-subtitle mono-num">{formatCOP(m.projectedRemaining)}</span>
                  <span className="lot-stat-label">En Stock</span>
                </div>
              </div>
              <div className="lot-stat-card">
                <span className="lot-stat-icon" style={{ color: "#f59e0b" }}>
                  <TrendingUp size={14} />
                </span>
                <div>
                  <span className="lot-stat-value mono-num text-amber">{m.negotiationCount} uds</span>
                  <span className="lot-stat-label">Negociación</span>
                </div>
              </div>
              <div className="lot-stat-card">
                <span className="lot-stat-icon" style={{ color: "#f43f5e" }}>
                  <CreditCard size={14} />
                </span>
                <div>
                  <span className="lot-stat-value mono-num text-rose">-{formatCOP(lotDef.pendingRecovery)}</span>
                  <span className="lot-stat-label">Pendiente</span>
                </div>
              </div>
            </div>

            {/* Watch Cards Grid */}
            <div className="watches-grid-v2" style={{ marginTop: "16px" }}>
              {items.map((item) => renderWatchCard(item))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════ MAIN INVENTORY PAGE ═══════════════════════
export function InventoryPage({
  inventory,
  onSellWatch,
  onOpenReserve,
  onCompleteReservation,
  onCancelReservation,
  formatCOP,
  isEditMode,
}) {
  const [activeLot, setActiveLot] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedSku, setCopiedSku] = useState(null);
  const [openLots, setOpenLots] = useState({ "invicta-core": true, "rolex-scale": true });

  const toggleLot = (lotKey) => {
    setOpenLots(prev => ({ ...prev, [lotKey]: !prev[lotKey] }));
  };

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

  // Split filtered by lot
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

  // ─── Render a single watch card ───
  const renderWatchCard = (item) => {
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

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="wcv2-tags-row">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="wcv2-tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Pricing */}
          <div className="wcv2-pricing-strip">
            <div className="wcv2-price-col">
              <span className="wcv2-price-label">Costo Mayorista:</span>
              <span className="wcv2-price-ref mono-num">{formatCOP(unitCost)}</span>
            </div>
            {isSold && item.soldPrice ? (
              <div className="wcv2-price-col text-right">
                <span className="wcv2-price-label">Vendido por:</span>
                <span className="wcv2-price-sold text-emerald mono-num">{formatCOP(item.soldPrice)}</span>
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

          {/* Margin */}
          <div className="wcv2-margin-strip">
            <span style={{ color: "#94a3b8" }}>
              <TrendingUp size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
              Ganancia por unidad:
            </span>
            <strong className="mono-num text-emerald">+{formatCOP(unitProfit)}</strong>
          </div>

          {/* Sale Details */}
          {isSold && (item.soldBy || item.soldDate || item.payMethod) && (
            <div className="wcv2-sale-details">
              {item.soldBy && (
                <span className="wcv2-detail-item">
                  <User size={11} />
                  Vendió: <strong style={{ color: item.soldBy === "elian" ? "#34d399" : "#a5b4fc" }}>
                    {item.soldBy === "elian" ? "Elian" : "Juan"}
                  </strong>
                </span>
              )}
              {item.soldDate && (
                <span className="wcv2-detail-item">
                  <Calendar size={11} />
                  {item.soldDate}
                </span>
              )}
              {item.payMethod && (
                <span className="wcv2-detail-item">
                  <CreditCard size={11} />
                  {item.payMethod}
                </span>
              )}
            </div>
          )}

          {/* Custody */}
          {avail && item.custody && (
            <div className="wcv2-custody-badge">
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
  };

  return (
    <div className="page-layout inventory-page-v2">
      {/* ═══════════════ STICKY SEARCH & FILTERS ═══════════════ */}
      <div className="inv-controls-panel dash-panel inv-controls-sticky">
        <div className="icp-top-row">
          <div className="icp-stats">
            <div className="icp-stat-box">
              <span className="icp-stat-label">Stock</span>
              <span className="icp-stat-val text-emerald mono-num">{totalAllStock}</span>
            </div>
            <div className="icp-stat-div" />
            <div className="icp-stat-box">
              <span className="icp-stat-label">Apartados</span>
              <span className="icp-stat-val text-amber mono-num">{totalReserved}</span>
            </div>
            <div className="icp-stat-div" />
            <div className="icp-stat-box">
              <span className="icp-stat-label">Vendidos</span>
              <span className="icp-stat-val text-indigo mono-num">{totalSold}</span>
            </div>
            <div className="icp-stat-div" />
            <div className="icp-stat-box">
              <span className="icp-stat-label">Total</span>
              <span className="icp-stat-val text-main mono-num">{inventory.length}</span>
            </div>
          </div>

          <div className="icp-search-wrap">
            <Search size={16} className="text-dim" />
            <input
              type="text"
              placeholder="Buscar SKU, modelo, color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="icp-search-input"
            />
          </div>
        </div>

        <div className="icp-filter-row">
          <div className="icp-group">
            <span className="icp-group-title">Lote:</span>
            {[
              { key: "all", label: "Todos" },
              ...Object.entries(LOT_DEFS).map(([k, d]) => ({ key: k, label: d.shortLabel })),
            ].map((f) => (
              <button
                key={f.key}
                className={`filter-chip ${activeLot === f.key ? "chip-active" : ""}`}
                onClick={() => setActiveLot(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="icp-group">
            <span className="icp-group-title">Estado:</span>
            {[
              { key: "all", label: "Todos" },
              { key: "available", label: "Disponibles" },
              { key: "reserved", label: "Apartados" },
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

      {/* ═══════════════ LOT ACCORDIONS ═══════════════ */}
      {Object.entries(LOT_DEFS).map(([lotKey, lotDef]) => {
        const lotItems = filteredByLot[lotKey];
        if (!lotItems || lotItems.length === 0) return null;
        if (activeLot !== "all" && activeLot !== lotKey) return null;

        return (
          <LotAccordion
            key={lotKey}
            lotKey={lotKey}
            lotDef={lotDef}
            metrics={lotMetrics[lotKey]}
            items={lotItems}
            isOpen={openLots[lotKey] !== false}
            onToggle={() => toggleLot(lotKey)}
            formatCOP={formatCOP}
            renderWatchCard={renderWatchCard}
          />
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
