(async function(){

/* =========================
   HELPER FORMAT ANGKA
==========================*/

function formatNumberShort(num){

  num = Number(num) || 0;

  if(num >= 1000){
    return (num / 1000).toFixed(1).replace(".0","") + " K";
  }

  return num.toString();
}


/* =========================
   KPI DIKLAP
==========================*/

const sheetName = "KPI_DIKLAP";
const data = await getSheet(sheetName);

if(!data || data.length === 0){
  console.log("Sheet KPI_DIKLAP kosong");
  return;
}

data.forEach(r => {

  const kategori = (r.KATEGORI || "").toString().trim().toUpperCase();
  const program = Number(r.PROGRAM || 0);
  const realisasi = Number(r.REALISASI || 0);
  const persen = program > 0 
      ? ((realisasi / program) * 100).toFixed(0) + "%" 
      : "0%";


  /* ================= DIKLAP ================= */

  if(kategori === "DIKLAP"){

    if(document.getElementById("kpiProgramDiklap")){
      document.getElementById("kpiProgramDiklap").innerText =
        formatNumberShort(program);
    }

    if(document.getElementById("kpiRealisasiDiklap")){
      document.getElementById("kpiRealisasiDiklap").innerText =
        formatNumberShort(realisasi);
    }

    if(document.getElementById("kpiPersenDiklap")){
      document.getElementById("kpiPersenDiklap").innerText = persen;
    }
  }


  /* ================= PESERTA ================= */

  if(kategori === "PESERTA"){

    if(document.getElementById("kpiProgramPesertaDiklap")){
      document.getElementById("kpiProgramPesertaDiklap").innerText =
        formatNumberShort(program);
    }

    if(document.getElementById("kpiRealisasiPesertaDiklap")){
      document.getElementById("kpiRealisasiPesertaDiklap").innerText =
        formatNumberShort(realisasi);
    }

    if(document.getElementById("kpiPersenPesertaDiklap")){
      document.getElementById("kpiPersenPesertaDiklap").innerText = persen;
    }
  }

});

})();
(async function(){

const sheet = await getSheet("CHART_DIKLAP");

if(!sheet || sheet.length === 0){
    console.log("Sheet CHART_DIKLAP kosong");
    return;
}

const row = sheet[0];
const keys = Object.keys(row);

/*
Struktur sheet:

A  PELATIHAN VOL
B  MANDATORY
C  NON MANDATORY
D  (kosong)
E  PELATIHAN
F  MANDATORY
G  NON MANDATORY
*/

// ambil berdasarkan INDEX KOLOM ASLI
const volMandatory      = Number(row[keys[1]]) || 0; // kolom B
const volNonMandatory   = Number(row[keys[2]]) || 0; // kolom C
const pesertaMandatory  = Number(row[keys[5]]) || 0; // kolom F
const pesertaNonMandatory = Number(row[keys[6]]) || 0; // kolom G


/* =========================
   CHART VOL (3D)
========================= */

Highcharts.chart('mandatoryChart', {
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 15,
            depth: 70
        }
    },

    title: { text: null },

    xAxis: {
        categories: ['VOL']
    },

    yAxis: {
        min: 0,
        title: { text: null }
    },

    plotOptions: {
        column: {
            depth: 45,
            borderRadius: 6,
            dataLabels: {
                enabled: true
            }
        }
    },

    series: [
        {
            name: 'MANDATORY',
            color: '#1f7f84',
            data: [volMandatory]
        },
        {
            name: 'NON MANDATORY',
            color: '#d6dbc0',
            data: [volNonMandatory]
        }
    ],

    credits: { enabled:false }
});


/* =========================
   CHART PESERTA (3D)
========================= */

Highcharts.chart('pesertaDiklapChart', {
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 15,
            depth: 70
        }
    },

    title: { text: null },

    xAxis: {
        categories: ['PESERTA']
    },

    yAxis: {
        min: 0,
        title: { text: null }
    },

    plotOptions: {
        column: {
            depth: 45,
            borderRadius: 6,
            dataLabels: {
                enabled: true,
                formatter: function(){
                    return this.y.toLocaleString('id-ID');
                }
            }
        }
    },

    series: [
        {
            name: 'MANDATORY',
            color: '#4c9aa5',
            data: [pesertaMandatory]
        },
        {
            name: 'NON MANDATORY',
            color: '#1f7f84',
            data: [pesertaNonMandatory]
        }
    ],

    credits: { enabled:false }
});

})();
/* =====================================================
   DETAIL DIKLAP (AUTO HEIGHT + SEARCH FIX)
===================================================== */

