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

// =====================================

const USER_ID = localStorage.getItem("user_id");
const TOKEN = localStorage.getItem("blogs_token");

const verifyToken = () => {
    //call the api to verify the token
    return false;
};

if(!verifyToken()){
    const blog = document.getElementById("blog-menu");  //give id field in blog-menu class
    blog.innerHTML = `<i class="fa-solid fa-house" onclick="home()"></i>`;
}

const home = () => {
    window.location.href = "../index.html";
};

// ==========================================

function createUrl(uri){
    return 'http://localhost:9999/cms'+uri;
}

const openBlog = () => {
    debugger;
    const blog_id = localStorage.getItem("blog_id");
    const url = createUrl(`/blogs/${blog_id}`);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = JSON.parse(this.responseText);
        console.log(response);
        displayBlog(response[0]);
      }
    };
    xhr.open('GET', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
};

const displayBlog = (data) => {
    var blog_title = document.getElementById("blog-title");
    var blog_author = document.getElementById("blog-author");
    var blog_date = document.getElementById("blog-date");
    var blog_content = document.getElementById("blog-content");

    const inputDate = new Date(data.updated_timestamp);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const outputDateString = inputDate.toLocaleDateString('en-US', options);

    blog_title.innerHTML = `${data.title}`;
    blog_author.innerHTML = `<h3>- ${data.author}</h3>`;
    blog_date.innerHTML = `${outputDateString}`;
    blog_content.innerHTML = `<p>${data.content}</p>`;
};