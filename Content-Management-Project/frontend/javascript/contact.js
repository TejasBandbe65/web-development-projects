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

const verifyToken = () => {
    //call the api to verify the token
    return false;
};

if(!verifyToken()){
    const contact_menu = document.getElementById("contact-menu");  //give id field in about-menu class
    contact_menu.innerHTML = `<i class="fa-solid fa-house" onclick="home()"></i>`;
}

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