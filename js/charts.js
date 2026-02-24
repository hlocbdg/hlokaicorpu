
(async function(){

/* =========================
   KPI (Dynamic Per Page)
==========================*/

const sheetName = typeof SHEET_KPI !== "undefined"
  ? SHEET_KPI
  : "KPI_UTAMA";   // default untuk home

const kpi = await getSheet(sheetName);

kpi.forEach(r => {

  if (r.KATEGORI === 'PELATIHAN') {

    const program = Number(r.PROGRAM || 0);
    const realisasi = Number(r.REALISASI || 0);

    if(document.getElementById("kpiProgramPelatihan")){
      document.getElementById("kpiProgramPelatihan").innerText = program;
      document.getElementById("kpiRealisasiPelatihan").innerText = realisasi;
      document.getElementById("kpiPersenPelatihan").innerText =
        (program > 0 ? ((realisasi / program) * 100).toFixed(0) : 0) + "%";
    }

    if(document.getElementById("kpi_operasiProgramPelatihan")){
      document.getElementById("kpi_operasiProgramPelatihan").innerText = program;
      document.getElementById("kpi_operasiRealisasiPelatihan").innerText = realisasi;
      document.getElementById("kpi_operasiPersenPelatihan").innerText =
        (program > 0 ? ((realisasi / program) * 100).toFixed(0) : 0) + "%";
    }
    if(document.getElementById("kpiProgramPelatihanSafety")){
  document.getElementById("kpiProgramPelatihanSafety").innerText = program;
  document.getElementById("kpiRealisasiPelatihanSafety").innerText = realisasi;
  document.getElementById("kpiPersenPelatihanSafety").innerText =
    (program > 0 ? ((realisasi / program) * 100).toFixed(0) : 0) + "%";
}

  }

  if (r.KATEGORI === 'PESERTA') {

    const program = Number(r.PROGRAM || 0);
    const realisasi = Number(r.REALISASI || 0);

    if(document.getElementById("kpiProgramPeserta")){
      document.getElementById("kpiProgramPeserta").innerText =
        program.toLocaleString('id-ID');
      document.getElementById("kpiRealisasiPeserta").innerText =
        realisasi.toLocaleString('id-ID');
      document.getElementById("kpiPersenPeserta").innerText =
        (program > 0 ? ((realisasi / program) * 100).toFixed(0) : 0) + "%";
    }

    if(document.getElementById("kpi_operasiProgramPeserta")){
      document.getElementById("kpi_operasiProgramPeserta").innerText =
        program.toLocaleString('id-ID');
      document.getElementById("kpi_operasiRealisasiPeserta").innerText =
        realisasi.toLocaleString('id-ID');
      document.getElementById("kpi_operasiPersenPeserta").innerText =
        (program > 0 ? ((realisasi / program) * 100).toFixed(0) : 0) + "%";
    }
    if(document.getElementById("kpiProgramPesertaSafety")){
  document.getElementById("kpiProgramPesertaSafety").innerText =
    program.toLocaleString('id-ID');
  document.getElementById("kpiRealisasiPesertaSafety").innerText =
    realisasi.toLocaleString('id-ID');
  document.getElementById("kpiPersenPesertaSafety").innerText =
    (program > 0 ? ((realisasi / program) * 100).toFixed(0) : 0) + "%";
}

  }

});



/* =========================
   KPI KALDIK
==========================*/
const kaldikSheet = await getSheet('KALDIK');

let totalKaldik = 0;
let totalNonKaldik = 0;

kaldikSheet.forEach(r => {

  if (r.JENIS === 'KALDIK') {
    totalKaldik = Number(r.VOLUME) || 0;
  }

  if (r.JENIS === 'NON_KALDIK') {
    totalNonKaldik = Number(r.VOLUME) || 0;
  }

});

document.getElementById('kpiKaldik').innerText = totalKaldik;
document.getElementById('kpiNonKaldik').innerText = totalNonKaldik;


  /* =========================
     MANDATORY 3D COLUMN
  ==========================*/
  const mandatory = await getSheet('MANDATORY');

  Highcharts.chart('mandatoryChart', {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50
      }
    },
    title: { text: null },
    xAxis: {
      categories: mandatory.map(r=>r.JENIS)
    },
    yAxis: { title: { text: null } },
    plotOptions: {
      column: { depth: 40 }
    },
    series: [{
      name: 'Volume',
      data: mandatory.map(r=>+r.VOLUME || 0),
      colorByPoint: true
    }]
  });


  /* =========================
     PESERTA MANDATORY 3D PIE
  ==========================*/
  const pesertaMandatory = await getSheet('PESERTA_MANDATORY');

  Highcharts.chart('pesertaChart', {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45
      }
    },
    title: { text: null },
    plotOptions: {
      pie: {
        innerSize: 80,
        depth: 45
      }
    },
  series: [{
    data: pesertaMandatory.map(r=>({
      name: r.JENIS,
      y: +r.VOLUME || 0
    }))
  }]
});


  /* =========================
     REALISASI PELATIHAN 3D BAR
  ==========================*/
