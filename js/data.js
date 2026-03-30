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
    
    // PERUBAHAN: Range dimulai dari A3 agar TW I (baris 4) terbaca sebagai DATA
    // &headers=0 memastikan Google tidak memakan baris pertama sebagai header
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}&range=A3:G10&headers=0`;

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

            // Ambil kolom A (Index 0)
            const periode = rowData.c[0] ? (rowData.c[0].f || rowData.c[0].v || "") : "";

            // Lewati baris jika isinya kata "PERIODE", "program", atau kosong
            // Ini untuk menyaring sisa-sisa header baris 3 yang ikut terbawa
            if (!periode || periode === "PERIODE" || periode === "program") return;

            const tr = document.createElement("tr");
            
            // Penentuan Warna Baris
            if (String(periode).includes("SM")) tr.className = "row-sm";
            if (String(periode) === "2026") tr.className = "row-total";

            rowData.c.forEach((cell) => {
                const td = document.createElement("td");
                // Gunakan .f agar format persen dan angka ribuan sama dengan Excel
                td.innerText = cell ? (cell.f ? cell.f : (cell.v !== null ? cell.v : "")) : "";
                tr.appendChild(td);
            });
            
            body.appendChild(tr);
        });
    } catch (error) {
        console.error("Gagal memuat TW I:", error);
    }
}
