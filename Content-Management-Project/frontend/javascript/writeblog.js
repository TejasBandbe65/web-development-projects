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

const logout = () => {
    localStorage.removeItem("blogs_token");
    localStorage.removeItem("blog_id");
    window.location.href = '../index.html';
};

// ===============================

var title = document.getElementById("title");
var author = document.getElementById("author");
var content = document.getElementById("content");
var image = document.getElementById("image");

const getPrevData = () => {

    title.value = localStorage.getItem("blogs-title");
    author.value = localStorage.getItem("blogs-author");
    content.value = localStorage.getItem("blogs-content");
    image.value = localStorage.getItem("blogs-image");
};

getPrevData();

const save = () => {

    localStorage.setItem("blogs-title", title.value);
    localStorage.setItem("blogs-author", author.value);
    localStorage.setItem("blogs-content", content.value);
    localStorage.setItem("blogs-image", image.value);

    showToast("success", "Your blog is saved as a draft");
};

const USER_ID = localStorage.getItem("user_id");
const TOKEN = localStorage.getItem("blogs_token");

const createUrl = (uri) => {
    return 'http://localhost:8080/cms'+uri;
};

const post = () => {

    debugger;
    if(title.value==="" || author.value==="" || image.value==="" || content.value===""){
        showToast("error", "Please all the fileds.");
        return;
    }
    const url = createUrl('/blogs/add');
    var userId = parseInt(USER_ID);
    const contentWithLineBreaks = content.value.replace(/\n/g, "<br>");
    const body = {
        "title": title.value,
        "author": author.value,
        "content": contentWithLineBreaks,
        "category": "new",
        "userId": userId,
        "updated_timestamp": null,
        "image": image.value,
    }

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = this.responseText;
        if(response === "User not found"){
            showToast("error", "User not found");
        }else if(response === "Blog Added"){
            showToast("success", "Your blog is posted");
            localStorage.removeItem("blogs-title");
            localStorage.removeItem("blogs-author");
            localStorage.removeItem("blogs-content");
            localStorage.removeItem("blogs-image");
            title.value = "";
            author.value = "";
            content.value = "";
            image.value = "";
        }else{
            showToast("error", "Something went wrong");
        }
        
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send(JSON.stringify(body));
};