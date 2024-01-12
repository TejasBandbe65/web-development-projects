const showOldPassword = () => {
    var pass = document.getElementById("old-pass-box");
    var eye1 = document.getElementById("eye1");
    var eye2 = document.getElementById("eye2");

    if(pass.type === 'password'){
        pass.type = 'text';
        eye1.style.display = 'none';
        eye2.style.display = 'block';
    }
    else{
        pass.type = 'password';
        eye1.style.display = 'block';
        eye2.style.display = 'none';
    }
};

const showNewPassword = () => {
    var pass = document.getElementById("new-pass-box");
    var eye3 = document.getElementById("eye3");
    var eye4 = document.getElementById("eye4");

    if(pass.type === 'password'){
        pass.type = 'text';
        eye3.style.display = 'none';
        eye4.style.display = 'block';
    }
    else{
        pass.type = 'password';
        eye3.style.display = 'block';
        eye4.style.display = 'none';
    }
};

const previewImage = () => {
    debugger;
    const fileInput = document.getElementById('file-input');
    const profileImage = document.getElementById('profile-image');
    const uploadBtn = document.getElementById('upload-btn');
  
    const file = fileInput.files[0];
    if (file) {
        debugger;
        const reader = new FileReader();
        reader.onload = function (e) {
        profileImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
        fileInput.style.width = "70%";
        uploadBtn.style.display = "block";
        uploadBtn.style.width = "30%";
    }
};


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

const createUrl = (uri) => {
    return 'http://localhost:8080/cms'+uri;
}

const getData = () => {
    debugger;
    const userId = localStorage.getItem("user_id");
    const url = 'http://localhost:8080/cms/user/getdata';
    const body = {id: userId};
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
        if (this.readyState === 4 && this.status === 200) {
            debugger;
            var response = JSON.parse(this.responseText);
            console.log(response);
            var nameValue = document.getElementById("name-value");
            var emailValue = document.getElementById("email-value");
            var image = document.getElementById("profile-image");
            var nameBox = document.getElementById("name-box");
            var emailBox = document.getElementById("email-box");
            nameValue.innerHTML = ": "+response.name;
            emailValue.innerHTML = ": "+response.email;
            image.src = response.image;
            nameBox.value = response.name;
            emailBox.value = response.email;
        }
        else if(this.readyState === 4 && this.status === 400){
            debugger;
            showToast("error", "Something went wrong");
        }
        else if(this.readyState === 4 && this.status === 0){
            debugger;
            showToast("error", "Failed to register. <br>Please try after some time.");
        }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("blogs_token"));
    xhr.send(JSON.stringify(body));
};

const updateName = () => {
    var nameBox = document.getElementById("name-box");
    const newName = nameBox.value;
    const userId = localStorage.getItem("user_id");

    const url = createUrl('/user/updatename');
    const body = {id: userId, name: newName};
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
        if (this.readyState === 4 && this.status === 200) {
            debugger;
            var response = this.responseText;
            console.log(response);
            showToast("success", response);
            setTimeout(function() {
                window.location.reload();
            }, 3000);
        }
        else if(this.readyState === 4 && this.status === 400){
            debugger;
            showToast("error", "Something went wrong");
        }
        else if(this.readyState === 4 && this.status === 0){
            debugger;
            showToast("error", "Failed to register. <br>Please try after some time.");
        }
    };
    xhr.open('PUT', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("blogs_token"));
    xhr.send(JSON.stringify(body));
};

const updateEmail = () => {
    var emailBox = document.getElementById("email-box");
    var newEmail = emailBox.value;
    const userId = localStorage.getItem("user_id");

    const url = createUrl('/user/updateemail');
    const body = {id: userId, email: newEmail};
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
        if (this.readyState === 4 && this.status === 200) {
            debugger;
            var response = this.responseText;
            console.log(response);
            showToast("success", response);
            setTimeout(function() {
                window.location.reload();
            }, 3000);
        }
        else if(this.readyState === 4 && this.status === 400){
            debugger;
            showToast("error", "Something went wrong");
        }
        else if(this.readyState === 4 && this.status === 0){
            debugger;
            showToast("error", "Failed to register. <br>Please try after some time.");
        }
    };
    xhr.open('PUT', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("blogs_token"));
    xhr.send(JSON.stringify(body));
};

const updatePassword = () => {
    debugger;
    var oldPass = document.getElementById("old-pass-box");
    var newPass = document.getElementById("new-pass-box");

    if(oldPass.value === newPass.value){
        showToast("error", "Old password and new passwords should not be same.");
        return;
    }
    const userId = localStorage.getItem("user_id");

    const url = createUrl('/user/updatepassword');
    const body = {"userId": userId, 
                "oldPass": oldPass.value,
                "newPass": newPass.value
            };

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
        if (this.readyState === 4 && this.status === 200) {
            debugger;
            var response = this.responseText;
            console.log(response);
            if(response === "Old Password is incorrect."){
                showToast("error", response);
                return;
            }
            showToast("success", response);
            setTimeout(function() {
                window.location.reload();
            }, 3000);
        }
        else if(this.readyState === 4 && this.status === 400){
            debugger;
            showToast("error", "Something went wrong");
        }
        else if(this.readyState === 4 && this.status === 0){
            debugger;
            showToast("error", "Failed to register. <br>Please try after some time.");
        }
    };
    xhr.open('PUT', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("blogs_token"));
    xhr.send(JSON.stringify(body));
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

const logout = () => {
    localStorage.removeItem("blogs_token");
    localStorage.removeItem("blog_id");
    window.location.href = '../index.html';
};