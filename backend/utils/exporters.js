import { Parser as Json2CsvParser } from "json2csv";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export function toJsonBuffer(payload) {
  return Buffer.from(JSON.stringify(payload, null, 2));
}

export function toCsvBuffer(report) {
  const rows = [];
  const addTransactionRows = (txs, groupLabel) => {
    txs.forEach((t) => {
      rows.push({
        group: groupLabel || null,
        date: t.date ? new Date(t.date).toISOString() : null,
        vehicleNumber: t.vehicleNumber || "",
        driverName: t.driverName || "",
        accountantName: t.accountantName || "",
        emptyVehicleWeight: t.emptyVehicleWeight ?? null,
        grossWeight: t.grossWeight ?? null,
        netWeight: t.netWeight ?? null,
        numberOfBirds: t.numberOfBirds ?? null,
        rate: t.rate ?? null,
        totalAmount: t.totalAmount ?? null,
        amountPaid: t.amountPaid ?? null,
        balance: t.balance ?? null,
        buyerName: t.buyerInfo?.name || "",
        farmName: t.farmInfo?.name || "",
        flockName: t.flockInfo?.name || "",
        shedName: t.shedInfo?.name || "",
      });
    });
  };

  if (report.groupBy && report.groupBy !== "none") {
    (report.groupedResults || []).forEach((g) => {
      const label =
        g.groupInfo?.name ||
        g.groupInfo?.date ||
        g.groupInfo?.driverName ||
        g.groupInfo?.accountantName ||
        String(g.groupId || "");
      addTransactionRows(g.transactions || [], label);
    });
  } else {
    addTransactionRows(report.transactions || [], null);
  }

  const parser = new Json2CsvParser({
    fields: [
      "group",
      "date",
      "vehicleNumber",
      "driverName",
      "accountantName",
      "emptyVehicleWeight",
      "grossWeight",
      "netWeight",
      "numberOfBirds",
      "rate",
      "totalAmount",
      "amountPaid",
      "balance",
      "buyerName",
      "farmName",
      "flockName",
      "shedName",
    ],
  });

  const csv = parser.parse(rows);
  return Buffer.from(csv, "utf8");
}

