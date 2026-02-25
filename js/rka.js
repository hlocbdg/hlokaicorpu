document.addEventListener("DOMContentLoaded", async function(){

    const sheetName = typeof SHEET_KPI !== "undefined"
        ? SHEET_KPI
        : "RKA";

    const data = await getSheet(sheetName);

    if(!data || data.length === 0){
        console.warn("Sheet kosong / tidak terbaca");
        return;
    }

    const row = data[0];

    // ===============================
    // PARSE RUPIAH
    // ===============================
    function parseRupiah(value){
        if(!value) return 0;

        return Number(
            value
                .replace("Rp","")
                .replace(/,/g,"")
                .trim()
        );
    }

    // ===============================
    // FORMAT SHORT NUMBER
    // ===============================
    function formatShort(value){

        if(value >= 1_000_000_000){
            return (value / 1_000_000_000).toFixed(2) + "B";
        }

        if(value >= 1_000_000){
            return (value / 1_000_000).toFixed(2) + "M";
        }

        if(value >= 1_000){
            return (value / 1_000).toFixed(0) + "K";
        }

        return value.toString();
    }

    // ===============================
    // AMBIL DATA SHEET
    // ===============================
    const rka2025        = parseRupiah(row["RKA 2025"]);
    const rka2026        = parseRupiah(row["RKA 2026"]);
    const releaseBudget  = parseRupiah(row["RELEASE BUDGET"]);
    const consumedBudget = parseRupiah(row["CONSUMED BUDGET"]);
    const sisaAnggaran   = parseRupiah(row["SISA ANGGARAN"]);

    // ===============================
    // HITUNG PERSENTASE
    // ===============================

    // ✅ RKA 2026 vs RKA 2025
    let persenRka = 0;

    if(rka2025 > 0){
        persenRka = ((rka2026 - rka2025) / rka2025) * 100;
    }

    const persenRkaText =
        (persenRka >= 0 ? "+" : "") + persenRka.toFixed(1) + "%";


    // ✅ Release vs RKA 2026
    let persenRelease = 0;

    if(rka2026 > 0){
        persenRelease = (releaseBudget / rka2026) * 100;
    }

    const persenReleaseText = persenRelease.toFixed(2) + "%";


    // ✅ Consumed vs RKA 2026
    let persenConsumed = 0;

    if(rka2026 > 0){
        persenConsumed = (consumedBudget / rka2026) * 100;
    }

    const persenConsumedText = persenConsumed.toFixed(2) + "%";


    // ✅ Sisa vs RKA 2026
    let persenSisa = 0;

    if(rka2026 > 0){
        persenSisa = (sisaAnggaran / rka2026) * 100;
    }

    const persenSisaText = persenSisa.toFixed(2) + "%";

    // ===============================
    // SET KE KPI HTML
    // ===============================
    setText("rka2025", formatShort(rka2025));
    setText("rkaSoBaru", formatShort(rka2026));
    setText("rkaReleaseBudget", formatShort(releaseBudget));
    setText("rkaRealisasi", formatShort(consumedBudget));
    setText("rkaSisa", formatShort(sisaAnggaran));

    setText("rkaSoBaruPersen", persenRkaText);
    setText("rkaReleaseBudgetPersen", persenReleaseText);
    setText("rkaRealisasiPersen", persenConsumedText);
    setText("rkaSisaPersen", persenSisaText);

    // ===============================
    // HELPER ANTI ERROR
    // ===============================
    function setText(id, value){
        const el = document.getElementById(id);

        if(!el){
            console.warn("ID tidak ditemukan:", id);
            return;
        }

        el.innerText = value;
    }

    // ===============================
    // DEBUG (boleh hapus nanti)
    // ===============================
    console.log("DATA RKA:", {
        rka2025,
        rka2026,
        releaseBudget,
        consumedBudget,
        sisaAnggaran
    });

});


document.addEventListener("DOMContentLoaded", function(){



});

