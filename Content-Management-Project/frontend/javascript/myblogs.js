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

// ===============================

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
                return;
            }
            
        }
        else if(this.readyState === 4 && this.status === 401){
            debugger;
            isLoggedIn = false;
            return;
        }
        else if(this.readyState === 4 && this.status === 0){
            debugger;
            showToast("error", "Server under maintenance.<br>Please try again later.");
        }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send(JSON.stringify(body));
};

verifyToken();

const getData = () => {
    debugger;
    const url = createUrl('/blogs/myblogs');
    const body = {id: USER_ID};

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = JSON.parse(this.responseText);
        console.log(response);
        createTopCards(response);
        createBlogCards(response);
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send(JSON.stringify(body));
};

getData();

const openBlog = (id) => {
    debugger;
    console.log(id);
    sessionStorage.setItem("blog_id", id);
    window.location.href = "../html/blogs.html";
};

const editBlog = (id) => {
    debugger;
    console.log(id);
    var modal_title = document.getElementById("modal-title");
    var modal_author = document.getElementById("modal-author");
    var modal_image = document.getElementById("modal-image");
    var modal_content = document.getElementById("modal-content");
    var modal_footer = document.getElementById("modal-footer");

    const url = createUrl(`/blogs/open/${id}`);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = JSON.parse(this.responseText);
        console.log(response);
        modal_title.value = response.title;
        modal_author.value = response.author;
        modal_image.value = response.image;
        modal_content.value = response.content;
        modal_footer.innerHTML = `<button type="button" onclick="update(${response.id})" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">Save changes</button>`;
      }
    };
    xhr.open('GET', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
};

const deleteBlog = (id) => {
    debugger;
    var del_modal_footer = document.getElementById("del-modal-footer");
    del_modal_footer.innerHTML = `<button type="button" onclick="deleteTheBlog(${id})" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Yes</button>
    <button type="button" class="btn btn-warning" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#deleteModal">No</button>`;
};

const createTopCards = (data) => {
    var countCard = document.getElementById("count");
    countCard.innerHTML = data.length;
};

const createBlogCards = (data) => {
    var blogs = document.getElementById('blogs');
    blogs.innerHTML = "";
    for(var i=0; i<data.length; i++){
        var card = 
        `<div class="blog">
            <div class="title">
                <h3 onclick="openBlog(${data[i].id})">${data[i].title}</h3>
            </div>
            <div class="buttons">
                <i class="fa-solid fa-file-pen" onclick="editBlog(${data[i].id})" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                <i class="fa-solid fa-trash" onclick="deleteBlog(${data[i].id})" data-bs-toggle="modal" data-bs-target="#deleteModal"></i>
            </div>
        </div>`;
        blogs.innerHTML += card;
    }
};

const update = (id) => {
    var modal_title = document.getElementById("modal-title");
    var modal_author = document.getElementById("modal-author");
    var modal_image = document.getElementById("modal-image");
    var modal_content = document.getElementById("modal-content");

    const url = createUrl(`/blogs/update/${id}`);
    const body = {"title": modal_title.value,
                    "author": modal_author.value,
                    "image": modal_image.value,
                    "content": modal_content.value};

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = this.responseText;
        console.log(response);
        showToast("success","Blog updated successfully");
        setTimeout(() => {
            window.location.reload();
        }, 1500);
      }
    };
    xhr.open('PUT', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send(JSON.stringify(body));
};

const deleteTheBlog = (id) => {
    debugger;
    const url = createUrl(`/blogs/delete/${id}`);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = this.responseText;
        console.log(response);
        showToast("success","Blog deleted successfully");
        setTimeout(() => {
            window.location.reload();
        }, 1500);
      }
    };
    xhr.open('DELETE', url);
    xhr.setRequestHeader("Authorization", "Bearer "+TOKEN);
    xhr.send();
};