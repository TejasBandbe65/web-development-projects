module.exports.constants = {
    SERVER_PORT: 9999,
    DB_HOST: "localhost",
    DB_USER: "root",
    DB_DATABASE: "ecommerce",
    JWT_KEY_EXPIRY_TIME: "120m",
}

module.exports.log = function(msg){
    console.log(msg);
}