document.addEventListener("DOMContentLoaded", async function(){

    const donutData = await getSheet("DONUT_RKA");
    if(!donutData || donutData.length === 0) return;

    function parseRupiah(val){
        if(!val) return 0;
        return Number(val.toString().replace(/[^\d]/g,""));
    }

    // ==========================
    // DATA RKA 2025 (MASUK)
    // ==========================
    let rkaMto = 0;
    let tbMtMasuk = 0;
    let tbNonMtMasuk = 0;

    // ==========================
    // DATA CONSUMED (KELUAR)
    // ==========================
    let pelatihan = 0;
    let umum = 0;
    let tbOut = 0;

    donutData.forEach(r => {

        // ambil key dinamis (aman dari spasi)
        const keys = Object.keys(r);
        const keyRka    = keys.find(k => k.trim().toUpperCase() === "RKA");
        const keyMasuk  = keys.find(k => k.trim().toUpperCase() === "MASUK");
        const keyObjek  = keys.find(k => k.trim().toUpperCase() === "OBJEK PEMBIAYAAN");
        const keyNilai  = keys.find(k => k.trim().toUpperCase() === "NILAI");

        /* ===== DONUT MASUK ===== */
        if(keyRka && keyMasuk){
            const kategori = r[keyRka]?.toString().trim().toUpperCase();
            const masuk = parseRupiah(r[keyMasuk]);

            if(kategori === "RKA HLO") rkaMto = masuk;
            if(kategori === "TB MT") tbMtMasuk = masuk;
            if(kategori === "TB NON MT") tbNonMtMasuk = masuk;
        }

        /* ===== DONUT KELUAR ===== */
        if(keyObjek && keyNilai){
            const objek = r[keyObjek]?.toString().trim().toUpperCase();
            const nilai = parseRupiah(r[keyNilai]);

            if(objek.includes("PENDIDIKAN")) pelatihan = nilai;
            if(objek.includes("UMUM")) umum = nilai;
            if(objek.includes("TB OUT")) tbOut = nilai;
        }

    });

    /* =========================
       DONUT RKA 2025 (MASUK)
    ========================= */
Highcharts.chart("rkaDonut", {
    chart:{
        type:"pie",
        options3d:{ enabled:true, alpha:45 }
    },
    title:{ text:null },

    legend:{
        enabled:true,
        align:"right",
        verticalAlign:"middle",
        layout:"vertical",
        itemStyle:{
            fontWeight:"600",
            fontSize:"13px"
        }
    },
legend: {
    enabled: true,
    layout: "horizontal",      // 🔥 bikin berjajar
    align: "center",
    verticalAlign: "bottom"    // 🔥 turun ke bawah
},

    plotOptions:{
        pie:{
            innerSize:"65%",
            depth:45,
            showInLegend:true, // ⬅ ini penting
            dataLabels:{
                enabled:true,   // ⬅ persen tetap muncul
                format:"{point.percentage:.1f}%"
            }
        }
    },

    series:[{
        name:"RKA 2025",
        data:[
            { name:"TB MT", y:tbMtMasuk, color:"#3b82f6" },
            { name:"RKA HLO", y:rkaMto, color:"#f59e0b" },
            { name:"TB NON MT", y:tbNonMtMasuk, color:"#8b5cf6" }
        ]
    }],

    credits:{enabled:false}
});

    /* =========================
       DONUT CONSUMED BUDGET
    ========================= */
Highcharts.chart("consumedDonut", {
    chart:{
        type:"pie",
        options3d:{ enabled:true, alpha:45 }
    },
    title:{ text:null },

    legend:{
        enabled:true,
        align:"right",
        verticalAlign:"middle",
        layout:"vertical"
    },
legend: {
    enabled: true,
    layout: "horizontal",       // atau horizontal kalau mau bawah
    align: "center",
    verticalAlign: "bottom",
    itemStyle: {
        fontSize: "11px",     // 🔥 kecilkan di sini
        fontWeight: "500"
    }
},

    plotOptions:{
        pie:{
            innerSize:"65%",
            depth:45,
            showInLegend:true,
            dataLabels:{
                enabled:true,
                format:"{point.percentage:.1f}%"
            }
            
        }
    },

    series:[{
        name:"Consumed Budget",
        data:[
            { name:"TB OUT (MT & Non MT)", y:tbOut, color:"#3b82f6" },
            { name:"PENDIDIKAN", y:pelatihan, color:"#f59e0b" },
            { name:"UMUM, FASILITAS & LITBANG", y:umum, color:"#8b5cf6" }
        ]
    }],

    credits:{enabled:false}
});


});
async function renderBiayaChart(){

    const biayaData = await getSheet("PERBANDINGAN_BIAYA_PELATIHAN");
    if(!biayaData || biayaData.length === 0){
        console.log("Data biaya kosong");
        return;
    }

    function parseRupiah(val){
        if(!val) return 0;
        return Number(val.toString().replace(/[^\d]/g,""));
    }

    let temp = [];

    biayaData.forEach(r=>{

        // ambil key dinamis supaya aman dari spasi
        const keys = Object.keys(r);

        const keyTahun = keys.find(k =>
            k.trim().toUpperCase() === "TAHUN"
        );

        const keyBiaya = keys.find(k =>
            k.trim().toUpperCase() === "BIAYA PELATIHAN"
        );

        if(keyTahun && keyBiaya){
            temp.push({
                tahun: Number(r[keyTahun]),
                biaya: parseRupiah(r[keyBiaya])
            });
        }

    });

    if(temp.length === 0){
        console.log("Header sheet tidak cocok. Cek spasi di TAHUN / BIAYA PELATIHAN");
        return;
    }

    temp.sort((a,b)=>a.tahun-b.tahun);

    const categories = temp.map(d=>d.tahun);
    const values     = temp.map(d=>d.biaya);

    const maxValue   = Math.max(...values);
    const roundedMax = Math.ceil(maxValue / 1000000000) * 1000000000;
    const tickStep   = roundedMax / 5;

    Highcharts.chart("biayaChart",{

        chart:{
            type:"column",
            options3d:{
                enabled:true,
                alpha:25,
                beta:20,
                depth:100,
                viewDistance:35
            }
        },

        title:{ text:null },

        legend:{
            enabled:true,
            layout:"horizontal",
            align:"center",
            verticalAlign:"bottom"
        },

        xAxis:{
            categories:categories
        },

        yAxis:{
            min:0,
            max:roundedMax,
            tickInterval:tickStep,
            labels:{
                formatter:function(){
                    return Math.round(this.value/1000000000)+"B";
                }
            }
        },

        plotOptions:{
            column:{
                depth:60,
                groupZPadding:15
            }
        },

        tooltip:{
            formatter:function(){
                return "<b>"+this.y.toLocaleString("id-ID")+"</b>";
            }
        },

        series:[{
            name:"BIAYA PELATIHAN",
            data:values,
            color:"#1f7e8a"
        }],

        credits:{ enabled:false }
    });
}

