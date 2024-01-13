const showToast = (type, message) => {
    var toast = document.getElementById("toast");
    toast.classList.add('show');
    toast.style.display = 'block';

    if(type === 'success'){
        toast.style.backgroundColor = "#07bc0c";
    }
    else if(type === "error"){
        toast.style.backgroundColor = "#e74c3c";
    }
    else if(type === "warning"){
        toast.style.backgroundColor = "#f1c40f";
    }
    toast.innerHTML = `${message}`;

    setTimeout(function() {
        toast.style.display = "none";
        toast.classList.remove('show');
    }, 3000);
};

const subscribe = () => {
    var email = document.getElementById('email');
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    
    if(email.value.match(emailRegex)){
        email.value = "";
        showToast("success", "Subscribed successfully. <br>Please check your email for further updates");
    }else{
        showToast("error", "Invalid email id");
    }
};

// ==================================

const USER_ID = localStorage.getItem("user_id");
const TOKEN = localStorage.getItem("blogs_token");
var isLoggedIn = false;

const createUrl = (uri) => {
    return 'http://localhost:8080/cms'+uri;
};

const verifyToken = () => {
    debugger;
    //call the api to verify the token
    const url = createUrl('/user/verify');
    const body = {id: USER_ID};
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
        if (this.readyState === 4 && this.status === 200) {
            debugger;
            var response = this.responseText;
            console.log(response);
            if(response){
                isLoggedIn = true;
                return true;
            }else{
                isLoggedIn = false;
                const contact_menu = document.getElementById("contact-menu");
                contact_menu.innerHTML = `<i class="fa-solid fa-house" onclick="home()"></i>`;
                return;
            }
            
        }
        else if(this.readyState === 4 && this.status === 401){
            debugger;
            isLoggedIn = false;
            const contact_menu = document.getElementById("contact-menu");
            contact_menu.innerHTML = `<i class="fa-solid fa-house" onclick="home()"></i>`;
            return;
        }
        else if(this.readyState === 4 && this.status === 0){
            debugger;
            const contact_menu = document.getElementById("contact-menu");
            contact_menu.innerHTML = `<i class="fa-solid fa-house" onclick="home()"></i>`;
            showToast("error", "Server under maintenance.<br>Please try again later.");
        }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send(JSON.stringify(body));
};

verifyToken();

const home = () => {
    window.location.href = "../index.html";
};

// =================================

const sendMessage = () => {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    var phoneRegex = /^\d{10}$/;

    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var phone = document.getElementById("phone");
    var address = document.getElementById("address");

    if(name.value === '' || email.value === '' || phone.value === '' || address.value === ''){
        showToast("error", "Please fill all the details");
    }else if(!email.value.match(emailRegex)){
        showToast("error", "Invalid email id");
    }else if(!phone.value.match(phoneRegex)){
        showToast("error", "Invalid phone number");
    }else{
        //call the api to send message from user
        showToast("success", "We got your message.<br>We will connect with you shortly.");
        name.value = "";
        email.value = "";
        phone.value = "";
        address.value = "";
    }
};

const logout = () => {
    localStorage.removeItem("blogs_token");
    localStorage.removeItem("blog_id");
    localStorage.removeItem("user_id");
    window.location.href = '../index.html';
};