import * as XLSX from "xlsx";
import { calculateFinancials, formatCOP } from "./financeCalculations";

export function exportKronoToExcel(data) {
  const { transactions, inventory, lotConfig, agreements } = data;
  const fin = calculateFinancials(transactions, lotConfig);

  const wb = XLSX.utils.book_new();

  // 1. 📊 Resumen General
  const summaryRows = [
    ["KRONO FINANZAS - RESUMEN EJECUTIVO (ELIAN & JUAN)", ""],
    ["Métrica / KPI", "Valor COP"],
    ["Total Ingresos Registrados (Aportes + Ventas)", fin.totalEntriesAll],
    ["Total Insumos / Salidas de Caja", fin.totalExits],
    ["Efectivo Físico Disponible en Caja (Cobrado)", fin.cashInHand],
    ["Efectivo Proyectado en Caja (Con 30 Oct)", fin.cashProjected],
    ["Ventas del Lote Cobradas", fin.totalSalesCompleted],
    ["Ventas del Lote Pendientes (30 Oct)", fin.totalSalesPending],
    ["Ventas Totales del Lote", fin.totalSalesAll],
    ["Costo Base del Lote (7 Relojes)", fin.lotBaseCost],
    ["Ganancia Bruta del Lote", fin.lotGrossProfit],
    ["Fondo Obligatorio de Re-inversión (50% Próximo Lote)", fin.reinvestmentFund50],
    ["Utilidad Distribuible a Socios (50%)", fin.distributableProfit50],
    ["Deuda Pendiente de Juan a Elian por Lote", fin.juanRemainingDebt],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, "📊 Resumen General");

  // 2. 💵 Caja
  const cashRows = [
    ["CONTROL DE FLUJO DE CAJA - KRONO", "", "", "", "", ""],
    ["Fecha", "Descripción", "Entrada (+)", "Salida (-)", "Socio", "Estado"],
  ];
  transactions.forEach((tx) => {
    cashRows.push([
      tx.date,
      tx.description,
      tx.type === "entrada" ? tx.amount : "",
      tx.type === "salida" ? tx.amount : "",
      tx.partner === "elian" ? "Elian" : tx.partner === "juan" ? "Juan" : "Ambos",
      tx.status === "completado" ? "Cobrado / Efectivo" : "Pendiente",
    ]);
  });
  cashRows.push([
    "TOTALES",
    "",
    fin.totalEntriesAll,
    fin.totalExits,
    "",
    "",
  ]);
  cashRows.push([
    "",
    "EFECTIVO DISPONIBLE EN CAJA:",
    fin.cashInHand,
    "",
    "",
    "",
  ]);
  const wsCash = XLSX.utils.aoa_to_sheet(cashRows);
  XLSX.utils.book_append_sheet(wb, wsCash, "💵 Caja");

  // 3. 👥 Socios
  const partnerRows = [
    ["ESTADO DE CUENTAS ENTRE SOCIOS", "", "", ""],
    ["Concepto", "Elian", "Juan", "Total / Estado"],
    ["Aporte Inicial Acordado (Lote)", fin.agreedPerPartner, fin.agreedPerPartner, fin.lotBaseCost],
    ["Aporte Real Entregado Lote", fin.elianLotPaid, fin.juanLotPaid, fin.elianLotPaid + fin.juanLotPaid],
    [
      "Saldo Pendiente Aporte Lote",
      0,
      fin.juanRemainingDebt,
      fin.juanRemainingDebt > 0 ? `Juan debe ${formatCOP(fin.juanRemainingDebt)}` : "Al día",
    ],
    ["Inversión en Insumos Propios", fin.elianSupplies, fin.juanSupplies, fin.totalSupplies],
    ["Inversión Total Aportada (Lote + Insumos)", fin.totalCapitalElian, fin.totalCapitalJuan, fin.totalCapitalInjected],
    ["", "", "", ""],
    ["📌 REGLAS Y ACUERDOS DEL NEGOCIO", "", "", ""],
  ];
  agreements.forEach((agr) => {
    partnerRows.push([agr.title, agr.description, "", ""]);
  });
  const wsPartners = XLSX.utils.aoa_to_sheet(partnerRows);
  XLSX.utils.book_append_sheet(wb, wsPartners, "👥 Socios");

  // 4. 📦 Inventario
  const invRows = [
    ["Estado", "Modelo", "Marca / Colección", "Precio Referencia", "Stock Unidades", "Detalle"],
  ];
  inventory.forEach((item) => {
    invRows.push([
      item.status,
      item.model,
      item.brand || "Krono",
      item.refPrice,
      item.stock,
      item.highlight || "",
    ]);
  });
  const wsInv = XLSX.utils.aoa_to_sheet(invRows);
  XLSX.utils.book_append_sheet(wb, wsInv, "📦 Inventario");

  // Write and trigger download
  const dateStr = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `Krono_Finanzas_Export_${dateStr}.xlsx`);
}

export function importKronoFromExcel(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Look for Caja sheet
      const cashSheetName = workbook.SheetNames.find(
        (s) => s.includes("Caja") || s.includes("caja")
      ) || workbook.SheetNames[1] || workbook.SheetNames[0];

      const sheet = workbook.Sheets[cashSheetName];
      const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const parsedTransactions = [];
      let startParsing = false;

      rawRows.forEach((row, idx) => {
        if (!row || row.length === 0) return;
        const col0 = String(row[0] || "").trim();
        const col1 = String(row[1] || "").trim();

        if (col0.toLowerCase().includes("fecha") || col1.toLowerCase().includes("descrip")) {
          startParsing = true;
          return;
        }

        if (startParsing) {
          if (col0.toLowerCase().includes("total") || col1.toLowerCase().includes("efectivo")) {
            return;
          }
          if (col0 && col1) {
            const entryVal = Number(row[2]) || 0;
            const exitVal = Number(row[3]) || 0;
            const isEntry = entryVal > 0;
            const amount = isEntry ? entryVal : exitVal;

            if (amount > 0) {
              parsedTransactions.push({
                id: `import-${idx}-${Date.now()}`,
                date: col0.includes("/") ? col0.split("/").reverse().join("-") : col0,
                description: col1,
                type: isEntry ? "entrada" : "salida",
                category: col1.toLowerCase().includes("venta")
                  ? (col1.toLowerCase().includes("pendiente") ? "cuenta_cobrar" : "venta")
                  : col1.toLowerCase().includes("abono")
                  ? "abono_deuda"
                  : col1.toLowerCase().includes("insumo")
                  ? "insumo"
                  : "aporte_lote",
                partner: col1.toLowerCase().includes("juan") ? "juan" : col1.toLowerCase().includes("elian") ? "elian" : "ambos",
                amount,
                status: col1.toLowerCase().includes("pendiente") ? "pendiente" : "completado",
                notes: "Importado desde Excel",
              });
            }
          }
        }
      });

      if (parsedTransactions.length > 0) {
        callback({ success: true, count: parsedTransactions.length, transactions: parsedTransactions });
      } else {
        callback({ success: false, error: "No se encontraron movimientos válidos en la hoja de Caja." });
      }
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  };
  reader.readAsArrayBuffer(file);
}
