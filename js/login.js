////////////////////////////////////////////////////////
// AUTH GUARD (HALAMAN LOGIN)
// Kalau sudah login → lempar ke home
////////////////////////////////////////////////////////

(function(){

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if(isLoggedIn === "true"){
        window.location.href = "home.html";
    }

})();


////////////////////////////////////////////////////////
// LOGIN FUNCTION
////////////////////////////////////////////////////////

function login(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const emailGroup = document.getElementById("emailGroup");
    const passwordGroup = document.getElementById("passwordGroup");
    const errorMsg = document.getElementById("errorMsg");
    const card = document.querySelector(".card");

    if(!emailGroup || !passwordGroup || !errorMsg){
        console.log("Elemen login tidak ditemukan");
        return;
    }

    errorMsg.innerText = "";

    // RESET STATE
    emailGroup.classList.remove("valid", "invalid");
    passwordGroup.classList.remove("valid", "invalid");

    ////////////////////////////////////////////////////
    // VALIDASI LOGIN
    ////////////////////////////////////////////////////

    const validEmail = email === "hloc.bdg@gmail.com";
    const validPassword = password === "dago46983";

    if(validEmail){
        emailGroup.classList.add("valid");
    } else {
        emailGroup.classList.add("invalid");
    }

    if(validPassword){
        passwordGroup.classList.add("valid");
    } else {
        passwordGroup.classList.add("invalid");
    }

    ////////////////////////////////////////////////////
    // LOGIN SUCCESS
    ////////////////////////////////////////////////////

    if(validEmail && validPassword){

        // SAVE SESSION
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", email);

        // SMOOTH EFFECT
        if(card){
            card.style.opacity = "0.5";
            card.style.transform = "scale(0.98)";
        }

        setTimeout(() => {
            window.location.href = "home.html";
        }, 400);

    } else {

        errorMsg.innerText = "Email atau password salah";
    }
}


////////////////////////////////////////////////////////
// ENTER KEY SUPPORT
////////////////////////////////////////////////////////

document.addEventListener("keydown", function(e){

    if(e.key === "Enter"){
        login();
    }

});


////////////////////////////////////////////////////////
// LOGOUT FUNCTION
////////////////////////////////////////////////////////

function logout(){

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    window.location.href = "index.html";
}