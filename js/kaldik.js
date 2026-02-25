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