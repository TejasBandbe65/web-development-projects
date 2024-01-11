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
    localStorage.clear("blogs_token");
    localStorage.clear("blog_id");
    window.location.href = '../index.html';
};

// ===============================

var title = document.getElementById("title");
var author = document.getElementById("author");
var content = document.getElementById("content");

const getPrevData = () => {

    title.value = localStorage.getItem("blogs-title");
    author.value = localStorage.getItem("blogs-author");
    content.value = localStorage.getItem("blogs-content");
};

getPrevData();

const save = () => {

    localStorage.setItem("blogs-title", title.value);
    localStorage.setItem("blogs-author", author.value);
    localStorage.setItem("blogs-content", content.value);

    showToast("success", "Your blog is saved as a draft");
};

const createUrl = (uri) => {
    return 'http://localhost:8080/cms'+uri;
};

const post = () => {

    debugger;
    //call the api to save the post
    const url = createUrl('/blogs/add');
    var userId = localStorage.getItem("user_id");
    console.log(userId, typeof userId);
    userId = parseInt(userId);
    const body = {
        "title": title.value,
        "author": author.value,
        "content": content.value,
        "category": "new",
        "userId": userId
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
            localStorage.clear("blogs-title");
            localStorage.clear("blogs-author");
            localStorage.clear("blogs-content");
            title.value = "";
            author.value = "";
            content.value = "";
        }else{
            showToast("error", "Something went wrong");
        }
        
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("blogs_token"));
    xhr.send(JSON.stringify(body));
};