document.addEventListener("DOMContentLoaded", renderBiayaChart);

/* =====================================================
   TB OUT (POS ANGGARAN) - 3D VERSION
===================================================== */

// helper number
function parseNumber(val){
    if(!val) return 0;
    if(typeof val === "number") return val;
    return Number(val.toString().replace(/[^\d]/g,"")) || 0;
}

let tbChart = null;
let tbMasterData = [];

document.addEventListener("DOMContentLoaded", async function(){

    const posData = await getSheet("POS_ANGGARAN");
    if(!posData || posData.length === 0) return;

    tbMasterData = [];

    posData.forEach(row => {

        const keys = Object.keys(row);

        const keyObjek = keys.find(k =>
            k.trim().toUpperCase() === "OBJEK PEMBIAYAAN"
        );

        const keyNilai = keys.find(k =>
            k.trim().toUpperCase() === "NILAI"
        );

        if(!keyObjek || !keyNilai) return;

        const objek = row[keyObjek];
        const nilai = parseNumber(row[keyNilai]);

        if(objek){
            tbMasterData.push({
                name: objek.toString().trim(),
                value: nilai,
                isTotal: objek.toString().trim().toUpperCase() === "GRAND TOTAL"
            });
        }
    });

    renderTbChart(tbMasterData);
    buildTbCheckbox(tbMasterData);
});


