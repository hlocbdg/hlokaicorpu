(async function(){

/* ======================================
   WARNA SECURITY
====================================== */

const COLOR_PROGRAM   = "#16a34a"; // hijau
const COLOR_REALISASI = "#f97316"; // oren


/* ======================================
   KPI SECURITY
====================================== */

const kpi = await getSheet("KPI_SECURITY");

kpi.forEach(r => {

  if (r.KATEGORI === "PELATIHAN") {

    const program   = Number(r.PROGRAM || 0);
    const realisasi = Number(r.REALISASI || 0);

    setText("kpiProgramPelatihanSecurity", program);
    setText("kpiRealisasiPelatihanSecurity", realisasi);
    setText("kpiPersenPelatihanSecurity",
      (program > 0 ? ((realisasi/program)*100).toFixed(0) : 0) + "%"
    );
  }

  if (r.KATEGORI === "PESERTA") {

    const program   = Number(r.PROGRAM || 0);
    const realisasi = Number(r.REALISASI || 0);

    setText("kpiProgramPesertaSecurity",
      program.toLocaleString("id-ID"));

    setText("kpiRealisasiPesertaSecurity",
      realisasi.toLocaleString("id-ID"));

    setText("kpiPersenPesertaSecurity",
      (program > 0 ? ((realisasi/program)*100).toFixed(0) : 0) + "%"
    );
  }

});


/* ======================================
   LOAD DATA CHART
====================================== */

let rawData     = await getSheet("SECURITY_PESERTA_PELATIHAN");
let pesertaData = await getSheet("SECURITY_PELATIHAN");

renderChart(rawData);
renderPesertaChart(pesertaData);

generateCheckbox(rawData, "checkboxContainer", filterChart);
generateCheckbox(pesertaData, "checkboxContainerPeserta", filterChartPeserta);

enableSearch("searchPelatihan", "checkboxContainer");
enableSearch("searchPelatihanPeserta", "checkboxContainerPeserta");


/* ======================================
   FILTER
====================================== */

function filterChart(){
  const checked = getChecked("checkboxContainer");
  const filtered = rawData.filter(d =>
    checked.includes(d.NAMA_PELATIHAN)
  );
  renderChart(filtered);
}

function filterChartPeserta(){
  const checked = getChecked("checkboxContainerPeserta");
  const filtered = pesertaData.filter(d =>
    checked.includes(d.NAMA_PELATIHAN)
  );
  renderPesertaChart(filtered);
}


/* ======================================
   CHART ATAS (3D)
====================================== */

function renderChart(data){

  if(!document.getElementById("securityChart")) return;

  const labels     = data.map(d => d.NAMA_PELATIHAN);
  const program    = data.map(d => Number(d.PROGRAM || 0));
  const realisasi  = data.map(d => Number(d.REALISASI || 0));

  Highcharts.chart("securityChart", {

    chart: {
      type: "bar",
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
      bar: { depth: 50 }
    },

    series: [
      { name: "Program",   data: program,   color: COLOR_PROGRAM },
      { name: "Realisasi", data: realisasi, color: COLOR_REALISASI }
    ],

    credits: { enabled: false }
  });
}


/* ======================================
   CHART BAWAH (3D)
====================================== */

function renderPesertaChart(data){

  if(!document.getElementById("pesertaSecurityChart")) return;

  const labels     = data.map(d => d.NAMA_PELATIHAN);
  const program    = data.map(d => Number(d.PROGRAM || 0));
  const realisasi  = data.map(d => Number(d.REALISASI || 0));

  Highcharts.chart("pesertaSecurityChart", {

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

    plotOptions: {
      bar: { depth: 50 }
    },

    series: [
      { name: "Program",   data: program,   color: COLOR_PROGRAM },
      { name: "Realisasi", data: realisasi, color: COLOR_REALISASI }
    ],

    credits: { enabled: false }
  });
}


/* ======================================
   CHECKBOX
====================================== */

function generateCheckbox(data, containerId, filterFunction){

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const unique = [...new Set(data.map(d => d.NAMA_PELATIHAN))];

  unique.forEach(name => {

    const label = document.createElement("label");

    label.innerHTML = `
      <input type="checkbox" value="${name}" checked>
      ${name}
    `;

    container.appendChild(label);

    label.querySelector("input")
      .addEventListener("change", filterFunction);
  });
}


/* ======================================
   SEARCH
====================================== */

function enableSearch(searchId, containerId){

  const search = document.getElementById(searchId);
  if (!search) return;

  search.addEventListener("keyup", function(){

    const value  = this.value.toLowerCase();
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


/* ======================================
   UTIL
====================================== */

function getChecked(containerId){
  return [...document.querySelectorAll(`#${containerId} input:checked`)]
    .map(cb => cb.value);
}

function setText(id, value){
  const el = document.getElementById(id);
  if(el) el.innerText = value;
}


/* ======================================
   REFLOW
====================================== */

window.addEventListener("resize", function(){
  Highcharts.charts.forEach(chart => {
    if(chart) chart.reflow();
  });
});

})();
