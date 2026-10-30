import React, { useState } from "react";
import { X, PlusCircle, ShoppingBag, Coins, Wrench, Shield, Check } from "lucide-react";
import confetti from "canvas-confetti";

export function NewTransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  inventory,
  formatCOP,
}) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState("entrada");
  const [category, setCategory] = useState("venta");
  const [partner, setPartner] = useState("ambos");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("completado");
  const [notes, setNotes] = useState("");
  const [selectedWatchId, setSelectedWatchId] = useState("");

  if (!isOpen) return null;

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat === "venta") {
      setType("entrada");
      setPartner("ambos");
      setDescription("Venta de Reloj");
      setAmount("85000");
    } else if (newCat === "insumo") {
      setType("salida");
      setPartner("elian");
      setDescription("Insumos / Herramientas de Relojería");
      setAmount("");
    } else if (newCat === "abono_deuda") {
      setType("entrada");
      setPartner("juan");
      setDescription("Abono a Deuda Lote (Juan → Elian)");
      setAmount("10000");
    } else if (newCat === "aporte_lote") {
      setType("entrada");
      setPartner("juan");
      setDescription("Aporte Capital Lote");
      setAmount("40000");
    } else if (newCat === "cuenta_cobrar") {
      setType("entrada");
      setPartner("ambos");
      setStatus("pendiente");
      setDescription("Venta de Reloj (Cobro Quincena)");
      setAmount("85000");
    }
  };

  const handleWatchSelect = (watchId) => {
    setSelectedWatchId(watchId);
    const watch = inventory.find((w) => w.id === watchId);
    if (watch) {
      setDescription(`Venta de ${watch.model}`);
      setAmount(String(watch.targetPrice || watch.soldPrice || 85000));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert("Por favor ingresa un monto válido.");
      return;
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      date,
      type,
      category,
      partner,
      description: description || "Operación Krono",
      amount: Number(amount),
      status,
      notes,
      watchId: selectedWatchId || null,
    };

    onAddTransaction(newTx);

    // Trigger celebration confetti for sales and abonos!
    if (category === "venta" || category === "abono_deuda") {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#e5b869", "#10b981", "#34d399", "#f7d788"],
      });
    }

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-card">
        <div className="modal-header">
          <div className="flex-row items-center gap-2">
            <PlusCircle size={20} className="text-gold-light" />
            <h3 className="modal-title">Registrar Nueva Operación</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Category Selector Pills */}
          <div className="form-group">
            <label className="form-label">Tipo de Movimiento:</label>
            <div className="quick-category-grid">
              <button
                type="button"
                className={`cat-pill ${category === "venta" ? "active" : ""}`}
                onClick={() => handleCategoryChange("venta")}
              >
                <ShoppingBag size={14} /> Venta Reloj
              </button>
              <button
                type="button"
                className={`cat-pill ${category === "insumo" ? "active" : ""}`}
                onClick={() => handleCategoryChange("insumo")}
              >
                <Wrench size={14} /> Insumo / Gasto
              </button>
              <button
                type="button"
                className={`cat-pill ${category === "abono_deuda" ? "active" : ""}`}
                onClick={() => handleCategoryChange("abono_deuda")}
              >
                <Coins size={14} /> Abono Deuda Juan
              </button>
              <button
                type="button"
                className={`cat-pill ${category === "cuenta_cobrar" ? "active" : ""}`}
                onClick={() => handleCategoryChange("cuenta_cobrar")}
              >
                <Shield size={14} /> Por Cobrar
              </button>
            </div>
          </div>

          {/* If selling a watch, quick model dropdown */}
          {category === "venta" && (
            <div className="form-group">
              <label className="form-label">Seleccionar Reloj del Inventario (Opcional):</label>
              <select
                value={selectedWatchId}
                onChange={(e) => handleWatchSelect(e.target.value)}
                className="form-select"
              >
                <option value="">-- Reloj personalizado / Venta general --</option>
                {inventory
                  .filter((w) => w.stock > 0)
                  .map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.model} ({w.stock} disponibles) - {w.refPrice}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Description & Date */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Concepto / Descripción:</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Venta de Reloj Invicta Subaqua..."
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Fecha:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Amount & Partner */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Monto (COP):</label>
              <input
                type="number"
                required
                min="1000"
                step="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej. 85000"
                className="form-input mono-num"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Socio Responsable:</label>
              <select
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                className="form-select"
              >
                <option value="ambos">Krono (Ambos Socios)</option>
                <option value="elian">Elian Navarro</option>
                <option value="juan">Juan</option>
              </select>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Estado:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
              >
                <option value="completado">Completado / Efectivo en Mano</option>
                <option value="pendiente">Pendiente por Cobrar / Pagar</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Notas Adicionales (Opcional):</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Entregado en caja, cliente amiga..."
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary-gold">
              <Check size={16} />
              Guardar Operación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
