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