/* =====================================================
   KPI INSTRUKTUR
===================================================== */

(async function(){

const sheet = await getSheet("KPI_INSTRUKTUR");

if(!sheet || sheet.length === 0){
    console.log("Sheet KPI_INSTRUKTUR kosong");
    return;
}

/* =========================
   FORMAT ANGKA (K)
========================= */

function formatNumber(num){

    num = Number(num) || 0;

    if(num >= 1000){
        return (num / 1000).toFixed(1).replace(".0","") + " K";
    }

    return num.toString();
}

/* =========================
   LOOP DATA
========================= */

sheet.forEach(r => {

    const kategori = (r.KATEGORI || "").toUpperCase();
    const volume   = Number(r.VOLUME) || 0;

switch(kategori){

    case "DEDICATED HLO INSTRUCTOR":
        document.getElementById("kpiHLO").innerText = formatNumber(volume);
    break;

    case "DEDICATED NON-HLO INSTRUCTOR":
        document.getElementById("kpiNonHLO").innerText = formatNumber(volume);
    break;

    case "SME":
        document.getElementById("kpiSME").innerText = formatNumber(volume);
    break;

    case "EKSTERNAL":
        document.getElementById("kpiEksternal").innerText = formatNumber(volume);
    break;

    case "JUMLAH JP":
        document.getElementById("kpiJumlahJP").innerText = formatNumber(volume);
    break;

    }

});

})();

/* =====================================================
   JP INSTRUKTUR (3D + CHECKBOX FILTER)
===================================================== */

let jpInstrukturMaster = [];
let jpInstrukturChart  = null;

(async function(){

const sheet = await getSheet("JP_INSTRUKTUR");

if(!sheet || sheet.length === 0){
    console.log("Sheet JP_INSTRUKTUR kosong");
    return;
}

/* =========================
   FORMAT DATA
========================= */

jpInstrukturMaster = sheet.map(r => ({
    name: r.INSTRUKTUR,
    value: Number(r["JUMLAH JP"]) || 0
}));

// urutkan terbesar → terkecil
jpInstrukturMaster.sort((a,b)=> b.value - a.value);

renderJPInstrukturChart(jpInstrukturMaster);
buildJPCheckbox(jpInstrukturMaster);

})();
function renderJPInstrukturChart(data){

if(!data || data.length === 0) return;

if(jpInstrukturChart) jpInstrukturChart.destroy();

jpInstrukturChart = Highcharts.chart('jpInstrukturChart', {

    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        options3d: {
            enabled: true,
            alpha: 8,
            beta: 15,
            depth: 70,
            viewDistance: 25
        }
    },

    title: { text: null },

    xAxis: {
        categories: data.map(d=>d.name)
    },

    yAxis: {
        min:0,
        title:{ text:null },
        labels:{
            formatter:function(){
                return this.value >= 1000
                    ? (this.value/1000)+"K"
                    : this.value;
            }
        }
    },

    plotOptions:{
        column:{
            depth:35,
            dataLabels:{
                enabled:true,
                formatter:function(){
                    return this.y.toLocaleString("id-ID");
                }
            }
        }
    },

    tooltip:{
        formatter:function(){
            return "<b>"+this.key+"</b><br/>"+
                   this.y.toLocaleString("id-ID")+" JP";
        }
    },

    series:[{
        name:"JUMLAH JP",
        color:"#1f7f84",
        data:data.map(d=>d.value)
    }],

    credits:{ enabled:false }

});
}
function buildJPCheckbox(masterData){

const container = document.getElementById("checkboxContainerKategori");
const search    = document.getElementById("searchKategori");
const wrapper   = document.getElementById("checkboxKategori");
const selectBox = document.querySelector("#jpInstrukturFilter .select-box");

if(!container || !search || !wrapper || !selectBox){
    console.log("Checkbox element tidak ditemukan");
    return;
}

/* ===== Toggle dropdown ===== */

selectBox.addEventListener("click", function(e){
    e.stopPropagation();
    wrapper.style.display =
        wrapper.style.display === "block" ? "none" : "block";
});

/* ===== Close when click outside ===== */

document.addEventListener("click", function(e){
    if(!document.getElementById("jpInstrukturFilter").contains(e.target)){
        wrapper.style.display = "none";
    }
});

/* ===== Render list ===== */

function renderList(filterText=""){

    container.innerHTML = "";

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

        container.appendChild(label);
    });
}

