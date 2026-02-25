/* =====================================================
   KPI DIGITAL ENABLEMENT
===================================================== */

document.addEventListener("DOMContentLoaded", async function(){

    try{

        const sheetName = "KPI_ENABLEMENT";
        const sheet = await getSheet(sheetName);

        if(!sheet || sheet.length === 0){
            console.log(`Sheet ${sheetName} kosong / tidak ditemukan`);
            return;
        }

        const row = sheet[0]; // Ambil baris pertama

        console.log("✅ DATA KPI_ENABLEMENT:", row);

        /* =========================
           PARSER ANGKA LOCALE INDO
        ========================= */

        function parseIndex(val){
            if(!val) return 0;

            return Number(
                val.toString()
                   .replace(",", ".")     // 3,52 → 3.52
                   .replace(/\s/g, "")    // Hapus spasi tersembunyi
            ) || 0;
        }

        /* =========================
           KEY FINDER (ANTI TYPO)
        ========================= */

        function findKey(keyword){
            return Object.keys(row).find(k =>
                k.toUpperCase().includes(keyword)
            );
        }

        const kepuasanKey = findKey("KEPUASAN");
        const pascaKey    = findKey("PASCA");

        console.log("🔎 KEY DETECTED:", kepuasanKey, pascaKey);

        if(!kepuasanKey || !pascaKey){
            console.log("❌ Kolom tidak ditemukan. HEADER SHEET:");
            console.log(Object.keys(row));
            return;
        }

        const kepuasan = parseIndex(row[kepuasanKey]);
        const pasca    = parseIndex(row[pascaKey]);

        console.log("📊 NILAI KPI:", kepuasan, pasca);

        /* =========================
           UPDATE UI
        ========================= */

        const elKepuasan = document.getElementById("kpiIndekskepuasan");
        const elPasca    = document.getElementById("kpiIndekspasca");

        if(elKepuasan){
            elKepuasan.innerText = kepuasan.toFixed(2);
            // Format Indo:
            // elKepuasan.innerText = kepuasan.toFixed(2).replace(".", ",");
        }

        if(elPasca){
            elPasca.innerText = pasca.toFixed(2);
            // Format Indo:
            // elPasca.innerText = pasca.toFixed(2).replace(".", ",");
        }

        console.log("✅ KPI Digital Enablement Updated");

    }catch(err){

        console.log("❌ ERROR KPI_ENABLEMENT:");
        console.log(err);

    }


});
/* =========================
   AUTH GUARD
========================= */

(function(){

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if(isLoggedIn !== "true"){
        window.location.href = "index.html";
    }

})();
function logout(){

    if(confirm("Yakin mau logout?")){
        localStorage.clear();
        window.location.href = "index.html";
    }
}
