import React, { useState } from "react";
import { X, BookmarkCheck, Calendar, User, Phone, Crown, Zap } from "lucide-react";

export function ReserveWatchModal({
  isOpen,
  onClose,
  watch,
  onConfirmReserve,
  formatCOP,
}) {
  const defaultTotal = watch ? (watch.targetPrice || watch.soldPrice || 85000) : 85000;
  const defaultDeposit = 20000;

  // Next quincena calculation for default date
  const getDefaultDueDate = () => {
    const today = new Date();
    const day = today.getDate();
    const year = today.getFullYear();
    const month = today.getMonth();
    if (day <= 15) {
      return new Date(year, month, 15).toISOString().split("T")[0];
    } else {
      const lastDay = new Date(year, month + 1, 0).getDate();
      return new Date(year, month, lastDay).toISOString().split("T")[0];
    }
  };

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState(String(defaultTotal));
  const [deposit, setDeposit] = useState(String(defaultDeposit));
  const [dueDate, setDueDate] = useState(getDefaultDueDate);
  const [partner, setPartner] = useState("ambos");
  const [notes, setNotes] = useState("");

  if (!isOpen || !watch) return null;

  const numTotal = Number(totalPrice) || 0;
  const numDeposit = Number(deposit) || 0;
  const remaining = Math.max(0, numTotal - numDeposit);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert("Por favor ingresa el nombre del cliente.");
      return;
    }
    if (numDeposit <= 0) {
      alert("El anticipo debe ser mayor a $0 para registrar el apartado.");
      return;
    }
    if (numDeposit > numTotal) {
      alert("El anticipo no puede ser mayor al precio total del reloj.");
      return;
    }

    onConfirmReserve({
      watchId: watch.id,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      totalPrice: numTotal,
      deposit: numDeposit,
      remaining,
      dueDate,
      partner,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-card reserve-modal-card">
        <div className="modal-header">
          <div className="flex-row items-center gap-2">
            <BookmarkCheck size={22} className="text-amber-light" style={{ color: "#f59e0b" }} />
            <div>
              <h3 className="modal-title">Apartar Reloj con Anticipo</h3>
              <p className="modal-subtitle text-dim" style={{ fontSize: "0.8rem", marginTop: 2 }}>
                Bloquea la pieza en inventario y genera la cuenta por cobrar quincenal
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Watch summary card without photo */}
        <div className="reserve-watch-preview">
          <div className="rwp-brand-icon-box" style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: watch.category === "rolex" ? "rgba(229, 184, 105, 0.15)" : "rgba(6, 182, 212, 0.15)",
            border: `1px solid ${watch.category === "rolex" ? "rgba(229, 184, 105, 0.35)" : "rgba(6, 182, 212, 0.35)"}`,
            flexShrink: 0
          }}>
            {watch.category === "rolex" ? <Crown size={22} className="gold-text" /> : <Zap size={22} className="text-cyan" />}
          </div>
          <div className="rwp-info">
            <span className={`badge ${watch.category === "rolex" ? "badge-gold" : "badge-cyan"}`}>
              {watch.category === "rolex" ? "ROLEX" : "INVICTA"}
            </span>
            <h4 className="rwp-title">{watch.model}</h4>
            <p className="rwp-ref">Referencia: {watch.refPrice}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Client info */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">
                <User size={13} style={{ display: "inline", marginRight: 4 }} />
                Nombre del Cliente:
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Ej. Carlos Gómez / Amiga Quincena"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ flex: 1.2 }}>
              <label className="form-label">
                <Phone size={13} style={{ display: "inline", marginRight: 4 }} />
                Teléfono / WhatsApp:
              </label>
              <input
                type="text"
                placeholder="Ej. 310 123 4567"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="form-input mono-num"
              />
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Precio Total Pactado (COP):</label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                className="form-input mono-num"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ color: "#10b981" }}>
                Anticipo Recibido Hoy (+):
              </label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="form-input mono-num"
                style={{ borderColor: "rgba(16, 185, 129, 0.4)" }}
              />
            </div>
          </div>

          {/* Realtime calculation pill */}
          <div className="reserve-calc-box">
            <div className="rcb-item">
              <span>Precio Reloj:</span>
              <strong className="mono-num">{formatCOP(numTotal)}</strong>
            </div>
            <div className="rcb-item">
              <span className="text-emerald">Anticipo Entra a Caja:</span>
              <strong className="mono-num text-emerald">+{formatCOP(numDeposit)}</strong>
            </div>
            <div className="rcb-divider" />
            <div className="rcb-item highlight-box">
              <span className="text-amber">Saldo Pendiente por Cobrar:</span>
              <strong className="mono-num text-amber" style={{ fontSize: "1.1rem" }}>
                {formatCOP(remaining)}
              </strong>
            </div>
          </div>

          {/* Due date & Partner */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">
                <Calendar size={13} style={{ display: "inline", marginRight: 4 }} />
                Fecha Límite / Quincena de Cobro:
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Socio que Gestionó:</label>
              <select
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                className="form-select"
              >
                <option value="ambos">Krono (Ambos Socios)</option>
                <option value="juan">Juan (Ventas)</option>
                <option value="elian">Elian Navarro</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notas Adicionales (Opcional):</label>
            <input
              type="text"
              placeholder="Ej. Entrega personal, incluir bolsa de lujo, pagar el día 15..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary-gold"
              style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "#000", fontWeight: 700 }}
            >
              <BookmarkCheck size={16} />
              Confirmar Apartado y Cobrar Anticipo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReserveWatchModal;
