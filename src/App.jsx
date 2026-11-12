import React, { useState, useEffect, useRef } from "react";
import { INITIAL_DATA } from "./data/initialData";
import { calculateFinancials, formatCOP } from "./utils/financeCalculations";
import { exportKronoToExcel, importKronoFromExcel } from "./utils/excelExportImport";
import { fetchKronoStore, saveKronoStore, subscribeToKronoStore } from "./utils/supabaseClient";
import { Sidebar } from "./components/Sidebar";
import { OverviewPage } from "./pages/OverviewPage";
import { CashflowPage } from "./pages/CashflowPage";
import { PartnersPage } from "./pages/PartnersPage";
import { InventoryPage } from "./pages/InventoryPage";
import { StrategyPage } from "./pages/StrategyPage";
import { NewTransactionModal } from "./components/NewTransactionModal";
import { DebtSettleModal } from "./components/DebtSettleModal";
import { ReserveWatchModal } from "./components/ReserveWatchModal";
import { QuickSaleModal } from "./components/QuickSaleModal";
import { LoginScreen } from "./components/LoginScreen";
import { TopBar } from "./components/TopBar";
import confetti from "canvas-confetti";
import "./App.css";

export function App() {
  // AUTH: Active user session
  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem("krono_active_user");
    return saved ? JSON.parse(saved) : null;
  });

  // EDIT MODE
  const [isEditMode, setIsEditMode] = useState(false);

  // DATA STATE (v6 schema: 3 lots, 26 watches, $490k net sales, $30k Juan debt)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("krono_transactions_v6");
    return saved ? JSON.parse(saved) : INITIAL_DATA.transactions;
  });
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("krono_inventory_v6");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_DATA.inventory;
  });
  const [agreements, setAgreements] = useState(() => {
    const saved = localStorage.getItem("krono_agreements_v6");
    return saved ? JSON.parse(saved) : INITIAL_DATA.agreements;
  });
  const [lotConfig, setLotConfig] = useState(() => {
    const saved = localStorage.getItem("krono_lot_config_v6");
    return saved ? JSON.parse(saved) : INITIAL_DATA.lotConfig;
  });

  // UI STATE
  const [activePage, setActivePage] = useState("overview");
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveTargetWatch, setReserveTargetWatch] = useState(null);
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [saleTargetWatch, setSaleTargetWatch] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cloudStatus, setCloudStatus] = useState("syncing"); // 'synced' | 'syncing' | 'offline'

  // Persist all data locally (offline fallback)
  useEffect(() => { localStorage.setItem("krono_transactions_v6", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("krono_inventory_v6", JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem("krono_agreements_v6", JSON.stringify(agreements)); }, [agreements]);
  useEffect(() => { localStorage.setItem("krono_lot_config_v6", JSON.stringify(lotConfig)); }, [lotConfig]);
  useEffect(() => {
    if (activeUser) localStorage.setItem("krono_active_user", JSON.stringify(activeUser));
    else localStorage.removeItem("krono_active_user");
  }, [activeUser]);

  // 1. SUPABASE INITIAL FETCH + REALTIME SYNC ACROSS DEVICES
  useEffect(() => {
    let isMounted = true;

    async function loadCloudData() {
      setCloudStatus("syncing");
      const cloudStore = await fetchKronoStore();
      if (!isMounted) return;

      if (cloudStore && cloudStore.schemaVersion === "v6") {
        if (Array.isArray(cloudStore.transactions)) setTransactions(cloudStore.transactions);
        if (Array.isArray(cloudStore.inventory)) setInventory(cloudStore.inventory);
        if (Array.isArray(cloudStore.agreements)) setAgreements(cloudStore.agreements);
        if (cloudStore.lotConfig) setLotConfig(cloudStore.lotConfig);
        setCloudStatus("synced");
      } else {
        // Initialize or upgrade remote database to v6 schema
        const initialStore = { 
          schemaVersion: "v6",
          transactions: INITIAL_DATA.transactions, 
          inventory: INITIAL_DATA.inventory, 
          agreements: INITIAL_DATA.agreements, 
          lotConfig: INITIAL_DATA.lotConfig 
        };
        setTransactions(initialStore.transactions);
        setInventory(initialStore.inventory);
        setAgreements(initialStore.agreements);
        setLotConfig(initialStore.lotConfig);
        const ok = await saveKronoStore(initialStore);
        if (isMounted) setCloudStatus(ok ? "synced" : "offline");
      }
    }

    loadCloudData();

    // Listen to changes from other devices in real time (Juan / Elian live sync)
    const unsubscribe = subscribeToKronoStore((remoteStore) => {
      if (!isMounted || !remoteStore) return;
      if (Array.isArray(remoteStore.transactions)) setTransactions(remoteStore.transactions);
      if (Array.isArray(remoteStore.inventory)) setInventory(remoteStore.inventory);
      if (Array.isArray(remoteStore.agreements)) setAgreements(remoteStore.agreements);
      if (remoteStore.lotConfig) setLotConfig(remoteStore.lotConfig);
      setCloudStatus("synced");
      showToast("⚡ Datos sincronizados en vivo con Supabase.", "info");
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 2. AUTO-SAVE TO SUPABASE (Debounced 600ms)
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    setCloudStatus("syncing");
    const timer = setTimeout(async () => {
      const ok = await saveKronoStore({ schemaVersion: "v6", transactions, inventory, agreements, lotConfig });
      setCloudStatus(ok ? "synced" : "offline");
    }, 600);

    return () => clearTimeout(timer);
  }, [transactions, inventory, agreements, lotConfig]);

  const handleForceCloudSync = async () => {
    setCloudStatus("syncing");
    showToast("🔄 Sincronizando con Supabase...");
    const ok = await saveKronoStore({ schemaVersion: "v6", transactions, inventory, agreements, lotConfig });
    setCloudStatus(ok ? "synced" : "offline");
    if (ok) showToast("✅ Sincronizado correctamente con Supabase.");
    else showToast("⚠️ Error de conexión con Supabase. Revisa la tabla krono_store.", "info");
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const financials = calculateFinancials(transactions, lotConfig);

  // HANDLERS
  const handleLogin = (user) => { setActiveUser(user); };
  const handleLogout = () => { setActiveUser(null); setIsEditMode(false); };

  const handleAddTransaction = (newTx) => {
    const txWithAuthor = { ...newTx, addedBy: activeUser?.id || "unknown", addedAt: new Date().toISOString() };
    setTransactions((prev) => [txWithAuthor, ...prev]);
    if (newTx.watchId) {
      setInventory((prev) => prev.map((w) => {
        if (w.id === newTx.watchId) {
          const nextStock = Math.max(0, (w.stock || 1) - 1);
          return { ...w, stock: nextStock, status: nextStock === 0 ? "Agotado" : "Disponible", soldPrice: newTx.amount };
        }
        return w;
      }));
    }
    if (newTx.category === "venta") {
      confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 }, colors: ["#e5b869", "#10b981", "#f7d788"] });
    }
    showToast("✅ Operación registrada correctamente.");
  };

  const handleSettleDebt = ({ amount, date, notes }) => {
    const newTx = {
      id: `tx-abono-${Date.now()}`,
      date, type: "entrada", category: "abono_deuda", partner: "juan",
      description: `Abono de Juan a Elian — ${formatCOP(amount)}`,
      amount, status: "completado", notes,
      addedBy: activeUser?.id || "juan",
      addedAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ["#10b981", "#34d399", "#e5b869"] });
    showToast(`🎉 Abono de ${formatCOP(amount)} registrado con éxito!`);
  };

  const handleToggleStatus = (id) => {
    setTransactions((prev) => prev.map((tx) => tx.id === id ? { ...tx, status: tx.status === "completado" ? "pendiente" : "completado" } : tx));
    showToast("Estado actualizado.");
  };

  const handleDeleteTx = (id) => {
    if (window.confirm("¿Eliminar este movimiento contable?")) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      showToast("Movimiento eliminado.", "info");
    }
  };

  const handleUpdateTx = (id, updatedFields) => {
    setTransactions((prev) => prev.map((tx) => tx.id === id ? { ...tx, ...updatedFields } : tx));
  };

  const handleToggleAgreement = (id) => {
    setAgreements((prev) => prev.map((a) => a.id === id ? { ...a, active: !a.active } : a));
  };

  const handleAddAgreement = (agr) => { setAgreements((prev) => [...prev, agr]); };

  const handleExportExcel = () => {
    exportKronoToExcel({ transactions, inventory, lotConfig, agreements });
    showToast("📊 Excel exportado correctamente.");
  };
  const handleImportExcel = (file) => {
    importKronoFromExcel(file, (res) => {
      if (res.success) { setTransactions(res.transactions); showToast(`📂 ${res.count} movimientos importados.`); }
      else alert("Error: " + res.error);
    });
  };

  const handleResetData = () => {
    if (window.confirm("¿Restaurar todos los datos al balance oficial actualizado (6 ventas cobradas, $490k en caja, Lote #3 activo y Juan debe $30k)?")) {
      [
        "krono_transactions",
        "krono_transactions_v4",
        "krono_transactions_v5",
        "krono_transactions_v6",
        "krono_inventory_v3",
        "krono_inventory_v4",
        "krono_inventory_v5",
        "krono_inventory_v6",
        "krono_agreements",
        "krono_agreements_v4",
        "krono_agreements_v5",
        "krono_agreements_v6",
        "krono_lot_config",
        "krono_lot_config_v4",
        "krono_lot_config_v5",
        "krono_lot_config_v6"
      ].forEach(k => localStorage.removeItem(k));
      setTransactions(INITIAL_DATA.transactions);
      setInventory(INITIAL_DATA.inventory);
      setAgreements(INITIAL_DATA.agreements);
      setLotConfig(INITIAL_DATA.lotConfig);
      saveKronoStore({ 
        schemaVersion: "v6",
        transactions: INITIAL_DATA.transactions, 
        inventory: INITIAL_DATA.inventory, 
        agreements: INITIAL_DATA.agreements, 
        lotConfig: INITIAL_DATA.lotConfig 
      });
      showToast("✅ Datos restaurados al balance oficial actualizado de Krono.");
    }
  };

  // RESERVATION / APARTADO HANDLERS
  const handleOpenReserve = (watch) => {
    setReserveTargetWatch(watch);
    setIsReserveModalOpen(true);
  };

  const handleConfirmReserve = ({ watchId, clientName, clientPhone, totalPrice, deposit, remaining, dueDate, partner, notes }) => {
    const depositTxId = `tx-res-dep-${Date.now()}`;
    const pendingTxId = `tx-res-rem-${Date.now() + 1}`;
    const today = new Date().toISOString().split("T")[0];

    const watch = inventory.find(w => w.id === watchId);
    const watchModel = watch ? watch.model : "Reloj Krono";

    const depositTx = {
      id: depositTxId,
      date: today,
      type: "entrada",
      category: "venta",
      partner: partner || "ambos",
      description: `Anticipo Apartado: ${watchModel} (${clientName})`,
      amount: Number(deposit),
      status: "completado",
      notes: `Anticipo de apartado. Saldo restante: ${formatCOP(remaining)}. Tel: ${clientPhone || "N/A"}. ${notes || ""}`,
      watchId,
      addedBy: activeUser?.id || "unknown",
      addedAt: new Date().toISOString(),
    };

    const pendingTx = {
      id: pendingTxId,
      date: dueDate || today,
      type: "entrada",
      category: "cuenta_cobrar",
      partner: partner || "ambos",
      description: `Saldo Cobro Apartado: ${watchModel} (${clientName})`,
      amount: Number(remaining),
      status: "pendiente",
      notes: `Cobro quincena pactado para entrega de reloj. Anticipo previo: ${formatCOP(deposit)}`,
      watchId,
      addedBy: activeUser?.id || "unknown",
      addedAt: new Date().toISOString(),
    };

    setTransactions((prev) => [depositTx, pendingTx, ...prev]);

    setInventory((prev) => prev.map((w) => {
      if (w.id === watchId) {
        return {
          ...w,
          status: "Apartado",
          reservation: {
            clientName,
            clientPhone,
            totalPrice: Number(totalPrice),
            depositAmount: Number(deposit),
            remainingBalance: Number(remaining),
            dueDate,
            depositTxId,
            pendingTxId,
            reservedAt: today,
            partner,
          }
        };
      }
      return w;
    }));

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ["#f59e0b", "#e5b869", "#10b981"] });
    showToast(`🔒 ${watchModel} apartado para ${clientName} con anticipo de ${formatCOP(deposit)}.`);
  };

  const handleCompleteReservation = (watchId) => {
    const watch = inventory.find(w => w.id === watchId);
    if (!watch || !watch.reservation) return;

    const { pendingTxId, remainingBalance, clientName, totalPrice } = watch.reservation;

    if (pendingTxId) {
      setTransactions((prev) => prev.map(tx => tx.id === pendingTxId ? { ...tx, status: "completado" } : tx));
    }

    setInventory((prev) => prev.map(w => {
      if (w.id === watchId) {
        const nextStock = Math.max(0, (w.stock || 1) - 1);
        return {
          ...w,
          stock: nextStock,
          status: nextStock === 0 ? "Agotado" : "Disponible",
          soldPrice: totalPrice || w.targetPrice || 85000,
          highlight: `Vendido a ${clientName} (Apartado liquidado)`,
          reservation: null,
        };
      }
      return w;
    }));

    confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 }, colors: ["#10b981", "#34d399", "#e5b869"] });
    showToast(`🎉 ¡Venta completada! Saldo de ${formatCOP(remainingBalance)} ingresado a caja.`);
  };

  const handleCancelReservation = (watchId) => {
    if (!window.confirm("¿Seguro de cancelar este apartado? El reloj volverá a estar disponible.")) return;

    const watch = inventory.find(w => w.id === watchId);
    if (!watch) return;

    const pendingTxId = watch.reservation?.pendingTxId;
    if (pendingTxId) {
      setTransactions((prev) => prev.filter(tx => tx.id !== pendingTxId));
    }

    setInventory((prev) => prev.map(w => {
      if (w.id === watchId) {
        return {
          ...w,
          status: "Disponible",
          reservation: null,
        };
      }
      return w;
    }));

    showToast("Apartado cancelado. Reloj liberado al inventario disponible.", "info");
  };

  // QUICK SALE HANDLERS (Descargo Oficial con Trazabilidad)
  const handleOpenSaleModal = (watch) => {
    setSaleTargetWatch(watch);
    setIsQuickSaleOpen(true);
  };

  const handleConfirmQuickSale = ({
    watchId,
    soldBy,
    soldPrice,
    payMethod,
    custody,
    clientName,
    clientPhone,
    notes,
    date,
  }) => {
    const today = date || new Date().toISOString().split("T")[0];
    const watch = inventory.find((w) => w.id === watchId);
    const watchModel = watch ? watch.model : "Reloj Krono";
    const watchSku = watch ? (watch.sku || watch.id) : "";

    // 1. Transaction in cashflow
    const newTx = {
      id: `tx-sale-${Date.now()}`,
      date: today,
      type: "entrada",
      category: "venta",
      partner: soldBy || "ambos",
      description: `Venta: ${watchModel} (${watchSku})`,
      amount: Number(soldPrice),
      status: "completado",
      notes: `Descargo de venta: cerrado por ${soldBy === "elian" ? "Elian Navarro" : "Juan"}. Pago: ${payMethod}. ${clientName ? `Cliente: ${clientName}. ` : ""}${clientPhone ? `Tel: ${clientPhone}. ` : ""}Custodia dinero: ${custody === "elian" ? "Elian" : "Juan"}. ${notes || ""}`.trim(),
      watchId,
      addedBy: activeUser?.id || soldBy || "unknown",
      addedAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 2. Inventory update
    setInventory((prev) =>
      prev.map((w) => {
        if (w.id === watchId) {
          const nextStock = Math.max(0, (w.stock || 1) - 1);
          return {
            ...w,
            stock: nextStock,
            status: nextStock === 0 ? "Agotado" : "Disponible",
            soldPrice: Number(soldPrice),
            soldBy: soldBy,
            soldDate: today,
            payMethod: payMethod,
            custody: custody,
            clientName: clientName || null,
            clientPhone: clientPhone || null,
            highlight: `Vendido por ${soldBy === "elian" ? "Elian" : "Juan"} el ${today} (${formatCOP(soldPrice)})`,
          };
        }
        return w;
      })
    );

    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399", "#818cf8", "#e0e7ff"],
    });
    showToast(`🎉 ¡Venta de ${watchModel} registrada por ${soldBy === "elian" ? "Elian" : "Juan"}!`);
  };

  // If not logged in, show login
  if (!activeUser) {
    return <LoginScreen onLogin={handleLogin} partners={INITIAL_DATA.partners} />;
  }

  const partner = INITIAL_DATA.partners[activeUser.id];

  const pageProps = {
    financials, formatCOP, transactions, inventory, agreements, lotConfig,
    isEditMode, activeUser, partner,
    onOpenNewTx: () => setIsNewTxOpen(true),
    onOpenDebtModal: () => setIsDebtModalOpen(true),
    onToggleStatus: handleToggleStatus,
    onDeleteTx: handleDeleteTx,
    onUpdateTx: handleUpdateTx,
    onToggleAgreement: handleToggleAgreement,
    onAddAgreement: handleAddAgreement,
    onUpdateLotConfig: setLotConfig,
    onSellWatch: handleOpenSaleModal,
    onOpenReserve: handleOpenReserve,
    onCompleteReservation: handleCompleteReservation,
    onCancelReservation: handleCancelReservation,
    onExportExcel: handleExportExcel,
    onImportExcel: handleImportExcel,
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeUser={activeUser}
        partner={partner}
        onLogout={handleLogout}
        juanRemainingDebt={financials.juanRemainingDebt}
      />

      {/* Main content area */}
      <div className="main-area">
        <TopBar
          activePage={activePage}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          activeUser={activeUser}
          partner={partner}
          onLogout={handleLogout}
          onOpenNewTx={() => setIsNewTxOpen(true)}
          onOpenDebtModal={() => setIsDebtModalOpen(true)}
          onExportExcel={handleExportExcel}
          onImportExcel={handleImportExcel}
          onReset={handleResetData}
          juanRemainingDebt={financials.juanRemainingDebt}
          cashInHand={financials.cashInHand}
          formatCOP={formatCOP}
          cloudStatus={cloudStatus}
          onSyncCloud={handleForceCloudSync}
        />

        <main className="page-content">
          {activePage === "overview" && <OverviewPage {...pageProps} />}
          {activePage === "cashflow" && <CashflowPage {...pageProps} />}
          {activePage === "partners" && <PartnersPage {...pageProps} />}
          {activePage === "inventory" && <InventoryPage {...pageProps} />}
          {activePage === "strategy" && <StrategyPage {...pageProps} />}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Modals */}
      <NewTransactionModal
        isOpen={isNewTxOpen}
        onClose={() => setIsNewTxOpen(false)}
        onAddTransaction={handleAddTransaction}
        inventory={inventory}
        formatCOP={formatCOP}
      />
      <DebtSettleModal
        isOpen={isDebtModalOpen}
        onClose={() => setIsDebtModalOpen(false)}
        remainingDebt={financials.juanRemainingDebt}
        onSettleDebt={handleSettleDebt}
        formatCOP={formatCOP}
      />
      <ReserveWatchModal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        watch={reserveTargetWatch}
        onConfirmReserve={handleConfirmReserve}
        formatCOP={formatCOP}
      />
      <QuickSaleModal
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
        watch={saleTargetWatch}
        onConfirmSale={handleConfirmQuickSale}
        formatCOP={formatCOP}
        activeUser={activeUser}
      />
    </div>
  );
}

export default App;
