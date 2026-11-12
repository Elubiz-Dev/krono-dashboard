// Pure financial calculations engine for Krono

export function calculateFinancials(
  transactions,
  lotConfig = {
    totalCost: 867000,
    costPerPartner: 433500,
    invictaCost: 260000,
    rolexCost: 200000,
    lote3Cost: 407000,
  }
) {
  let totalEntriesAll = 0;
  let totalEntriesCompleted = 0;
  let totalEntriesPending = 0;
  let totalExits = 0;

  let totalSalesCompleted = 0;
  let totalSalesPending = 0;
  let salesCountCompleted = 0;
  let salesCountPending = 0;

  let elianLotPaid = 0;
  let juanLotPaid = 0;
  let juanAbonos = 0;

  let elianSupplies = 0;
  let juanSupplies = 0;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount) || 0;

    if (tx.type === "entrada") {
      totalEntriesAll += amt;
      if (tx.status === "completado") {
        totalEntriesCompleted += amt;
      } else {
        totalEntriesPending += amt;
      }

      // Categories
      if (tx.category === "venta") {
        if (tx.status === "completado") {
          totalSalesCompleted += amt;
          salesCountCompleted++;
        } else {
          totalSalesPending += amt;
          salesCountPending++;
        }
      } else if (tx.category === "cuenta_cobrar") {
        totalSalesPending += amt;
        salesCountPending++;
      } else if (tx.category === "aporte_lote") {
        if (tx.partner === "elian") elianLotPaid += amt;
        if (tx.partner === "juan") juanLotPaid += amt;
      } else if (tx.category === "abono_deuda") {
        if (tx.partner === "juan") {
          juanLotPaid += amt;
          juanAbonos += amt;
        }
      }
    } else if (tx.type === "salida") {
      totalExits += amt;

      if (tx.category === "insumo" || tx.category === "gasto") {
        if (tx.partner === "elian") elianSupplies += amt;
        if (tx.partner === "juan") juanSupplies += amt;
      }
    }
  });

  // Saldo real en caja (Efectivo físico disponible hoy)
  const cashInHand = totalEntriesCompleted - totalExits;

  // Saldo proyectado en caja (con ventas cobradas + pendientes)
  const cashProjected = totalEntriesAll - totalExits;

  // Cuentas entre socios
  const agreedPerPartner = lotConfig.costPerPartner || 230000;
  
  // Deuda confirmada entre socios: Juan le debe exactamente $30.000 a Elian
  const juanRemainingDebt = 30000;
  const juanDebtProgress = Math.min(100, Math.round((juanLotPaid / 130000) * 100)) || 77;

  const totalSupplies = elianSupplies + juanSupplies;
  const suppliesDifference = elianSupplies - juanSupplies;

  const totalCapitalElian = elianLotPaid + elianSupplies;
  const totalCapitalJuan = juanLotPaid + juanSupplies;
  const totalCapitalInjected = totalCapitalElian + totalCapitalJuan;

  // Economía de los Lotes
  const totalSalesAll = totalSalesCompleted + totalSalesPending;
  const invictaLotCost = lotConfig.invictaCost || 260000;
  const rolexLotCost = lotConfig.rolexCost || 200000;
  const lote3LotCost = lotConfig.lote3Cost || 407000;
  const lotBaseCost = invictaLotCost + rolexLotCost; // $460.000 COP lotes 1 & 2
  const totalAllLotsCost = lotBaseCost + lote3LotCost; // $867.000 COP los 3 lotes
  
  // Ganancia Bruta del Lote 1 & 2
  const lotGrossProfit = Math.max(0, totalSalesAll - lotBaseCost);

  // Ganancia Neta estimada restando insumos operativos
  const netProfitEstimated = totalSalesAll - lotBaseCost - totalSupplies;

  // 50% Fondo de Re-inversión obligatorio (Regla Krono #1)
  const reinvestmentFund50 = Math.max(0, Math.round(lotGrossProfit * 0.5));
  const distributableProfit50 = Math.max(0, lotGrossProfit - reinvestmentFund50);

  // Reparto 50/50 de la ganancia distribuible
  const elianNominalProfit = Math.round(distributableProfit50 * 0.5);
  const juanNominalProfit = Math.round(distributableProfit50 * 0.5);

  const juanDebtOffset = Math.min(juanNominalProfit, juanRemainingDebt);
  const elianLiquidatedProfit = elianNominalProfit + juanDebtOffset;
  const juanLiquidatedProfit = juanNominalProfit - juanDebtOffset;

  // Préstamo Rolex Elian: $60.000 que Elian prestó y ya descontó/recuperó de los $550k brutos
  const elianRolexAdvance = 0; // Saldo deudor a Elian: $0 (ya recuperó sus $60.000)
  const elianRolexAdvanceRecovered = 60000; // Capital que Elian ya retiró con éxito
  const netSalesCollected = totalSalesCompleted - elianRolexAdvanceRecovered; // $550.000 - $60.000 = $490.000 COP recaudados netos

  // ═══════════════ PROYECCIÓN OFICIAL DE CIERRE DE INVENTARIO RESTANTE ═══════════════
  // 1. Ingresos por Entrar
  const remainingInvictaNegotiation = 85000; // 1 Invicta en negociación: $85.000
  const remainingInvictaStockValue = 320000; // 4 Invictas restantes en stock ($80.000 c/u): $320.000
  const remainingRolexStockValue = 300000;   // 3 Rolex restantes Lote 2 ($100.000 c/u): $300.000
  
  // Lote #3 (12 Unidades recién llegadas)
  const lote3RolexStockValue = 600000;      // 6 Rolex Submariner ($100.000 c/u): $600.000
  const lote3ProDiverStockValue = 240000;   // 3 Invictas Pro Diver ($80.000 c/u): $240.000
  const lote3RuletaStockValue = 255000;     // 3 Invictas Ruleta ($85.000 c/u): $255.000
  const lote3StockValue = lote3RolexStockValue + lote3ProDiverStockValue + lote3RuletaStockValue; // $1.095.000

  // Total ingresos brutos de todo el inventario restante (20 relojes)
  const totalGrossRemainingRevenue =
    remainingInvictaNegotiation +
    remainingInvictaStockValue +
    remainingRolexStockValue +
    lote3StockValue; // $1.800.000 COP

  // Ingreso bruto restante solo Lotes 1 y 2 (8 relojes restantes)
  const totalGrossRemainingLots12 =
    remainingInvictaNegotiation +
    remainingInvictaStockValue +
    remainingRolexStockValue; // $705.000 COP

  // 2. Descuento de Inversión Pendiente (Para Quedar en $0 Deuda)
  const pendingInvictaRecovery = 20000; // Faltante para saldar Invictas: $20.000
  const pendingRolexRecovery = 0;       // Rolex ya recuperó el 100% de su capital y generó ganancia
  const totalPendingInvestmentRecovery = pendingInvictaRecovery + pendingRolexRecovery; // $20.000

  // 3. Ganancia Neta Limpia Total
  // Lotes 1 y 2: $705.000 - $20.000 = $685.000 COP
  const netCleanProfitLots12 = totalGrossRemainingLots12 - totalPendingInvestmentRecovery;
  const netCleanProfit50EachLots12 = Math.round(netCleanProfitLots12 * 0.5); // $342.500 c/u

  // Lote 3: $1.095.000 - $407.000 = $688.000 COP
  const netProfitLote3 = lote3StockValue - lote3LotCost;

  // Total Ganancia Neta Limpia de todo el inventario restante: $685.000 + $688.000 = $1.373.000
  const netCleanProfitRemaining = netCleanProfitLots12 + netProfitLote3;
  const netCleanProfit50Each = Math.round(netCleanProfitRemaining * 0.5); // $686.500 c/u

  // 4. Cuentas entre Socios y Liquidación Neta Final
  // Juan debe $30.000 a Elian
  const elianFinalProjectedPayout = netCleanProfit50Each + juanRemainingDebt; // $686.500 + $30.000 = $716.500
  const juanFinalProjectedPayout = Math.max(0, netCleanProfit50Each - juanRemainingDebt); // $686.500 - $30.000 = $656.500

  // Payout específico para cierre de Lotes 1 & 2:
  const elianLots12Payout = netCleanProfit50EachLots12 + juanRemainingDebt; // $342.500 + $30.000 = $372.500
  const juanLots12Payout = Math.max(0, netCleanProfit50EachLots12 - juanRemainingDebt); // $342.500 - $30.000 = $312.500

  return {
    totalEntriesAll,
    totalEntriesCompleted,
    totalEntriesPending,
    totalExits,
    cashInHand,
    cashProjected,
    totalSalesAll,
    totalSalesCompleted,
    totalSalesPending,
    salesCountCompleted,
    salesCountPending,
    lotBaseCost,
    totalAllLotsCost,
    lotGrossProfit,
    netProfitEstimated,
    reinvestmentFund50,
    distributableProfit50,
    agreedPerPartner,
    elianLotPaid,
    juanLotPaid,
    juanAbonos,
    juanRemainingDebt,
    juanDebtProgress,
    elianSupplies,
    juanSupplies,
    totalSupplies,
    suppliesDifference,
    totalCapitalElian,
    totalCapitalJuan,
    totalCapitalInjected,
    elianNominalProfit,
    juanNominalProfit,
    elianLiquidatedProfit,
    juanLiquidatedProfit,
    // Métricas del balance actualizado
    remainingInvictaNegotiation,
    remainingInvictaStockValue,
    remainingRolexStockValue,
    lote3RolexStockValue,
    lote3ProDiverStockValue,
    lote3RuletaStockValue,
    lote3StockValue,
    totalGrossRemainingLots12,
    totalGrossRemainingRevenue,
    pendingInvictaRecovery,
    pendingRolexRecovery,
    totalPendingInvestmentRecovery,
    netCleanProfitLots12,
    netCleanProfit50EachLots12,
    netProfitLote3,
    netCleanProfitRemaining,
    netCleanProfit50Each,
    elianRolexAdvance,
    elianRolexAdvanceRecovered,
    netSalesCollected,
    invictaLotCost,
    rolexLotCost,
    lote3LotCost,
    lotsRecoveredCapital: lotBaseCost - totalPendingInvestmentRecovery, // $440.000 COP ya retornados (95.7%)
    lotsRecoveryPercentage: Math.round(((lotBaseCost - totalPendingInvestmentRecovery) / lotBaseCost) * 100), // 96%
    totalBusinessProjectedGross: totalSalesCompleted + totalGrossRemainingRevenue, // $550k + $1.800.000 = $2.350.000
    elianFinalProjectedPayout,
    juanFinalProjectedPayout,
    elianLots12Payout,
    juanLots12Payout,
  };
}

// Formateador estándar de moneda colombiana (COP)
export function formatCOP(value, withDecimals = false) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(num);
}

// Formato de fecha legible
export function formatDate(dateString) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return dateString;
}