export async function toExcelBuffer(report) {
  const workbook = new ExcelJS.Workbook();
  const summarySheet = workbook.addWorksheet("Summary");
  const txSheet = workbook.addWorksheet("Transactions");

  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 32 },
    { header: "Value", key: "value", width: 40 },
  ];

  const s = report.summary || {};
  const add = (metric, value) => summarySheet.addRow({ metric, value });
  // Title row
  const title = report.reportTitle || "Report";
  const titleRow = summarySheet.addRow([title]);
  titleRow.font = { bold: true, size: 14 };
  summarySheet.mergeCells(`A${titleRow.number}:B${titleRow.number}`);
  summarySheet.addRow([]);
  add("From", report.dateRange?.from || s.dateRange?.from || "");
  add("To", report.dateRange?.to || s.dateRange?.to || "");
  add("Total Transactions", s.totalTransactions ?? 0);
  add("Total Net Weight", s.totalNetWeight ?? 0);
  add("Total Amount", s.totalAmount ?? 0);
  add("Total Paid", s.totalPaid ?? 0);
  add("Total Balance", s.totalBalance ?? 0);

  txSheet.columns = [
    { header: "Group", key: "group", width: 20 },
    { header: "Date", key: "date", width: 14 },
    { header: "Vehicle", key: "vehicleNumber", width: 14 },
    { header: "Driver", key: "driverName", width: 16 },
    { header: "Accountant", key: "accountantName", width: 16 },
    {
      header: "Empty Wt",
      key: "emptyVehicleWeight",
      width: 10,
      style: { numFmt: "0.00" },
    },
    {
      header: "Gross Wt",
      key: "grossWeight",
      width: 10,
      style: { numFmt: "0.00" },
    },
    {
      header: "Net Wt",
      key: "netWeight",
      width: 10,
      style: { numFmt: "0.00" },
    },
    { header: "Birds", key: "numberOfBirds", width: 8 },
    { header: "Rate", key: "rate", width: 10, style: { numFmt: "#,##0.00" } },
    {
      header: "Amount",
      key: "totalAmount",
      width: 12,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "Paid",
      key: "amountPaid",
      width: 12,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "Balance",
      key: "balance",
      width: 12,
      style: { numFmt: "#,##0.00" },
    },
    { header: "Buyer", key: "buyerName", width: 18 },
    { header: "Farm", key: "farmName", width: 18 },
    { header: "Flock", key: "flockName", width: 16 },
    { header: "Shed", key: "shedName", width: 16 },
  ];

  const rows = [];
  const addTransactionRows = (txs, groupLabel) => {
    txs.forEach((t) => {
      rows.push({
        group: groupLabel || "",
        date: t.date ? new Date(t.date).toISOString() : "",
        vehicleNumber: t.vehicleNumber || "",
        driverName: t.driverName || "",
        accountantName: t.accountantName || "",
        emptyVehicleWeight: t.emptyVehicleWeight ?? "",
        grossWeight: t.grossWeight ?? "",
        netWeight: t.netWeight ?? "",
        numberOfBirds: t.numberOfBirds ?? "",
        rate: t.rate ?? "",
        totalAmount: t.totalAmount ?? "",
        amountPaid: t.amountPaid ?? "",
        balance: t.balance ?? "",
        buyerName: t.buyerInfo?.name || "",
        farmName: t.farmInfo?.name || "",
        flockName: t.flockInfo?.name || "",
        shedName: t.shedInfo?.name || "",
      });
    });
  };

  if (report.groupBy && report.groupBy !== "none") {
    (report.groupedResults || []).forEach((g) => {
      const label =
        g.groupInfo?.name ||
        g.groupInfo?.date ||
        g.groupInfo?.driverName ||
        g.groupInfo?.accountantName ||
        String(g.groupId || "");
      addTransactionRows(g.transactions || [], label);
    });
  } else {
    addTransactionRows(report.transactions || [], null);
  }

  // Header styling
  const headerRow = txSheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: "middle" };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFF2F6" },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCDD2D7" } },
      left: { style: "thin", color: { argb: "FFCDD2D7" } },
      bottom: { style: "thin", color: { argb: "FFCDD2D7" } },
      right: { style: "thin", color: { argb: "FFCDD2D7" } },
    };
  });

  txSheet.addRows(rows);

  // Zebra striping and subtle borders
  for (let i = 2; i <= txSheet.rowCount; i++) {
    const row = txSheet.getRow(i);
    const isEven = i % 2 === 0;
    row.eachCell((cell) => {
      if (isEven) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FBFD" },
        };
      }
      cell.border = {
        top: { style: "hair", color: { argb: "FFE5E7EB" } },
        left: { style: "hair", color: { argb: "FFE5E7EB" } },
        bottom: { style: "hair", color: { argb: "FFE5E7EB" } },
        right: { style: "hair", color: { argb: "FFE5E7EB" } },
      };
    });
  }

  // Freeze header and add autofilter
  txSheet.views = [{ state: "frozen", ySplit: 1 }];
  txSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: txSheet.columnCount },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function toPdfStream(report, res) {
  const doc = new PDFDocument({ size: "A4", margin: 36, layout: "landscape" });
  // Pipe before writing
  doc.pipe(res);

  const title = report.reportTitle || "Report";
  const s = report.summary || {};

  // Title and summary
  doc.fontSize(16).fillColor("#111827").text(title, { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#374151");
  doc.text(`From: ${report.dateRange?.from || s.dateRange?.from || ""}`);
  doc.text(`To: ${report.dateRange?.to || s.dateRange?.to || ""}`);
  doc.text(`Total Transactions: ${s.totalTransactions ?? 0}`);
  doc.text(`Total Amount: ${s.totalAmount ?? 0}`);
  doc.text(`Total Paid: ${s.totalPaid ?? 0}`);
  doc.text(`Total Balance: ${s.totalBalance ?? 0}`);

  doc.moveDown(0.75);
  doc.fontSize(12).fillColor("#111827").text("Transactions");
  doc.moveDown(0.25);

  // Table config (wider, more columns)
  const columns = [
    { key: "group", label: "Group", width: 120 },
    { key: "date", label: "Date", width: 70 },
    { key: "vehicleNumber", label: "Vehicle", width: 80 },
    { key: "driverName", label: "Driver", width: 120 },
    { key: "buyerName", label: "Buyer", width: 120 },
    { key: "farmName", label: "Farm", width: 120 },
    { key: "netWeight", label: "Net Wt", width: 70 },
    { key: "numberOfBirds", label: "Birds", width: 60 },
    { key: "rate", label: "Rate", width: 60 },
    { key: "totalAmount", label: "Amount", width: 80 },
    { key: "amountPaid", label: "Paid", width: 80 },
    { key: "balance", label: "Balance", width: 80 },
  ];

  const startX = doc.x;
  let y = doc.y;
  const rowHeight = 16;
  const pageBottom = doc.page.height - doc.page.margins.bottom;

  const drawHeader = () => {
    const totalWidth = columns.reduce((a, c) => a + c.width, 0);
    doc
      .rect(startX, y, totalWidth, rowHeight)
      .fillOpacity(1)
      .fill("#F3F4F6")
      .fillOpacity(1);
    let x = startX + 4;
    doc.fillColor("#111827").fontSize(9).font("Helvetica-Bold");
    columns.forEach((col) => {
      doc.text(col.label, x, y + 4, { width: col.width - 8, ellipsis: true });
      x += col.width;
    });
    doc.font("Helvetica");
    y += rowHeight;
  };

  const formatNum = (v) => {
    if (v === null || v === undefined || v === "") return "";
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return n.toLocaleString("en-US");
  };

  const drawRow = (row, stripe) => {
    if (y + rowHeight > pageBottom) {
      doc.addPage();
      y = doc.y;
      drawHeader();
    }
    if (stripe) {
      const totalWidth = columns.reduce((a, c) => a + c.width, 0);
      doc
        .rect(startX, y, totalWidth, rowHeight)
        .fillOpacity(1)
        .fill("#FAFAFB")
        .fillOpacity(1);
    }
    let x = startX + 4;
    doc.fillColor("#111827").fontSize(9);
    columns.forEach((col) => {
      const raw = row[col.key] ?? "";
      const value = [
        "rate",
        "totalAmount",
        "amountPaid",
        "balance",
        "netWeight",
        "numberOfBirds",
      ].includes(col.key)
        ? formatNum(raw)
        : raw;
      doc.text(String(value), x, y + 3, {
        width: col.width - 8,
        ellipsis: true,
      });
      x += col.width;
    });
    y += rowHeight;
  };

  // Flatten rows
  const rows = [];
  const addTransactionRows = (txs, label) => {
    txs.forEach((t) => {
      rows.push({
        group: label || "",
        date: t.date ? new Date(t.date).toISOString().slice(0, 10) : "",
        vehicleNumber: t.vehicleNumber || "",
        driverName: t.driverName || "",
        buyerName: t.buyerInfo?.name || "",
        farmName: t.farmInfo?.name || "",
        netWeight: t.netWeight ?? "",
        numberOfBirds: t.numberOfBirds ?? "",
        rate: t.rate ?? "",
        totalAmount: t.totalAmount ?? "",
        amountPaid: t.amountPaid ?? "",
        balance: t.balance ?? "",
      });
    });
  };

  if (report.groupBy && report.groupBy !== "none") {
    (report.groupedResults || []).forEach((g) => {
      const label =
        g.groupInfo?.name ||
        g.groupInfo?.date ||
        g.groupInfo?.driverName ||
        g.groupInfo?.accountantName ||
        String(g.groupId || "");
      addTransactionRows(g.transactions || [], label);
    });
  } else {
    addTransactionRows(report.transactions || [], null);
  }

  drawHeader();
  rows.forEach((r, idx) => drawRow(r, idx % 2 === 1));

  doc.end();
}
