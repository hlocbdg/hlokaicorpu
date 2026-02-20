function login(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const emailGroup = document.getElementById("emailGroup");
    const passwordGroup = document.getElementById("passwordGroup");
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.innerText = "";

    // RESET ICON
    emailGroup.classList.remove("valid", "invalid");
    passwordGroup.classList.remove("valid", "invalid");

    // VALIDASI
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

    // LOGIN BERHASIL
    if(validEmail && validPassword){

        // efek smooth
        document.querySelector(".card").style.opacity = "0.5";

        setTimeout(() => {
            window.location.href = "home.html";
        }, 400);

    } else {

        errorMsg.innerText = "Email atau password salah";
    }
}