let detailDiklapMaster = [];
let detailDiklapChart  = null;

document.addEventListener("DOMContentLoaded", async function(){

    const sheet = await getSheet("DETAIL_DIKLAP");

    if(!sheet || sheet.length === 0){
        console.log("Sheet DETAIL_DIKLAP kosong");
        return;
    }

    detailDiklapMaster = sheet
        .map(r => ({
            name: r.diklap?.toString().trim(),
            total: Number(r.total) || 0,
            mandatory: Number(r.mandatory) || 0,
            nonmandatory: Number(r["non mandatory"]) || 0
        }))
        .filter(d => d.name && d.total > 0)
        .sort((a,b)=> b.total - a.total);

    renderDetailChart(detailDiklapMaster);
    buildDetailCheckbox(detailDiklapMaster);
});


/* =====================================================
   RENDER CHART (AUTO HEIGHT)
===================================================== */

function renderDetailChart(data){

    if(!data || data.length === 0) return;

    if(detailDiklapChart) detailDiklapChart.destroy();

    // 🔥 AUTO HEIGHT
    const dynamicHeight = (data.length * 45) + 200;

    detailDiklapChart = Highcharts.chart('detailDiklapChart', {

        chart:{
            type:"bar",
            backgroundColor:"transparent",
            height: dynamicHeight,
            spacingLeft:80,
            spacingRight:120,
            options3d:{
                enabled:true,
                alpha:8,
                beta:10,
                depth:40,
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
            title:{ text:null }
        },

        plotOptions:{
            bar:{
                depth:35,
                grouping:true,
                groupPadding:0.25,
                pointPadding:0.15,
                dataLabels:{
                    enabled:true,
                    formatter:function(){
                        return this.y;
                    }
                }
            }
        },

        tooltip:{
            formatter:function(){
                return "<b>"+this.series.name+"</b><br/>"+
                       this.category+"<br/>"+
                       this.y.toLocaleString("id-ID");
            }
        },

        series:[
            {
                name:"Total",
                data:data.map(d=>d.total),
                color:"#3e6dd1"
            },
            {
                name:"Mandatory",
                data:data.map(d=>d.mandatory),
                color:"#f2994a"
            },
            {
                name:"Non Mandatory",
                data:data.map(d=>d.nonmandatory),
                color:"#9b59b6"
            }
        ],

        credits:{ enabled:false }
    });
}


/* =====================================================
   BUILD FILTER + AUTO SEARCH INPUT
===================================================== */

function buildDetailCheckbox(masterData){

    const container = document.getElementById("checkboxDiklap");
    if(!container) return;

    container.innerHTML = "";

    // 🔥 CREATE SEARCH INPUT DYNAMIC
    const search = document.createElement("input");
    search.type = "text";
    search.placeholder = "Search Diklap...";
    search.style.width = "100%";
    search.style.padding = "6px";
    search.style.marginBottom = "10px";
    search.style.border = "1px solid #ccc";
    search.style.borderRadius = "6px";

    container.appendChild(search);

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

    // 🔍 SEARCH
    search.addEventListener("input", function(){
        renderList(this.value);
    });

    // ☑ FILTER CHANGE
    container.addEventListener("change", function(){

        const checked = [
            ...container.querySelectorAll("input[type=checkbox]:checked")
        ].map(cb=>cb.value);

        const filtered = detailDiklapMaster.filter(d =>
            checked.includes(d.name)
        );

        renderDetailChart(filtered);
    });
}


/* =====================================================
   DROPDOWN TOGGLE
===================================================== */

document.addEventListener("DOMContentLoaded", function(){

    const selectBox = document.querySelector("#diklapFilter .select-box");
    const checkboxList = document.getElementById("checkboxDiklap");

    if(!selectBox || !checkboxList) return;

    selectBox.addEventListener("click", function(e){
        e.stopPropagation();
        checkboxList.style.display =
            checkboxList.style.display === "block"
                ? "none"
                : "block";
    });

    document.addEventListener("click", function(){
        checkboxList.style.display = "none";
    });

    checkboxList.addEventListener("click", function(e){
        e.stopPropagation();
    });
});