const realisasi = await getSheet('REALISASI_PELATIHAN');

const categories = realisasi.map(r => r.STATUS);

// =====================
// GRAFIK VOLUME
// =====================
Highcharts.chart('academyVolumeChart', {
  chart: {
    type: 'bar',
    options3d: {
      enabled: true,
      alpha: 10,
      beta: 15,
      depth: 50
    }
  },
  title: { text: 'Realisasi Volume' },

  xAxis: {
    categories: categories
  },

  yAxis: {
    title: { text: null }
  },

  plotOptions: {
    bar: { depth: 40 }
  },

  series: [{
    name: 'Volume',
    data: realisasi.map(r => Number(r.VOLUME) || 0),
    color: '#3b82f6'
  }]
});


// =====================
// GRAFIK PESERTA
// =====================
Highcharts.chart('academyPesertaChart', {
  chart: {
    type: 'bar',
    options3d: {
      enabled: true,
      alpha: 10,
      beta: 15,
      depth: 50
    }
  },
  title: { text: 'Realisasi Peserta' },

  xAxis: {
    categories: categories
  },

  yAxis: {
    title: { text: null }
  },

  plotOptions: {
    bar: { depth: 40 }
  },

  series: [{
    name: 'Peserta',
    data: realisasi.map(r => Number(r.PESERTA) || 0),
    color: '#f97316'
  }]
});



/* =========================
   APDP TDP 3D PIE
==========================*/
const apdp = await getSheet('APDP');

const tdp = apdp.find(r => r.JENIS === 'TDP') || { VOLUME: 0, PESERTA: 0 };
const idp = apdp.find(r => r.JENIS === 'IDP') || { VOLUME: 0, PESERTA: 0 };

Highcharts.chart('tdpChart', {
  chart: {
    type: 'pie',
    options3d: {
      enabled: true,
      alpha: 45
    }
  },
  title: { text: null },
  plotOptions: {
    pie: {
      depth: 45,
      dataLabels: {
        enabled: true,
        format: '{point.name}: {point.y}'
      }
    }
  },
  series: [{
    name: 'TDP',
    data: [
      { name: 'Volume', y: +tdp.VOLUME || 0 },
      { name: 'Peserta', y: +tdp.PESERTA || 0 }
    ]
  }]
});


/* =========================
   APDP IDP 3D PIE
==========================*/
Highcharts.chart('idpChart', {
  chart: {
    type: 'pie',
    options3d: {
      enabled: true,
      alpha: 45
    }
  },
  title: { text: null },
  plotOptions: {
    pie: {
      depth: 45,
      dataLabels: {
        enabled: true,
        format: '{point.name}: {point.y}'
      }
    }
  },
  series: [{
    name: 'IDP',
    data: [
      { name: 'Volume', y: +idp.VOLUME || 0 },
      { name: 'Peserta', y: +idp.PESERTA || 0 }
    ]
  }]
});



  /* =========================
   FORCE HIGHCHARTS REFLOW
=========================*/

function resizeCharts(){
  Highcharts.charts.forEach(function(chart){
    if(chart){
      chart.reflow();
    }
  });
}

