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

const createUrl = (uri) => {
    return 'http://localhost:8080/cms'+uri;
};

var BLOGS = [];

const getAllBlogs = () => {
    debugger;
    const url = createUrl('/blogs/displayAllBlogs');

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        debugger;
      if (this.readyState == 4 && this.status == 200) {
        debugger;
        var response = JSON.parse(this.responseText);
        console.log(response);
        BLOGS = response;
        var blogs = renderPageNos();
        createBlogCards(blogs);
      }
    };
    xhr.open('GET', url);
    xhr.send();
};

getAllBlogs();

const createBlogCards = (data) => {
    var blogs = document.getElementById('blogs');
    blogs.innerHTML = "";
    for(var i=0; i<data.length; i++){
        const inputDate = new Date(data[i].updated_timestamp);
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        const outputDateString = inputDate.toLocaleDateString('en-US', options);
        var card = 
        `<div class="blog" onclick="openBlog(${data[i].id})">
            <div class="image">
                <img src=${data[i].image} alt="">
            </div>
            <div class="content">
                <h3>${data[i].title}</h3>
                <p class="author">- By ${data[i].author}</p>
                <p class="date">- Last updated ${outputDateString}</p>
                <p class="info">${data[i].content}...</p>
            </div>
        </div>`;
        blogs.innerHTML += card;
    }
};

const openBlog = (id) => {
    debugger;
    console.log(id);
    sessionStorage.setItem("blog_id", id);
    window.location.href = "../html/blogs.html";
};


// ===============================

const home = () => {
    debugger;
    window.location.href = "../index.html";
};

var currentPage = 1;
var blogsPerPage = 10;

var indexOfLastBlog = currentPage * blogsPerPage;
var indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

const paginate = (number) => {
    currentPage = number;
    indexOfLastBlog = currentPage * blogsPerPage;
    indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    currentBlogs = BLOGS.slice(indexOfFirstBlog, indexOfLastBlog);
    createBlogCards(currentBlogs);
    renderPageNos();
};

const prevPage = () => {
    if(currentPage !== 1){
        currentPage = currentPage - 1;
        indexOfLastBlog = currentPage * blogsPerPage;
        indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
        currentBlogs = BLOGS.slice(indexOfFirstBlog, indexOfLastBlog);
        createBlogCards(currentBlogs);
        renderPageNos();
    }
};

const nextPage = () => {
    if(currentPage !== Math.ceil(BLOGS.length / blogsPerPage)){
        currentPage = currentPage + 1;
        indexOfLastBlog = currentPage * blogsPerPage;
        indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
        currentBlogs = BLOGS.slice(indexOfFirstBlog, indexOfLastBlog);
        createBlogCards(currentBlogs);
        renderPageNos();
    }
};
// ======
const renderPageNos = () => {
    var currentBlogs = BLOGS.slice(indexOfFirstBlog, indexOfLastBlog);
    var pageNumbers = [];
    
    for(let i=1; i<=Math.ceil(BLOGS.length / blogsPerPage); i++){
        pageNumbers.push(i);
    }
    
    var pagenos = document.getElementById("page-numbers");
    pagenos.innerHTML = pageNumbers.map(number => {
        if(number === currentPage){
            return '<li class="page-item active"><a class="page-link" onclick="paginate('+number+')">'+number+'</a></li>'
        }else{
            return '<li class="page-item"><a class="page-link" onclick="paginate('+number+')">'+number+'</a></li>'
        }
    }).join('');

    return currentBlogs;
};
