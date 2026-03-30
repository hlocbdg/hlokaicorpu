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
    
    // RANGE DISESUAIKAN: A3 sampai G9 (sesuai gambar table 1.png)
    // headers=0 agar TW I tidak hilang
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
            if (!rowData.c || !rowData.c[0]) return;

            const tr = document.createElement("tr");
            
            // Ambil kolom A (Index 0) untuk teks Periode
            const periode = rowData.c[0] ? (rowData.c[0].f || rowData.c[0].v || "") : "";
            
            // Saring jika ada baris kosong yang tidak sengaja terambil
            if (periode.trim() === "") return;

            // Tambahkan class warna sesuai format gambar
            if (String(periode).includes("SM 1")) tr.style.backgroundColor = "#d9e7fd"; // Biru
            if (String(periode).includes("SM 2")) tr.style.backgroundColor = "#e0f2f1"; // Hijau Mint
            if (String(periode) === "2026") tr.style.backgroundColor = "#d1c4e9";      // Ungu

            rowData.c.forEach((cell) => {
                const td = document.createElement("td");
                // Gunakan f (formatted value) untuk mempertahankan format % dan ribuan
                td.innerText = cell ? (cell.f ? cell.f : (cell.v !== null ? cell.v : "")) : "";
                tr.appendChild(td);
            });
            
            body.appendChild(tr);
        });
        console.log("Data tabel berhasil dimuat dari A3:G9");
    } catch (error) {
        console.error("Gagal sinkronisasi data tabel:", error);
    }
}