window.addEventListener('resize', resizeCharts);


})();
document.addEventListener("DOMContentLoaded", async function(){

    const isSafety = document.body.classList.contains("page-safety");

    const sheetPelatihan = isSafety
        ? "SAFETY_PESERTA_PELATIHAN"
        : "PELATIHAN_OPERASI";

    const sheetPeserta = isSafety
        ? "SAFETY_PELATIHAN"
        : "PESERTA_PELATIHAN_OPERASI";


    // ===============================
    // AMBIL DATA PELATIHAN
    // ===============================
    rawData = await getSheet(sheetPelatihan);
    renderChart(rawData);

    generateCheckbox(rawData, "checkboxContainer", filterChart);
    enableSearch("searchPelatihan", "checkboxContainer");


    // ===============================
    // AMBIL DATA PESERTA
    // ===============================
    pesertaData = await getSheet(sheetPeserta);
    renderPesertaChart(pesertaData);

    generateCheckbox(pesertaData, "checkboxContainerPeserta", filterChartPeserta);
    enableSearch("searchPelatihanPeserta", "checkboxContainerPeserta");

});
(async function(){

/* ==========================================
   GLOBAL VARIABLE
========================================== */

let rawData = [];
let pesertaData = [];

/* ==========================================
   DETECT PAGE
========================================== */

const isSafety = document.body.classList.contains("page-safety");

/* ==========================================
   SHEET NAME
========================================== */

const sheetPelatihan = isSafety
    ? "SAFETY_PESERTA_PELATIHAN"
    : "PELATIHAN_OPERASI";

const sheetPeserta = isSafety
    ? "SAFETY_PELATIHAN"
    : "PESERTA_PELATIHAN_OPERASI";

/* ==========================================
   LOAD DATA
========================================== */

rawData = await getSheet(sheetPelatihan);
pesertaData = await getSheet(sheetPeserta);

renderChart(rawData);
renderPesertaChart(pesertaData);

generateCheckbox(rawData, "checkboxContainer", filterChart);
generateCheckbox(pesertaData, "checkboxContainerPeserta", filterChartPeserta);

enableSearch("searchPelatihan", "checkboxContainer");
enableSearch("searchPelatihanPeserta", "checkboxContainerPeserta");

/* ==========================================
   FILTER
========================================== */

function filterChart(){
    const checked = getChecked("checkboxContainer");
    const filtered = rawData.filter(d =>
        checked.includes(d["NAMA_PELATIHAN"] || d["Nama Pelatihan"])
    );
    renderChart(filtered);
}

function filterChartPeserta(){
    const checked = getChecked("checkboxContainerPeserta");
    const filtered = pesertaData.filter(d =>
        checked.includes(d["NAMA_PELATIHAN"] || d["Nama Pelatihan"])
    );
    renderPesertaChart(filtered);
}

/* ==========================================
   RENDER CHART ATAS
========================================== */

function renderChart(data){

    const labels = data.map(d =>
        d["NAMA_PELATIHAN"] || d["Nama Pelatihan"]
    );

    const program = data.map(d =>
        Number((d["PROGRAM"] || 0).toString().replace(/[.,]/g,''))
    );

    const realisasi = data.map(d =>
        Number((d["REALISASI"] || 0).toString().replace(/[.,]/g,''))
    );

    const chartId = isSafety ? "safetyChart" : "operasiChart";

    Highcharts.chart(chartId, {
        chart: {
            type: isSafety ? "column" : "bar",
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 70,
                viewDistance: 25
            }
        },

        title: { text: null },
        xAxis: { categories: labels },
        yAxis: { title: { text: null } },

        plotOptions: {
            column: { depth: 50 },
            bar: { depth: 50 }
        },

        series: [
            { name: "Program", data: program, color: isSafety ? "#1e3a8a" : "#197d8a" },
            { name: "Realisasi", data: realisasi, color: isSafety ? "#facc15" : "#cfd3bb" }
        ],

        credits: { enabled: false }
    });
}

/* ==========================================
   RENDER CHART PESERTA
========================================== */

function renderPesertaChart(data){

    const labels = data.map(d =>
        d["NAMA_PELATIHAN"] || d["Nama Pelatihan"]
    );

    const program = data.map(d =>
        Number((d["PROGRAM"] || 0).toString().replace(/[.,]/g,''))
    );

    const realisasi = data.map(d =>
        Number((d["REALISASI"] || 0).toString().replace(/[.,]/g,''))
    );

    const pesertaId = isSafety
        ? "pesertaSafetyChart"
        : "pesertaOperasiChart";

    Highcharts.chart(pesertaId, {

        chart: {
            type: "bar",
            height: 650,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 70,
                viewDistance: 25
            }
        },

        title: { text: null },

        xAxis: {
            categories: labels,
            labels: { style: { fontSize: "11px" } }
        },

        yAxis: { title: { text: null } },

        plotOptions: { bar: { depth: 50 } },

        series: [
            { name: "Program", data: program, color: isSafety ? "#1e3a8a" : "#197d8a" },
            { name: "Realisasi", data: realisasi, color: isSafety ? "#facc15" : "#cfd3bb" }
        ],

        credits: { enabled: false }
    });
}