/* =====================================================
   RENDER CHART (3D)
===================================================== */

function renderTbChart(data){

    if(!data || data.length === 0) return;

    const sorted = [...data].sort((a,b)=>b.value - a.value);

    const maxValue   = Math.max(...sorted.map(d=>d.value));
    const roundedMax = Math.ceil(maxValue/1_000_000_000)*1_000_000_000;

    if(tbChart) tbChart.destroy();

    tbChart = Highcharts.chart("tbOutChart",{

        chart:{
            type:"column",
            backgroundColor:"transparent",
            height:650,
            options3d:{
                enabled:true,
                alpha:15,
                beta:20,
                depth:70,
                viewDistance:30
            }
        },

        title:{ text:null },

        legend:{
            enabled:true,
            align:"center",
            verticalAlign:"bottom"
        },

        xAxis:{
            categories: sorted.map(d=>d.name),
            labels:{ rotation:-45 }
        },

        yAxis:{
            min:0,
            max:roundedMax,
            tickInterval:roundedMax/5,
            labels:{
                formatter:function(){
                    return Math.round(this.value/1_000_000_000)+" B";
                }
            }
        },

        plotOptions:{
            column:{
                depth:50,
                borderRadius:6,
                dataLabels:{
                    enabled:true,
                    formatter:function(){
                        return (this.y/1_000_000_000).toFixed(1)+"B";
                    }
                }
            }
        },

        tooltip:{
            formatter:function(){
                return "<b>"+this.key+"</b><br/>Rp "+
                       Highcharts.numberFormat(this.y,0,",",".");
            }
        },

        series:[{
            name:"SUM of Nilai Transaksi",
            data: sorted.map(d=>({
                y:d.value,
                color: d.isTotal ? "#206709" : "#43a047"
            }))
        }],

        credits:{ enabled:false }
    });
}


/* =====================================================
   CHECKBOX + SEARCH
===================================================== */

function buildTbCheckbox(masterData){

    const container = document.getElementById("checkboxTb");
    if(!container) return;

    container.innerHTML = "";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.style.width = "100%";
    searchInput.style.marginBottom = "10px";
    searchInput.style.padding = "6px";
    searchInput.style.borderRadius = "6px";
    searchInput.style.border = "1px solid #ccc";

    container.appendChild(searchInput);

    const listWrapper = document.createElement("div");
    container.appendChild(listWrapper);

    function renderList(filterText=""){

        listWrapper.innerHTML = "";

        masterData
            .filter(item =>
                item.name.toLowerCase().includes(filterText.toLowerCase())
            )
            .forEach(item=>{

                const label = document.createElement("label");
                label.style.display="block";

                label.innerHTML = `
                    <input type="checkbox" value="${item.name}" checked>
                    ${item.name}
                `;

                listWrapper.appendChild(label);
            });
    }

    renderList();

    searchInput.addEventListener("input", function(){
        renderList(this.value);
    });

    container.addEventListener("change",function(){

        const checked = [...container.querySelectorAll("input[type='checkbox']:checked")]
            .map(cb=>cb.value);

        const filtered = masterData.filter(d =>
            checked.includes(d.name)
        );

        renderTbChart(filtered);
    });
}


/* =====================================================
   DROPDOWN TOGGLE
===================================================== */

