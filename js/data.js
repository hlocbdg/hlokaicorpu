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
    const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
    const sheetName = 'Tabel1';
    const query = encodeURIComponent('Select A,B,C,D,E,F,G offset 1'); // Offset 1 untuk melewati header di sheet
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        // Parsing data gviz (membersihkan prefix JSON dari Google)
        const jsonData = JSON.parse(text.substr(47).slice(0, -2));
        const rows = jsonData.table.rows;
        const body = document.getElementById("tableBody");
        
        body.innerHTML = ""; // Bersihkan isi sebelumnya

        rows.forEach((rowData, index) => {
            const tr = document.createElement("tr");
            
            // Tambahkan class warna berdasarkan nama periode (A, B, C...)
            const periode = rowData.c[0] ? rowData.c[0].v : "";
            if (periode.includes("SM")) tr.className = "row-sm";
            if (periode == "2026") tr.className = "row-total";

            rowData.c.forEach((cell, i) => {
                const td = document.createElement("td");
                let value = cell ? (cell.f ? cell.f : cell.v) : "";
                
                // Jika cell null atau kosong
                if (value === null) value = "0";
                
                td.innerText = value;
                tr.appendChild(td);
            });
            body.appendChild(tr);
        });

    } catch (error) {
        console.error("Gagal mengambil data tabel:", error);
    }
}

// Panggil fungsi ini saat halaman dimuat
window.addEventListener('DOMContentLoaded', fetchSheetTable);