/* ==========================================
   CHECKBOX (ADA ALL)
========================================== */

function generateCheckbox(data, containerId, filterFunction){

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const unique = [...new Set(data.map(d =>
        d["NAMA_PELATIHAN"] || d["Nama Pelatihan"]
    ))];

    /* ===== ALL ===== */

    const allLabel = document.createElement("label");
    allLabel.innerHTML = `
        <input type="checkbox" id="${containerId}_all" checked>
        <strong>All</strong>
    `;
    container.appendChild(allLabel);

    const allCheckbox = allLabel.querySelector("input");

    /* ===== ITEMS ===== */

    unique.forEach(name => {

        const label = document.createElement("label");

        label.innerHTML = `
            <input type="checkbox" value="${name}" checked>
            ${name}
        `;

        container.appendChild(label);

        const checkbox = label.querySelector("input");

        checkbox.addEventListener("change", () => {

            if(!checkbox.checked){
                allCheckbox.checked = false;
            }

            const items = [...container.querySelectorAll(`input[type="checkbox"]`)]
                .filter(cb => cb !== allCheckbox);

            const allChecked = items.every(cb => cb.checked);
            allCheckbox.checked = allChecked;

            filterFunction();
        });
    });

    /* ===== EVENT ALL ===== */

    allCheckbox.addEventListener("change", () => {

        const items = [...container.querySelectorAll(`input[type="checkbox"]`)]
            .filter(cb => cb !== allCheckbox);

        items.forEach(cb => cb.checked = allCheckbox.checked);

        filterFunction();
    });
}

/* ==========================================
   SEARCH
========================================== */

function enableSearch(searchId, containerId){

    const search = document.getElementById(searchId);
    if (!search) return;

    search.addEventListener("keyup", function(){

        const value = this.value.toLowerCase();
        const labels = document
            .getElementById(containerId)
            .getElementsByTagName("label");

        for(let i=0;i<labels.length;i++){
            const text = labels[i].innerText.toLowerCase();
            labels[i].style.display =
                text.includes(value) ? "" : "none";
        }
    });
}

/* ==========================================
   UTIL
========================================== */

function getChecked(containerId){
    return [...document.querySelectorAll(`#${containerId} input:checked`)]
        .map(cb => cb.value)
        .filter(v => v !== "on"); // cegah ALL
}

/* ==========================================
   REFLOW
========================================== */

window.addEventListener("resize", function(){
    Highcharts.charts.forEach(chart => {
        if(chart) chart.reflow();
    });
});

/* ==========================================
   DROPDOWN
========================================== */

document.querySelector('#pelatihanFilter .select-box')
.addEventListener('click', function(){
    const list = document.getElementById('checkboxList');
    list.style.display =
        list.style.display === 'block' ? 'none' : 'block';
});

document.querySelector('#pelatihanFilterPeserta .select-box')
.addEventListener('click', function(){
    const list = document.getElementById('checkboxListPeserta');
    list.style.display =
        list.style.display === 'block' ? 'none' : 'block';
});

})();