document.addEventListener("DOMContentLoaded", function(){

    const selectBox = document.querySelector("#tbFilter .select-box");
    const checkboxList = document.querySelector("#tbFilter .checkbox-list");

    if(!selectBox || !checkboxList) return;

    selectBox.addEventListener("click", function(e){
        e.stopPropagation();
        checkboxList.style.display =
            checkboxList.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function(){
        checkboxList.style.display = "none";
    });

    checkboxList.addEventListener("click", function(e){
        e.stopPropagation();
    });

});


/* =====================================================
   DETAIL PENDIDIKAN (URAIAN_BIAYA) - 3D VERSION
===================================================== */

let pendidikanChart = null;
let pendidikanMasterData = [];

// helper
function parseNumber(val){
    if(!val) return 0;
    if(typeof val === "number") return val;
    return Number(val.toString().replace(/[^\d-]/g,"")) || 0;
}

document.addEventListener("DOMContentLoaded", async function(){

    const sheetData = await getSheet("DETAIL_PEND");
    if(!sheetData || sheetData.length === 0){
        console.log("Sheet DETAIL_PEND kosong");
        return;
    }

    pendidikanMasterData = [];

    sheetData.forEach(row => {

        const keys = Object.keys(row);

        const keyUraian = keys.find(k =>
            k.trim().toUpperCase() === "URAIAN BIAYA"
        );

        const keyNilai = keys.find(k =>
            k.trim().toUpperCase().includes("CONSUMED")
        );

        if(!keyUraian || !keyNilai) return;

        const uraian = row[keyUraian]?.toString().trim();
        const nilai  = parseNumber(row[keyNilai]);

        if(!uraian) return;

        pendidikanMasterData.push({
            name: uraian,
            value: nilai
        });
    });

    pendidikanMasterData.sort((a,b)=>b.value - a.value);

    renderPendidikanChart(pendidikanMasterData);
    buildPendidikanCheckbox(pendidikanMasterData);
});


/* =====================================================
   RENDER CHART (3D)
===================================================== */

function renderPendidikanChart(data){

    if(!data || data.length === 0){
        if(pendidikanChart) pendidikanChart.destroy();
        return;
    }

    const maxValue   = Math.max(...data.map(d=>d.value));
    const roundedMax = Math.ceil(maxValue/100_000_000)*100_000_000;

    if(pendidikanChart) pendidikanChart.destroy();

    pendidikanChart = Highcharts.chart("pendidikanChart",{

        chart:{
            type:"column",
            backgroundColor:"transparent",
            height:650,
            marginBottom:250,
            options3d:{
                enabled:true,
                alpha:15,
                beta:20,
                depth:70,
                viewDistance:30
            }
        },

        title:{ text:null },

        legend:{
            enabled:true,
            layout:"horizontal",
            align:"center",
            verticalAlign:"bottom"
        },

        xAxis:{
            categories:data.map(d=>d.name),
            labels:{
                rotation:-45,
                style:{ fontSize:"11px" }
            }
        },

        yAxis:{
            min:0,
            max:roundedMax,
            tickInterval:roundedMax/5,
            labels:{
                formatter:function(){
                    return Math.round(this.value/1_000_000)+" M";
                }
            }
        },

        plotOptions:{
            column:{
                depth:50,
                borderRadius:6,
                dataLabels:{
                    enabled:false
                }
            }
        },

        tooltip:{
            formatter:function(){
                return "<b>"+this.key+"</b><br/>Rp "+
                       Highcharts.numberFormat(this.y,0,",",".");
            }
        },

        series:[{
            name:"SUM of Consumed Budget",
            color:"#f2994a",
            data:data.map(d=>d.value)
        }],

        credits:{ enabled:false }
    });
}


/* =====================================================
   BUILD CHECKBOX + SEARCH
===================================================== */

function buildPendidikanCheckbox(masterData){

    const container = document.getElementById("checkboxPendidikan");
    if(!container) return;

    container.innerHTML = "";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search program...";
    searchInput.style.width = "100%";
    searchInput.style.padding = "6px";
    searchInput.style.marginBottom = "10px";
    searchInput.style.border = "1px solid #ddd";
    searchInput.style.borderRadius = "6px";

    container.appendChild(searchInput);

    const listWrapper = document.createElement("div");
    container.appendChild(listWrapper);

    function renderList(filterText=""){

        listWrapper.innerHTML = "";

        masterData
        .filter(item =>
            item.name.toLowerCase().includes(filterText.toLowerCase())
        )
        .forEach(item=>{

            const label = document.createElement("label");
            label.style.display = "block";
            label.style.marginBottom = "6px";

            label.innerHTML = `
                <input type="checkbox" value="${item.name}" checked>
                ${item.name}
            `;

            listWrapper.appendChild(label);
        });
    }

    renderList();

    searchInput.addEventListener("input", function(){
        renderList(this.value);
    });

    container.addEventListener("change", function(){

        const checked = [
            ...container.querySelectorAll("input[type=checkbox]:checked")
        ].map(cb=>cb.value);

        const filtered = pendidikanMasterData.filter(d =>
            checked.includes(d.name)
        );

        renderPendidikanChart(filtered);
    });
}


/* =====================================================
   DROPDOWN TOGGLE
===================================================== */

document.addEventListener("DOMContentLoaded", function(){

    const pendidikanFilter = document.getElementById("pendidikanFilter");
    if(!pendidikanFilter) return;

    const selectBox = pendidikanFilter.querySelector(".select-box");
    const checkboxList = pendidikanFilter.querySelector(".checkbox-list");

    if(!selectBox || !checkboxList) return;

    selectBox.addEventListener("click", function(e){
        e.stopPropagation();
        checkboxList.style.display =
            checkboxList.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function(){
        checkboxList.style.display = "none";
    });

    checkboxList.addEventListener("click", function(e){
        e.stopPropagation();
    });

});


/* =====================================================
   DETAIL FASUM (DETAIL_FAS) - 3D VERSION
===================================================== */

let fasumChart = null;
let fasumMasterData = [];

// helper rupiah
function parseNumber(val){
    if(!val) return 0;
    if(typeof val === "number") return val;
    return Number(val.toString().replace(/[^\d-]/g,"")) || 0;
}

document.addEventListener("DOMContentLoaded", async function(){

    const sheetData = await getSheet("DETAIL_FAS");
    if(!sheetData || sheetData.length === 0){
        console.log("Sheet DETAIL_FAS kosong");
        return;
    }

    fasumMasterData = [];

    sheetData.forEach(row => {

        const keys = Object.keys(row);

        const keyPos = keys.find(k =>
            k.trim().toUpperCase() === "POS ANGGARAN"
        );

        const keyNilai = keys.find(k =>
            k.trim().toUpperCase().includes("CONSUMED")
        );

        if(!keyPos || !keyNilai) return;

        const pos   = row[keyPos]?.toString().trim();
        const nilai = parseNumber(row[keyNilai]);

        if(!pos) return;

        fasumMasterData.push({
            name: pos,
            value: nilai
        });
    });

    // urut terbesar
    fasumMasterData.sort((a,b)=>b.value - a.value);

    renderFasumChart(fasumMasterData);
    buildFasumCheckbox(fasumMasterData);
});

function renderFasumChart(data){

    if(!data || data.length === 0){
        if(fasumChart) fasumChart.destroy();
        return;
    }

    const maxValue   = Math.max(...data.map(d=>d.value));
    const roundedMax = Math.ceil(maxValue/100_000_000)*100_000_000;

    if(fasumChart) fasumChart.destroy();

    fasumChart = Highcharts.chart("fasumChart",{

        chart:{
            type:"column",
            backgroundColor:"transparent",
            height:650,
            options3d:{
                enabled:true,
                alpha:15,
                beta:20,
                depth:70,
                viewDistance:30
            }
        },

        title:{ text:null },

        legend:{
            enabled:true,
            layout:"horizontal",
            align:"center",
            verticalAlign:"bottom"
        },

        xAxis:{
            categories:data.map(d=>d.name),
            labels:{
                rotation:-45,
                style:{ fontSize:"11px" }
            }
        },

        yAxis:{
            min:0,
            max:roundedMax,
            tickInterval:roundedMax/5,
            labels:{
                formatter:function(){
                    if(this.value >= 1_000_000_000){
                        return (this.value/1_000_000_000)+" B";
                    }
                    return (this.value/1_000_000)+" M";
                }
            }
        },

        plotOptions:{
            column:{
                depth:50
            }
        },

        tooltip:{
            formatter:function(){
                return "<b>"+this.key+"</b><br/>Rp "+
                       Highcharts.numberFormat(this.y,0,",",".");
            }
        },

        series:[{
            name:"SUM of Consumed Budget",
            color:"#4f83e3",
            data:data.map(d=>d.value)
        }],

        credits:{ enabled:false }
    });
}

function buildFasumCheckbox(masterData){

    const container = document.getElementById("checkboxFasum");
    if(!container) return;

    container.innerHTML = "";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.style.width = "100%";
    searchInput.style.padding = "6px";
    searchInput.style.marginBottom = "10px";
    searchInput.style.border = "1px solid #ddd";
    searchInput.style.borderRadius = "6px";

    container.appendChild(searchInput);

    const listWrapper = document.createElement("div");
    container.appendChild(listWrapper);

    function renderList(filterText=""){

        listWrapper.innerHTML = "";

        masterData
        .filter(item =>
            item.name.toLowerCase().includes(filterText.toLowerCase())
        )
        .forEach(item=>{

            const label = document.createElement("label");

            label.innerHTML = `
                <input type="checkbox" value="${item.name}" checked>
                ${item.name}
            `;

            listWrapper.appendChild(label);
        });
    }

    renderList();

    searchInput.addEventListener("input", function(){
        renderList(this.value);
    });

    container.addEventListener("change", function(){

        const checked = [
            ...container.querySelectorAll("input[type=checkbox]:checked")
        ].map(cb=>cb.value);

        const filtered = fasumMasterData.filter(d =>
            checked.includes(d.name)
        );

        renderFasumChart(filtered);
    });
}

document.addEventListener("DOMContentLoaded", function(){

    const fasumFilter = document.getElementById("fasumFilter");
    if(!fasumFilter) return;

    const selectBox = fasumFilter.querySelector(".select-box");
    const checkboxList = fasumFilter.querySelector(".checkbox-list");

    if(!selectBox || !checkboxList) return;

    selectBox.addEventListener("click", function(e){
        e.stopPropagation();
        checkboxList.style.display =
            checkboxList.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function(){
        checkboxList.style.display = "none";
    });

    checkboxList.addEventListener("click", function(e){
        e.stopPropagation();
    });

});

/* =====================================================
   PROGNOSA RKA (DETAIL_PRROGNOSA) - 3D
===================================================== */

let prognosaChart = null;
let prognosaMasterData = [];
document.addEventListener("DOMContentLoaded", async function(){

    const sheetData = await getSheet("DETAIL_PROGNOSA");
    if(!sheetData || sheetData.length === 0){
        console.log("Sheet DETAIL_PROGNOSA kosong");
        return;
    }

    prognosaMasterData = [];

    sheetData.forEach(row => {

        const keys = Object.keys(row);

        const keyObjek = keys.find(k =>
            k.trim().toUpperCase().includes("OBJEK")
        );

        const keyPrognosa = keys.find(k =>
            k.trim().toUpperCase() === "PROGNOSA"
        );

        const keyProgram = keys.find(k =>
            k.trim().toUpperCase() === "PROGRAM"
        );

        const keyConsumed = keys.find(k =>
            k.trim().toUpperCase().includes("CONSUMED")
        );

        const keySisa = keys.find(k =>
            k.trim().toUpperCase().includes("SISA")
        );

        if(!keyObjek) return;

        prognosaMasterData.push({
            name: row[keyObjek],
            prognosa: parseNumber(row[keyPrognosa]),
            program: parseNumber(row[keyProgram]),
            consumed: parseNumber(row[keyConsumed]),
            sisa: parseNumber(row[keySisa])
        });
    });

    renderPrognosaChart(prognosaMasterData);
    buildPrognosaCheckbox(prognosaMasterData);
});

function renderPrognosaChart(data){

    if(!data || data.length === 0) return;

    if(prognosaChart) prognosaChart.destroy();

    prognosaChart = Highcharts.chart("prognosaChart",{

        chart:{
            type:"bar",
            backgroundColor:"transparent",
            height:550,
            options3d:{
                enabled:true,
                alpha:10,
                beta:15,
                depth:50,
                viewDistance:25
            }
        },

        title:{ text:null },

        legend:{
            layout:"horizontal",
            align:"center",
            verticalAlign:"top"
        },

        xAxis:{
            categories:data.map(d=>d.name)
        },

        yAxis:{
            min:0,
            labels:{
                formatter:function(){
                    return (this.value/1_000_000_000)+" B";
                }
            }
        },

        plotOptions:{
            bar:{ depth:40 }
        },

        tooltip:{
            formatter:function(){
                return "<b>"+this.series.name+"</b><br/>"+
                       this.category+"<br/>Rp "+
                       Highcharts.numberFormat(this.y,0,",",".");
            }
        },

        series:[
            {
                name:"prognosa",
                data:data.map(d=>d.prognosa),
                color:"#4f83e3"
            },
            {
                name:"program",
                data:data.map(d=>d.program),
                color:"#f2994a"
            },
            {
                name:"consumed (per today)",
                data:data.map(d=>d.consumed),
                color:"#9b59b6"
            },
            {
                name:"sisa akhir tahun",
                data:data.map(d=>d.sisa),
                color:"#a3c74f"
            }
        ],

        credits:{ enabled:false }
    });
}

function buildPrognosaCheckbox(masterData){

    const container = document.getElementById("checkboxPrognosa");
    if(!container) return;

    container.innerHTML = "";

    // SEARCH
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.style.width = "100%";
    searchInput.style.padding = "6px";
    searchInput.style.marginBottom = "10px";
    searchInput.style.border = "1px solid #ddd";
    searchInput.style.borderRadius = "6px";

    container.appendChild(searchInput);

    const listWrapper = document.createElement("div");
    container.appendChild(listWrapper);

    function renderList(filterText=""){

        listWrapper.innerHTML = "";

        masterData
        .filter(item =>
            item.name.toLowerCase().includes(filterText.toLowerCase())
        )
        .forEach(item=>{

            const label = document.createElement("label");

            label.innerHTML = `
                <input type="checkbox" value="${item.name}" checked>
                ${item.name}
            `;

            listWrapper.appendChild(label);
        });
    }

    renderList();

    // search handler
    searchInput.addEventListener("input", function(){
        renderList(this.value);
    });

    // checkbox change
    container.addEventListener("change", function(){

        const checked = [
            ...container.querySelectorAll("input[type=checkbox]:checked")
        ].map(cb=>cb.value);

        const filtered = prognosaMasterData.filter(d =>
            checked.includes(d.name)
        );

        renderPrognosaChart(filtered);
    });
}
document.addEventListener("DOMContentLoaded", function(){

    const prognosaFilter = document.getElementById("prognosaFilter");
    if(!prognosaFilter) return;

    const selectBox = prognosaFilter.querySelector(".select-box");
    const checkboxList = prognosaFilter.querySelector(".checkbox-list");

    selectBox.addEventListener("click", function(e){
        e.stopPropagation();
        checkboxList.style.display =
            checkboxList.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function(){
        checkboxList.style.display = "none";
    });

    checkboxList.addEventListener("click", function(e){
        e.stopPropagation();
    });

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