renderList();

/* ===== Search ===== */

search.addEventListener("input", function(){
    renderList(this.value);
});

/* ===== Checkbox Change ===== */

wrapper.addEventListener("change", function(){

    const checked = [
        ...container.querySelectorAll("input[type=checkbox]:checked")
    ].map(cb=>cb.value);

    const filtered = jpInstrukturMaster.filter(d =>
        checked.includes(d.name)
    );

    renderJPInstrukturChart(filtered);
});

}


/* =====================================================
   JP TRAINER (3D HORIZONTAL)
===================================================== */

let jpTrainerMaster = [];
let jpTrainerChart  = null;

(async function(){

const sheet = await getSheet("JP_TRAINER");

if(!sheet || sheet.length === 0){
    console.log("Sheet JP_TRAINER kosong");
    return;
}

/* =========================
   FORMAT DATA
========================= */

jpTrainerMaster = sheet.map(r => ({
    name: r.NAMA,
    value: Number(r["JP TRAINER"]) || 0
}));

// urutkan terbesar → terkecil
jpTrainerMaster.sort((a,b)=> b.value - a.value);

renderJPTrainerChart(jpTrainerMaster);
buildTrainerCheckbox(jpTrainerMaster);

})();



/* =========================
   RENDER CHART
========================= */

function renderJPTrainerChart(data){

if(!data || data.length === 0) return;

if(jpTrainerChart) jpTrainerChart.destroy();

jpTrainerChart = Highcharts.chart('jpTrainerChart', {

    chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        options3d: {
            enabled: true,
            alpha: 5,
            beta: 5,
            depth: 50,
            viewDistance: 25
        }
    },

    title: { text: null },

    xAxis: {
        categories: data.map(d=>d.name),
        labels:{
            style:{ fontSize:"11px" }
        }
    },

    yAxis: {
        min:0,
        title:{ text:null },
        labels:{
            formatter:function(){
                return this.value >= 1000
                    ? (this.value/1000)+"K"
                    : this.value;
            }
        }
    },

    plotOptions:{
        series:{
            depth:35
        },
        bar:{
            dataLabels:{
                enabled:true,
                formatter:function(){
                    return this.y.toLocaleString("id-ID");
                }
            }
        }
    },

    tooltip:{
        formatter:function(){
            return "<b>"+this.key+"</b><br/>"+
                   this.y.toLocaleString("id-ID")+" JP";
        }
    },

    series:[{
        name:"JP TRAINER",
        color:"#9a9d22",
        data:data.map(d=>d.value)
    }],

    credits:{ enabled:false }

});

}
function buildTrainerCheckbox(masterData){

const container = document.getElementById("checkboxContainerTrainer");
const search    = document.getElementById("searchTrainer");
const wrapper   = document.getElementById("checkboxTrainer");
const selectBox = document.querySelector("#trainerFilter .select-box");

if(!container || !search || !wrapper || !selectBox){
    console.log("Checkbox Trainer element tidak ditemukan");
    return;
}

/* Toggle dropdown */

selectBox.addEventListener("click", function(e){
    e.stopPropagation();
    wrapper.style.display =
        wrapper.style.display === "block" ? "none" : "block";
});

/* Close when click outside */

document.addEventListener("click", function(e){
    if(!document.getElementById("trainerFilter").contains(e.target)){
        wrapper.style.display = "none";
    }
});

/* Render list */

function renderList(filterText=""){

    container.innerHTML = "";

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

        container.appendChild(label);
    });
}

renderList();

/* Search */

search.addEventListener("input", function(){
    renderList(this.value);
});

/* Checkbox change */

wrapper.addEventListener("change", function(){

    const checked = [
        ...container.querySelectorAll("input[type=checkbox]:checked")
    ].map(cb=>cb.value);

    const filtered = jpTrainerMaster.filter(d =>
        checked.includes(d.name)
    );

    renderJPTrainerChart(filtered);
});

}

