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
