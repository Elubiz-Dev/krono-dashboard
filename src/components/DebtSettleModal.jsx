import React, { useState } from "react";
import { X, Coins, CheckCircle, Sparkles, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export function DebtSettleModal({
  isOpen,
  onClose,
  remainingDebt = 0,
  onSettleDebt,
  formatCOP,
}) {
  const [amount, setAmount] = useState(() => (remainingDebt > 0 ? String(Math.min(20000, remainingDebt)) : ""));
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("Abono a deuda de lote entregado a Elian");

  if (!isOpen) return null;

  const quickAmounts = [
    { label: "$10.000", val: 10000 },
    { label: "$20.000", val: 20000 },
    { label: "Saldar Todo (" + formatCOP(remainingDebt) + ")", val: remainingDebt },
  ].filter((item) => item.val <= remainingDebt);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!numAmt || numAmt <= 0) {
      alert("Por favor ingresa un monto válido para el abono.");
      return;
    }

    onSettleDebt({
      amount: numAmt,
      date,
      notes: notes || "Abono de Juan a Elian por lote",
    });

    // Multi-shot celebration confetti!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399", "#e5b869", "#f7d788", "#06b6d4"],
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-card" style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <div className="flex-row items-center gap-2">
            <Coins size={22} className="text-emerald-light" />
            <h3 className="modal-title">Registrar Abono de Juan a Elian</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Current Debt Status */}
          <div className="debt-modal-alert">
            <div className="dma-top">
              <span className="text-xs text-muted">Deuda Actual Pendiente de Juan:</span>
              <strong className="mono-num text-rose-primary font-bold">
                {formatCOP(remainingDebt)}
              </strong>
            </div>
            <p className="text-xs text-dim">
              Juan aportó inicialmente $80.000 + $20.000 de abonos ($100.000 de sus $130.000 acordados, restando $30.000).
            </p>
          </div>

          {/* Quick Amount Chips */}
          <div className="form-group">
            <label className="form-label">Montos Rápidos:</label>
            <div className="quick-chips-row">
              {quickAmounts.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAmount(String(q.val))}
                  className={`chip-btn ${Number(amount) === q.val ? "active" : ""}`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Monto del Abono (COP):</label>
              <input
                type="number"
                required
                min="1000"
                max={remainingDebt}
                step="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input mono-num"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Fecha del Abono:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detalle / Notas:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Transferencia Nequi / Efectivo en mano"
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-emerald">
              <CheckCircle size={16} />
              Confirmar Abono
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
