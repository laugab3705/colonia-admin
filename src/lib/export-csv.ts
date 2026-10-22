export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) {
    alert("No hay registros para exportar con los filtros seleccionados");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(";"),
    ...rows.map((row) =>
      headers
        .map((header) => {
          let cell = row[header] ?? "";
          if (typeof cell === "string") {
            cell = '"' + cell.replace(/"/g, '""') + '"';
          }
          return cell;
        })
        .join(";")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename + "_" + new Date().toISOString().slice(0, 10) + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
