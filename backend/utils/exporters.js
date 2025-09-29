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

  // When grouped, prepend a lightweight summary block for each group
  if (report.groupBy && report.groupBy !== "none") {
    (report.groupedResults || []).forEach((g) => {
      const label =
        g.groupInfo?.name ||
        g.groupInfo?.date ||
        g.groupInfo?.driverName ||
        g.groupInfo?.accountantName ||
        String(g.groupId || "");
      rows.push({ group: `${label} (group)`, date: null });
      rows.push({
        group: "summary",
        date: null,
        totalAmount: g.summary?.totalAmount ?? null,
        amountPaid: g.summary?.totalPaid ?? null,
        balance: g.summary?.totalBalance ?? null,
        netWeight: g.summary?.totalNetWeight ?? null,
        numberOfBirds: g.summary?.totalBirds ?? null,
      });
      addTransactionRows(g.transactions || [], label);
      rows.push({});
    });
    if (report.summary) {
      rows.push({ group: "OVERALL", date: null });
      rows.push({
        group: "overall-summary",
        date: null,
        totalAmount: report.summary.totalAmount ?? null,
        amountPaid: report.summary.totalPaid ?? null,
        balance: report.summary.totalBalance ?? null,
        netWeight: report.summary.totalNetWeight ?? null,
        numberOfBirds: report.summary.totalBirds ?? null,
      });
    }
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
  workbook.creator = "Al Ghani Farm";
  workbook.created = new Date();
  const summarySheet = workbook.addWorksheet("Summary");
  const txSheet = workbook.addWorksheet("Transactions");
  const groupedSheet =
    report.groupBy && report.groupBy !== "none"
      ? workbook.addWorksheet("Grouped")
      : null;

  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 32 },
    { header: "Value", key: "value", width: 40 },
  ];

  const s = report.summary || {};
  const add = (metric, value) => summarySheet.addRow({ metric, value });
  // Title banner
  const title = report.reportTitle || "Report";
  const titleRow = summarySheet.addRow([title]);
  summarySheet.mergeCells(`A${titleRow.number}:B${titleRow.number}`);
  titleRow.height = 28;
  titleRow.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  titleRow.alignment = { vertical: "middle", horizontal: "left" };
  summarySheet.getCell(`A${titleRow.number}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1F2937" },
  };
  summarySheet.getCell(`B${titleRow.number}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1F2937" },
  };
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

  // Add rows then style header with dark background
  txSheet.addRows(rows);

  const headerRow = txSheet.getRow(1);
  headerRow.height = 22;
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.alignment = { vertical: "middle" };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF111827" },
    };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF1F2937" } },
    };
  });

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

  // ============== GROUPED SHEET (sections per group) ==============
  if (groupedSheet && report.groupedResults?.length) {
    groupedSheet.columns = [
      { header: "Date", key: "date", width: 14 },
      { header: "Vehicle", key: "vehicleNumber", width: 14 },
      { header: "Driver", key: "driverName", width: 16 },
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
    ];

    let currentRow = 1;
    const addGroupSection = (group) => {
      const label =
        group.groupInfo?.name ||
        group.groupInfo?.date ||
        group.groupInfo?.driverName ||
        group.groupInfo?.accountantName ||
        String(group.groupId || "");

      // Group header row (merged, dark)
      groupedSheet.mergeCells(`A${currentRow}:I${currentRow}`);
      const cell = groupedSheet.getCell(`A${currentRow}`);
      cell.value = `${label}`;
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF111827" },
      };
      groupedSheet.getRow(currentRow).height = 20;
      currentRow += 1;

      // Summary band
      const s = group.summary || {};
      const summaryPairs = [
        ["Transactions", s.totalTransactions ?? 0],
        ["Net Wt", s.totalNetWeight ?? 0],
        ["Amount", s.totalAmount ?? 0],
        ["Paid", s.totalPaid ?? 0],
        ["Balance", s.totalBalance ?? 0],
      ];
      summaryPairs.forEach(([k, v]) => {
        groupedSheet.mergeCells(`A${currentRow}:B${currentRow}`);
        groupedSheet.getCell(`A${currentRow}`).value = k;
        groupedSheet.getCell(`C${currentRow}`).value = Number(v);
        groupedSheet.getCell(`A${currentRow}`).font = { bold: true };
        currentRow += 1;
      });
      currentRow += 1; // spacer

      // Table header for this group
      const headerRow = groupedSheet.getRow(currentRow);
      groupedSheet.columns.forEach((col, idx) => {
        const c = headerRow.getCell(idx + 1);
        c.value = col.header;
        c.font = { bold: true, color: { argb: "FFFFFFFF" } };
        c.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1F2937" },
        };
      });
      headerRow.height = 20;
      currentRow += 1;

      // Rows
      (group.transactions || []).forEach((t, i) => {
        groupedSheet.addRow({
          date: t.date ? new Date(t.date).toISOString().slice(0, 10) : "",
          vehicleNumber: t.vehicleNumber || "",
          driverName: t.driverName || "",
          netWeight: t.netWeight ?? "",
          numberOfBirds: t.numberOfBirds ?? "",
          rate: t.rate ?? "",
          totalAmount: t.totalAmount ?? "",
          amountPaid: t.amountPaid ?? "",
          balance: t.balance ?? "",
        });
        currentRow += 1;
      });

      currentRow += 2; // spacer between groups
    };

    report.groupedResults.forEach(addGroupSection);

    // Overall totals section at the end
    if (report.summary) {
      const sAll = report.summary;
      const startRow = currentRow + 1;
      groupedSheet.mergeCells(`A${startRow}:I${startRow}`);
      const header = groupedSheet.getCell(`A${startRow}`);
      header.value = `OVERALL TOTALS`;
      header.font = { bold: true, color: { argb: "FFFFFFFF" } };
      header.alignment = { vertical: "middle", horizontal: "left" };
      header.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF111827" },
      };
      groupedSheet.getRow(startRow).height = 20;

      const totals = [
        ["Transactions", sAll.totalTransactions ?? 0],
        ["Net Wt", sAll.totalNetWeight ?? 0],
        ["Amount", sAll.totalAmount ?? 0],
        ["Paid", sAll.totalPaid ?? 0],
        ["Balance", sAll.totalBalance ?? 0],
      ];
      let r = startRow + 1;
      totals.forEach(([k, v]) => {
        groupedSheet.mergeCells(`A${r}:B${r}`);
        groupedSheet.getCell(`A${r}`).value = k;
        groupedSheet.getCell(`A${r}`).font = { bold: true };
        groupedSheet.getCell(`C${r}`).value = Number(v);
        r += 1;
      });
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function toPdfStream(report, res) {
  const doc = new PDFDocument({ size: "A4", margin: 32, layout: "landscape" });
  // Pipe before writing
  doc.pipe(res);

  const title = report.reportTitle || "Report";
  const s = report.summary || {};

  // Banner and minimal badges (reduce banner height to free space)
  const bannerH = 28;
  const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  doc.save();
  doc.rect(doc.x, doc.y, pageW, bannerH).fill("#111827");
  doc
    .fill("#FFFFFF")
    .fontSize(16)
    .text(title, doc.x + 12, doc.y + 10);
  doc.restore();
  doc.moveDown();
  doc.fontSize(9).fillColor("#374151");
  const badges = [
    `From: ${report.dateRange?.from || s.dateRange?.from || ""}`,
    `To: ${report.dateRange?.to || s.dateRange?.to || ""}`,
    `Transactions: ${s.totalTransactions ?? 0}`,
    `Amount: ${Number(s.totalAmount || 0).toLocaleString("en-US")}`,
    `Paid: ${Number(s.totalPaid || 0).toLocaleString("en-US")}`,
    `Balance: ${Number(s.totalBalance || 0).toLocaleString("en-US")}`,
  ];
  let bx = doc.x;
  let by = doc.y + 6;
  badges.forEach((b) => {
    const w = doc.widthOfString(b) + 14;
    if (bx + w > doc.page.width - doc.page.margins.right) {
      bx = doc.x;
      by += 22;
    }
    doc.save();
    doc.roundedRect(bx, by, w, 18, 4).fill("#F3F4F6");
    doc.fill("#111827").text(b, bx + 7, by + 4);
    doc.restore();
    bx += w + 8;
  });
  doc.moveDown(2);

  doc.moveDown(0.75);
  doc.fontSize(12).fillColor("#111827").text("Transactions");
  doc.moveDown(0.25);

  // Table columns for transactions
  const columns = [
    { key: "group", label: "Group", width: 70 },
    { key: "date", label: "Date", width: 50 },
    { key: "vehicleNumber", label: "Vehicle", width: 55 },
    { key: "driverName", label: "Driver", width: 80 },
    { key: "buyerName", label: "Buyer", width: 90 },
    { key: "farmName", label: "Farm", width: 90 },
    { key: "netWeight", label: "Net Wt", width: 50 },
    { key: "numberOfBirds", label: "Birds", width: 40 },
    { key: "rate", label: "Rate", width: 50 },
    { key: "totalAmount", label: "Amount", width: 60 },
    { key: "amountPaid", label: "Paid", width: 60 },
    { key: "balance", label: "Balance", width: 60 },
  ];

  const startX = doc.page.margins.left;
  let y = doc.y;
  const rowHeight = 22;
  const pageBottom = doc.page.height - doc.page.margins.bottom;

  const drawHeader = () => {
    const totalWidth = columns.reduce((a, c) => a + c.width, 0);
    doc.save();
    doc.rect(startX, y, totalWidth, rowHeight).fill("#111827");
    let x = startX + 4;
    doc.fillColor("#FFFFFF").fontSize(9).font("Helvetica-Bold");
    columns.forEach((col) => {
      doc.text(col.label, x, y + 6, { width: col.width - 8, ellipsis: true });
      x += col.width;
    });
    doc.restore();
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
      doc.save();
      doc.rect(startX, y, totalWidth, rowHeight).fill("#FBFBFB");
      doc.restore();
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
      const align = [
        "rate",
        "totalAmount",
        "amountPaid",
        "balance",
        "netWeight",
        "numberOfBirds",
      ].includes(col.key)
        ? "right"
        : "left";
      doc.text(String(value), x, y + 5, {
        width: col.width - 8,
        align,
        ellipsis: true,
      });
      x += col.width;
    });
    y += rowHeight;
  };

  const renderGroupSection = (label, summary, txs) => {
    // Group header bar
    const totalWidth = columns.reduce((a, c) => a + c.width, 0);
    if (y + rowHeight > pageBottom) {
      doc.addPage();
      y = doc.y;
    }
    doc.save();
    doc.rect(startX, y, totalWidth, rowHeight).fill("#111827");
    doc
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(label, startX + 6, y + 5);
    doc.restore();
    y += rowHeight + 2;

    // Summary chips for this group
    const chips = [
      `Tx: ${summary?.totalTransactions ?? 0}`,
      `Net Wt: ${formatNum(summary?.totalNetWeight ?? 0)}`,
      `Amount: ${formatNum(summary?.totalAmount ?? 0)}`,
      `Paid: ${formatNum(summary?.totalPaid ?? 0)}`,
      `Balance: ${formatNum(summary?.totalBalance ?? 0)}`,
    ];
    let cx = startX;
    chips.forEach((c) => {
      const w = doc.widthOfString(c) + 12;
      if (cx + w > startX + totalWidth) {
        y += 18;
        cx = startX;
      }
      doc.save();
      doc.roundedRect(cx, y, w, 16, 3).fill("#F3F4F6");
      doc
        .fill("#111827")
        .fontSize(9)
        .text(c, cx + 6, y + 3);
      doc.restore();
      cx += w + 6;
    });
    y += 22;

    // Table header + rows for this group
    drawHeader();
    (txs || []).forEach((t, i) => {
      const row = {
        group: label,
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
      };
      drawRow(row, i % 2 === 1);
    });
    y += 10;
  };

  if (
    report.groupBy &&
    report.groupBy !== "none" &&
    report.groupedResults?.length
  ) {
    report.groupedResults.forEach((g) => {
      const label =
        g.groupInfo?.name ||
        g.groupInfo?.date ||
        g.groupInfo?.driverName ||
        g.groupInfo?.accountantName ||
        String(g.groupId || "");
      renderGroupSection(label, g.summary, g.transactions);
    });
    // Overall totals banner for PDF
    if (report.summary) {
      const totalWidth = columns.reduce((a, c) => a + c.width, 0);
      if (y + rowHeight > pageBottom) {
        doc.addPage();
        y = doc.y;
      }
      doc.save();
      doc.rect(startX, y, totalWidth, rowHeight).fill("#111827");
      doc
        .fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("OVERALL TOTALS", startX + 6, y + 5);
      doc.restore();
      y += rowHeight + 2;

      const sAll = report.summary;
      const chips = [
        `Tx: ${sAll.totalTransactions ?? 0}`,
        `Net Wt: ${formatNum(sAll.totalNetWeight ?? 0)}`,
        `Amount: ${formatNum(sAll.totalAmount ?? 0)}`,
        `Paid: ${formatNum(sAll.totalPaid ?? 0)}`,
        `Balance: ${formatNum(sAll.totalBalance ?? 0)}`,
      ];
      let cx = startX;
      chips.forEach((c) => {
        const w = doc.widthOfString(c) + 12;
        if (cx + w > startX + totalWidth) {
          y += 18;
          cx = startX;
        }
        doc.save();
        doc.roundedRect(cx, y, w, 16, 3).fill("#F3F4F6");
        doc
          .fill("#111827")
          .fontSize(9)
          .text(c, cx + 6, y + 3);
        doc.restore();
        cx += w + 6;
      });
      y += 20;
    }
  } else {
    drawHeader();
    (report.transactions || []).forEach((t, idx) => {
      drawRow(
        {
          group: "",
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
        },
        idx % 2 === 1
      );
    });
  }

  // Footer page stamp
  const pageW2 =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const addFooter = () => {
    const text = `Generated ${new Date().toISOString().slice(0, 10)} | Page ${
      doc.page.number
    }`;
    doc
      .fontSize(8)
      .fillColor("#9CA3AF")
      .text(
        text,
        doc.page.margins.left,
        doc.page.height - doc.page.margins.bottom + 6,
        { width: pageW2, align: "center" }
      );
  };
  addFooter();
  doc.on("pageAdded", addFooter);

  doc.end();
}
