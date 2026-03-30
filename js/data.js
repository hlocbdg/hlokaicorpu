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
// Ganti fungsi ambil data tabel yang lama dengan ini:
async function fetchSheetTable() {
    const sheetID = '1Wuw7mdvowQ8kRH2hbTzcpoBKBkktl3ADOq1iftSoVkY'; // Pastikan ID ini benar
    const sheetName = 'Tabel1'; // Pastikan Nama Sheet benar
    
    // Gviz Query untuk mengambil A-G, dan OFFSET 1 untuk melewati header di sheet
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}&tq=SELECT%20A,B,C,D,E,F,G%20OFFSET%201`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        
        // Bersihkan prefix JSON dari Google visualization
        const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
        const jsonData = JSON.parse(jsonText);
        const rows = jsonData.table.rows;
        const body = document.getElementById("tableBody");
        
        if (!body) return;
        body.innerHTML = ""; // Bersihkan isi tabel sebelumnya

        // Loop Baris Data
        rows.forEach((rowData) => {
            const tr = document.createElement("tr");
            
            // 1. Ambil Nama Periode (Kolom A / index 0)
            const periodeCell = rowData.c[0];
            const periode = periodeCell ? (periodeCell.v || "") : "";
            
            // 2. Beri Class Warna berdasarkan Nama Periode
            if (String(periode).includes("SM")) tr.classList.add("row-sm");
            if (String(periode) === "2026") tr.classList.add("row-total");

            // 3. Loop Kolom Data (A sampai G / index 0 sampai 6)
            rowData.c.forEach((cell) => {
                const td = document.createElement("td");
                // Menampilkan data yang diformat (.f) atau nilai asli (.v)
                td.innerText = cell ? (cell.f ? cell.f : (cell.v !== null ? cell.v : "0")) : "0";
                tr.appendChild(td);
            });
            body.appendChild(tr);
        });

    } catch (error) {
        console.error("Gagal mengambil data tabel:", error);
    }
}

// Pastikan fungsi dipanggil saat halaman siap
window.addEventListener('DOMContentLoaded', fetchSheetTable);
