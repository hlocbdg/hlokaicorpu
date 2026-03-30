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
    
    // Range A4:G10 sesuai gambar cell.png (Isi data TW I sampai 2026)
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}&range=A4:G10`;

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
            // Pastikan data baris ada
            if (!rowData.c || rowData.c.length === 0) return;

            const tr = document.createElement("tr");
            
            // Ambil kolom A (Index 0) untuk deteksi baris berwarna
            const periode = rowData.c[0] ? (rowData.c[0].f || rowData.c[0].v || "") : "";
            
            // Tambahkan class berdasarkan konten periode
            if (String(periode).includes("SM")) tr.className = "row-sm";
            if (String(periode) === "2026") tr.className = "row-total";

            rowData.c.forEach((cell) => {
                const td = document.createElement("td");
                // Gunakan .f (Formatted) agar angka persen (90,00%) muncul sesuai di spreadsheet
                td.innerText = cell ? (cell.f ? cell.f : (cell.v !== null ? cell.v : "")) : "";
                tr.appendChild(td);
            });
            
            body.appendChild(tr);
        });
    } catch (error) {
        console.error("Gagal memproses urutan data:", error);
    }
}
