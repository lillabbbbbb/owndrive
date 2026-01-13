
const checkSession = async() => {
    const token = localStorage.getItem("auth_token")
    //if there is no valid user token, redirect to login
    console.log(token)
    if(!token){
        window.location.href = "/login.html"
    }
    else{
        document.getElementById("error").textContent = "Successful login."
        
        const response = await fetch("/api/private", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token 
            }
        })
    }
}

const logout = () => {
    localStorage.removeItem("auth_token")
    window.location.href = "login.html"
}

document.getElementById("logout").addEventListener("click", logout)


checkSession()