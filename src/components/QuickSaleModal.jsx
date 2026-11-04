import React, { useState, useEffect } from "react";
import {
  X,
  ShoppingBag,
  CheckCircle2,
  Crown,
  Zap,
  User,
  CreditCard,
  DollarSign,
  Phone,
  Copy,
  TrendingUp,
  MapPin,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export function QuickSaleModal({
  isOpen,
  onClose,
  watch,
  onConfirmSale,
  formatCOP,
  activeUser,
}) {
  const [soldBy, setSoldBy] = useState("elian");
  const [soldPrice, setSoldPrice] = useState(80000);
  const [customPrice, setCustomPrice] = useState("80000");
  const [payMethod, setPayMethod] = useState("Efectivo");
  const [custody, setCustody] = useState("juan");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  useEffect(() => {
    if (watch) {
      const defaultPrice = watch.targetPrice || 80000;
      setSoldPrice(defaultPrice);
      setCustomPrice(String(defaultPrice));
      setSoldBy(activeUser?.id === "juan" ? "juan" : "elian");
      setCustody(watch.custody || (activeUser?.id === "juan" ? "juan" : "elian"));
      setPayMethod("Efectivo");
      setClientName("");
      setClientPhone("");
      setNotes("");
      setIsSuccess(false);
      setCopiedReceipt(false);
    }
  }, [watch, activeUser, isOpen]);

  if (!isOpen || !watch) return null;

  const isRolex = watch.category === "rolex";
  const unitCost = watch.unitCost || (isRolex ? 33333 : 32500);
  const currentPrice = Number(customPrice) || soldPrice || 80000;
  const unitProfit = currentPrice - unitCost;
  const profit50 = Math.round(unitProfit / 2);

  const QUICK_PRICES = [75000, 80000, 85000, 90000];
  const PAY_METHODS = [
    { id: "Efectivo", label: "💵 Efectivo" },
    { id: "Nequi", label: "📱 Nequi" },
    { id: "Bancolombia", label: "🏦 Bancolombia" },
    { id: "Daviplata", label: "💳 Daviplata" },
  ];

  const handlePriceSelect = (p) => {
    setSoldPrice(p);
    setCustomPrice(String(p));
  };

  const handleCustomPriceChange = (val) => {
    const raw = val.replace(/[^0-9]/g, "");
    setCustomPrice(raw);
    setSoldPrice(Number(raw) || 0);
  };

  const handleGenerateReceiptText = () => {
    const sellerName = soldBy === "elian" ? "Elian Navarro" : "Juan";
    return [
      `👑 *KRONO TIMEPIECES — COMPROBANTE DE COMPRA*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⌚ *Modelo:* ${watch.model}`,
      `🏷️ *SKU:* ${watch.sku || watch.id.toUpperCase()}`,
      `💎 *Categoría:* ${watch.brand || (isRolex ? "Rolex" : "Invicta")}`,
      `💰 *Valor Pagado:* ${formatCOP(currentPrice)} COP`,
      `💳 *Método de Pago:* ${payMethod}`,
      `👤 *Asesor KRONO:* ${sellerName}`,
      clientName ? `🤝 *Cliente:* ${clientName}` : "",
      `📅 *Fecha de Entrega:* ${new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}`,
      ``,
      `🛡️ *GARANTÍA OFICIAL KRONO:*`,
      `• 30 días de cobertura en maquinaria.`,
      `• Pieza inspeccionada y entregada con paño de microfibra.`,
      `• Soporte directo con tu asesor: ${sellerName}.`,
      ``,
      `✨ *¡Gracias por elegir KRONO Timepieces!*`,
    ].filter(Boolean).join("\n");
  };

  const handleCopyReceipt = () => {
    const text = handleGenerateReceiptText();
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPrice || currentPrice <= 0) {
      alert("Por favor ingresa un precio de venta válido.");
      return;
    }

    onConfirmSale({
      watchId: watch.id,
      soldBy,
      soldPrice: currentPrice,
      payMethod,
      custody,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      notes: notes.trim(),
      date: new Date().toISOString().split("T")[0],
    });

    setIsSuccess(true);
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-card" style={{ maxWidth: 540, width: "95%" }}>
        {/* Header */}
        <div className="modal-header" style={{ paddingBottom: 12 }}>
          <div className="flex-row items-center gap-2">
            <div style={{
              width: 38, height: 38, borderRadius: 10, display: "flex",
              alignItems: "center", justifyContent: "center",
              background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#10b981",
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: "1.1rem" }}>Descargo Oficial de Venta</h3>
              <p className="modal-subtitle text-dim" style={{ fontSize: "0.78rem" }}>
                Registra la salida física, ingreso a caja y genera el recibo de garantía
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            {/* Watch preview */}
            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: `1px solid ${isRolex ? "rgba(99, 102, 241, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
              borderRadius: 12, padding: "12px 14px", marginBottom: 16,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: isRolex ? "rgba(99, 102, 241, 0.15)" : "rgba(16, 185, 129, 0.15)",
                  color: isRolex ? "#818cf8" : "#10b981",
                }}>
                  {isRolex ? <Crown size={18} /> : <Zap size={18} />}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700, letterSpacing: 0.5 }}>
                      {watch.sku || watch.id.toUpperCase()}
                    </span>
                    <span className={`badge ${isRolex ? "badge-indigo" : "badge-emerald"}`} style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                      {watch.brand || (isRolex ? "Rolex" : "Invicta")}
                    </span>
                  </div>
                  <h4 style={{ margin: "2px 0 0", fontSize: "0.9rem", color: "#fff", fontWeight: 600 }}>
                    {watch.model}
                  </h4>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.68rem", color: "#64748b", display: "block" }}>Costo Mayorista:</span>
                <span className="mono-num" style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{formatCOP(unitCost)}</span>
              </div>
            </div>

            {/* 1. ¿Quién vendió? */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: "0.78rem", color: "#cbd5e1", fontWeight: 600, display: "block", marginBottom: 6 }}>
                1. ¿Quién cerró la venta?
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setSoldBy("elian")}
                  style={{
                    padding: "10px", borderRadius: 10, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10,
                    background: soldBy === "elian" ? "rgba(16, 185, 129, 0.18)" : "rgba(255, 255, 255, 0.03)",
                    border: soldBy === "elian" ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.08)",
                    color: soldBy === "elian" ? "#34d399" : "#94a3b8",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem",
                  }}>
                    EN
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <strong style={{ display: "block", fontSize: "0.82rem", color: soldBy === "elian" ? "#fff" : "#cbd5e1" }}>
                      Elian Navarro
                    </strong>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Cofundador</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSoldBy("juan")}
                  style={{
                    padding: "10px", borderRadius: 10, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10,
                    background: soldBy === "juan" ? "rgba(99, 102, 241, 0.18)" : "rgba(255, 255, 255, 0.03)",
                    border: soldBy === "juan" ? "1px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.08)",
                    color: soldBy === "juan" ? "#a5b4fc" : "#94a3b8",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", background: "rgba(99, 102, 241, 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem",
                  }}>
                    JS
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <strong style={{ display: "block", fontSize: "0.82rem", color: soldBy === "juan" ? "#fff" : "#cbd5e1" }}>
                      Juan
                    </strong>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Cofundador</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Precio Final de Venta */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: "0.78rem", color: "#cbd5e1", fontWeight: 600 }}>
                  2. Precio Final Acordado
                </label>
                <span className="mono-num text-emerald" style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                  Ganancia: +{formatCOP(unitProfit)}
                </span>
              </div>

              {/* Quick price chips */}
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {QUICK_PRICES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePriceSelect(p)}
                    className="filter-chip"
                    style={{
                      flex: 1, padding: "6px 0", fontSize: "0.75rem", textAlign: "center",
                      background: soldPrice === p ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.03)",
                      borderColor: soldPrice === p ? "#10b981" : "rgba(255, 255, 255, 0.08)",
                      color: soldPrice === p ? "#34d399" : "#94a3b8",
                      fontWeight: soldPrice === p ? 700 : 500,
                    }}
                  >
                    {formatCOP(p)}
                  </button>
                ))}
              </div>

              {/* Custom price input */}
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: "0.85rem" }}>
                  $ COP
                </span>
                <input
                  type="text"
                  value={customPrice}
                  onChange={(e) => handleCustomPriceChange(e.target.value)}
                  className="search-input"
                  style={{
                    width: "100%", paddingLeft: 60, fontSize: "0.95rem", fontWeight: 700,
                    color: "#fff", background: "rgba(0,0,0,0.3)",
                  }}
                  placeholder="Precio personalizado..."
                />
              </div>
            </div>

            {/* 3. Método de Pago */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: "0.78rem", color: "#cbd5e1", fontWeight: 600, display: "block", marginBottom: 6 }}>
                3. Método de Pago del Cliente
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {PAY_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    style={{
                      padding: "8px 4px", borderRadius: 8, cursor: "pointer", fontSize: "0.72rem",
                      background: payMethod === m.id ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.03)",
                      border: payMethod === m.id ? "1px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.06)",
                      color: payMethod === m.id ? "#fff" : "#94a3b8",
                      fontWeight: payMethod === m.id ? 700 : 500,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Custodia del Dinero y Datos de Cliente */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: 4 }}>
                  ¿Quién custodia el dinero?
                </label>
                <select
                  value={custody}
                  onChange={(e) => setCustody(e.target.value)}
                  className="filter-sel"
                  style={{ width: "100%", fontSize: "0.78rem" }}
                >
                  <option value="elian">📍 Elian (Caja)</option>
                  <option value="juan">📍 Juan (Caja)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: 4 }}>
                  Nombre del Cliente (Opcional)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Carlos Gómez"
                  className="search-input"
                  style={{ width: "100%", fontSize: "0.78rem", padding: "8px 10px" }}
                />
              </div>
            </div>

            {/* Profit breakdown banner */}
            <div style={{
              background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}>
                  Margen Bruto de la Pieza:
                </span>
                <strong className="mono-num text-emerald" style={{ fontSize: "0.95rem" }}>
                  +{formatCOP(unitProfit)} COP
                </strong>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.72rem", color: "#cbd5e1" }}>
                <span>Re-inversión (50%): <strong>{formatCOP(profit50)}</strong></span>
                <br />
                <span>Reparto Socios (50%): <strong>{formatCOP(profit50)}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-sm btn-outline"
                style={{ flex: 1, padding: "10px" }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-sm btn-emerald"
                style={{ flex: 2, padding: "10px", fontWeight: 700, fontSize: "0.85rem" }}
              >
                <CheckCircle2 size={16} />
                <span>Confirmar Descargo de Venta</span>
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS SCREEN WITH WHATSAPP RECEIPT */
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 12px", color: "#10b981",
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              ¡Venta Registrada Exitosamente!
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: 16 }}>
              Se descontó la pieza del inventario y se registró el ingreso de <strong>{formatCOP(currentPrice)}</strong> en Flujo de Caja.
            </p>

            {/* Preview receipt card */}
            <div style={{
              background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 12, padding: "14px", textAlign: "left", fontSize: "0.78rem",
              fontFamily: "monospace", color: "#cbd5e1", lineHeight: 1.5, marginBottom: 16,
              maxHeight: 180, overflowY: "auto", whiteSpace: "pre-wrap",
            }}>
              {handleGenerateReceiptText()}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="btn-sm btn-emerald"
                style={{ width: "100%", padding: "11px", fontWeight: 700, fontSize: "0.85rem" }}
              >
                {copiedReceipt ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                <span>{copiedReceipt ? "✓ ¡Recibo Copiado al Portapapeles!" : "📲 Copiar Recibo de Garantía para WhatsApp"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn-sm btn-outline"
                style={{ width: "100%", padding: "9px" }}
              >
                Cerrar y Ver Inventario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickSaleModal;
