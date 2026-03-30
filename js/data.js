/* ===============================
   KONFIGURASI GOOGLE SHEETS
================================ */
const SHEET_ID = '1xMH0j64DpXi2M-Q10M_ERVhlzmjP26zZRVrUzoEy17Q';

/* ===============================
   FUNGSI AMBIL DATA DARI SHEET
================================ */
async function getSheet(sheetName){
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheetName}`;
  const res = await fetch(url);

  if(!res.ok){
    throw new Error(`Gagal ambil data sheet: ${sheetName}`);
  }

  return await res.json();
}

/* ===============================
   TOGGLE SIDEBAR
================================ */
function toggleSidebar(){
  document.querySelector('.sidebar').classList.toggle('collapsed');
  document.querySelector('.main').classList.toggle('collapsed');
}

/* =========================
   tabel tw
========================= */
async function fetchSheetTable() {
    const sheetID = '1Wuw7mdvowQ8kRH2hbTzcpoBKBkktl3ADOq1iftSoVkY';
    const sheetName = 'Tabel1';
    
    // Range A3:G9 sesuai gambar terbaru (A3 = TW I)
    // &headers=0 sangat penting agar baris pertama tidak dianggap judul kolom
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}&range=A3:G9&headers=0`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
        const jsonData = JSON.parse(jsonText);
        const rows = jsonData.table.rows;
        
        const body = document.getElementById("tableBody");
        if (!body) return;
        body.innerHTML = ""; 

        rows.forEach((rowData) => {
            if (!rowData.c) return;

            const tr = document.createElement("tr");
            
            // Ambil kolom Periode (A)
            const periode = rowData.c[0] ? (rowData.c[0].f || rowData.c[0].v || "").toString().trim() : "";
            
            // Validasi: Jika periode kosong, jangan tampilkan baris
            if (periode === "") return;

            // Pewarnaan baris otomatis
            if (periode.includes("SM 1")) tr.style.backgroundColor = "#d9e7fd";
            if (periode.includes("SM 2")) tr.style.backgroundColor = "#e0f2f1";
            if (periode === "2026") tr.style.backgroundColor = "#d1c4e9";

            rowData.c.forEach((cell) => {
                const td = document.createElement("td");
                // Menampilkan formatted value (misal: 90,00%)
                td.innerText = cell ? (cell.f ? cell.f : (cell.v !== null ? cell.v : "")) : "";
                tr.appendChild(td);
            });
            
            body.appendChild(tr);
        });
        console.log("Data tabel berhasil dirender.");
    } catch (error) {
        console.error("Data gagal muncul:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchSheetTable);
