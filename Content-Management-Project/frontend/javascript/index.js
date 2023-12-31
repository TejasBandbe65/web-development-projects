const showToast = (type, message) => {
    debugger;
    var toast = document.getElementById('toast');
    toast.classList.add('show');
    toast.style.display = "block";
    if(type === "success"){
        toast.style.backgroundColor = "#07bc0c";
    }else if(type === "error"){
        toast.style.backgroundColor = "#e74c3c";
    }else if(type === "warning"){
        toast.style.backgroundColor = "#f1c40f";
    }
    toast.innerHTML = `${message}`;

    setTimeout(function() {
        toast.style.display = "none";
        toast.classList.remove('show');
    }, 3000);
};

const emailValidation = () => {
    var email = document.getElementById('email');
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    
    if(email.value.match(emailRegex)){
        return true;
    }else{
        showToast("error", "Invalid email id");
    }
};

const subscribe = () => {
    var email = document.getElementById("email");
    if(email.value === ''){
        showToast("error", "Please fill the email id");
    }else{
        if(emailValidation()){
            email.value = "";
            showToast("success", "Subscribed. Please check email for futher updates.");
        }
        else{
            showToast("error", "Invalid email id");
        }
    }
};