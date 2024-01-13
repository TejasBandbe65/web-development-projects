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
    localStorage.removeItem("user_id");
    window.location.href = '../index.html';
};

// =====================================

const USER_ID = localStorage.getItem("user_id");
const TOKEN = localStorage.getItem("blogs_token");
var isLoggedIn = false;

function createUrl(uri){
    return 'http://localhost:8080/cms'+uri;
}

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
                var icons = document.getElementById("icons");
                icons.innerHTML = `<i class="fa-solid fa-heart" id="like" onclick="like()"></i>
                                    <i class="fa-solid fa-comment" data-bs-toggle="modal" data-bs-target="#commentModal"></i>
                                    <i class="fa-solid fa-share-nodes" onclick="share()"></i>
                                `;
                var heart = document.getElementById("like");
                heart.classList.remove("liked");
                return true;
            }else{
                isLoggedIn = false;
                const blog = document.getElementById("blog-menu");
                blog.innerHTML = `<i class="fa-solid fa-house" onclick="home()"></i>`;
                return;
            }
            
        }
        else if(this.readyState === 4 && this.status === 401){
            debugger;
            isLoggedIn = false;
            const blog = document.getElementById("blog-menu");
            blog.innerHTML = `<i class="fa-solid fa-house" onclick="home()"></i>`;
            return;
        }
        else if(this.readyState === 4 && this.status === 0){
            debugger;
            const blog = document.getElementById("blog-menu");
            blog.innerHTML = `<i class="fa-solid fa-house" onclick="home()"></i>`;
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

// ==========================================

const openBlog = () => {
    debugger;
    const blog_id = sessionStorage.getItem("blog_id");
    const url = createUrl(`/blogs/open/${blog_id}`);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = JSON.parse(this.responseText);
        console.log(response);
        displayBlog(response);
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
    var blog_image = document.getElementById("blog-image");

    const inputDate = new Date(data.updated_timestamp);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const outputDateString = inputDate.toLocaleDateString('en-US', options);

    blog_title.innerHTML = `${data.title}`;
    blog_author.innerHTML = `<h3>- ${data.author}</h3>`;
    blog_image.innerHTML = `<img src=${data.image}></img>`
    blog_date.innerHTML = `${outputDateString}`;
    blog_content.innerHTML = `<p>${data.content}</p>`;
};

const isLiked = () => {
    debugger;
    const blog_id = sessionStorage.getItem("blog_id");
    const url = createUrl(`/like/isliked`);

    const body = {"userId": USER_ID,
                "blogId": blog_id};

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = this.responseText;
        console.log(response);
        if(response === "true"){
            var heart = document.getElementById("like");
            heart.classList.add("liked");
        }
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send(JSON.stringify(body));
}

isLiked();

const like = () => {
    debugger;
    const blog_id = sessionStorage.getItem("blog_id");
    const url = createUrl(`/like/blog`);

    const body = {"userId": USER_ID,
                "blogId": blog_id};

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = this.responseText;
        console.log(response);
        if(response === "Something went wrong"){
            showToast("warning", "Blog already liked. Cannot remove like.");
            return;
        }
        showToast("success", response);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send(JSON.stringify(body));
};

const share = () => {
     const tempInput = document.createElement('input');
     tempInput.value = window.location.href;
     document.body.appendChild(tempInput);
     tempInput.select();
     document.execCommand('copy');
     document.body.removeChild(tempInput);
    showToast("success", "Link copied to clipboard.");
};

const comment = () => {
    debugger;
    const blog_id = sessionStorage.getItem("blog_id");
    var comment = document.getElementById("comment").value;
    const url = createUrl(`/comments/post`);

    const body = {"comment": comment,
                "userId": USER_ID,
                "blogId": blog_id};

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = this.responseText;
        console.log(response);
        showToast("success", response);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send(JSON.stringify(body));
};

const getComments = () => {
    debugger;
    const blog_id = sessionStorage.getItem("blog_id");
    const url = createUrl(`/comments/getall/${blog_id}`);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = JSON.parse(this.responseText);
        console.log(response);
        var comment_data = document.getElementById("comment-data");
        for(let i=0; i<response.length; i++){
            var comment = 
                    `<div class="row">
                        <div class="div1">
                            <h6>${response[i].name}</h6>
                        </div>
                        <div class="div2">
                            <p>${response[i].comment}</p>
                        </div>
                    </div>
                    <hr>`;
            comment_data.innerHTML += comment;
        }
      }
    };
    xhr.open('GET', url);
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send();
};

getComments();