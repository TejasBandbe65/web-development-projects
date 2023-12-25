const express = require('express');
const ecommRouter = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { constants, log } = require('../env');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//function to executecute mysql queries
function executeQuery(statement){
    return new Promise((resolve, reject) => {
        db.query(statement, (error, data) => {
            if(error){
                reject(error);
            }else{
                resolve(data);
            }
        });
    });
};

//api to register the user
ecommRouter.post('/register', async(request, response) => {
    try{
        const {name, email, password, mobile} = request.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const statement = `insert into users values(default, '${name}', '${email}', '${hashedPassword}',
        '${mobile}', default, default)`;
        const data = await executeQuery(statement);
        if(data){
            response.status(201).send({message: "Thank you for creating an account!", "userid": data.insertId});
        }
        else{
            response.status(400).send({message: "something went wrong"});
        }
    }catch(error){
        response.status(400).send({message: "Email id or mobile already registered"});
    }
});

//api to login the user
ecommRouter.post('/login', async(request, response) => {
    try{
        const {email, password} = request.body;
        const statement = `select * from users where email = '${email}'`;
        const data = await executeQuery(statement);
        const isPasswordValid = await bcrypt.compare(password, data[0].password);
        if(data.length === 0 || isPasswordValid === false){
            response.status(400).send({message: "Wrong email id or password"});
        }
        else{
            const payload = {"email": email, "username": data[0].name};
            jwt.sign({payload}, process.env.JWTKEY, {expiresIn: constants.JWT_KEY_EXPIRY_TIME}, (err, token) => {
                if(err){
                    response.status(404).send("user not found");
                }else{
                    const statement = `update users set token = '${token}' where id = ${data[0].id}`;
                    executeQuery(statement);
                    response.send({message: `Welcome ${data[0].name}`, "access_token": token});
                }
            });
        }
    }catch(error){
        response.status(400).send({message: "something went srong"});
    }
});

//function to verify token and get payload
function verifyToken(request, response, next){
    const bearerHeader = request.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        jwt.verify(token, process.env.JWTKEY, (error, authData) => {
            if(error){
                response.status(401).send("Invalid Authorization");
            }else{
                request.authData = authData;
                next();
            }
        });
    }else{
        response.status(401).send("Invalid Authorization");
    }
};

//api to get all products
ecommRouter.get('/', verifyToken, async(request, response) => {
    try{
        const statement = `select * from products where status = 'active'`;
        const data = await executeQuery(statement);
        response.status(200).send(data);
    }catch(error){
        response.status(400).send("Something went wrong");
    }
});

//api to like product
ecommRouter.post('/like', verifyToken, async(request, response) => {
    try{
        const {user_id, product_id} = request.body;
        const query = `select * from wishlist where user_id = ${user_id} and product_id = ${product_id}`;
        const res = await executeQuery(query);
        if(res.length !== 0){
            response.status(200).send({message: "Already liked"});
        }
        else{
            const statement = `insert into wishlist values(default, ${product_id}, ${user_id})`;
            const data = await executeQuery(statement);
            response.status(201).send({message: "Liked", "like id":data.insertId});
        }
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to add product to cart
ecommRouter.post('/cart', verifyToken, async(request, response) => {
    try{
        const {product_id, user_id, unit_price} = request.body;
        const query = `select * from cart where product_id = ${product_id} and user_id = ${user_id}`;
        const res = await executeQuery(query);
        if(res.length !== 0){
            response.status(200).send({message: "Product is already in cart"});
        }
        else{
            const statement = `insert into cart values(default, ${product_id}, default, 
                ${user_id}, ${unit_price}, default)`;
            const data = await executeQuery(statement);
            response.status(201).send({message: "Added to cart", "cart id":data.insertId});
        }
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to get items in cart
ecommRouter.get('/cart/:id', verifyToken, async(request, response) => {
    try{
        const statement = `select c.id, c.product_id, p.name, p.image, p.description, 
        p.category, p.discount, p.stock, p.status, c.unit_price, c.quantity, c.cart_total
        from cart c, products p where c.product_id = p.id and c.user_id = ${request.params.id}`;
        const data = await executeQuery(statement);
        if(data.length === 0){
            response.status(200).send({message: "Cart is empty"});
        }
        else{
            response.status(200).send(data);
        }
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to increase/decrease quantity
ecommRouter.put('/cart', verifyToken, async(request, response) => {
    try{
        const {cart_id, action} = request.body;
        if(action === "increase"){
            const query= `select stock, quantity from products p, cart c 
            where p.id = c.product_id and c.id = ${cart_id}`;
            const data = await executeQuery(query);
            if(data[0].quantity < data[0].stock){
                const statement = `update cart set quantity = quantity + 1, 
                cart_total = unit_price * quantity where id = ${cart_id}`;
                await executeQuery(statement);
                response.status(200).send({message: "Quantity increased"});
            }
            else{
                response.status(200).send({message: "Reached maximum quantity"});
            }
        }else{
            const query = `select quantity from cart where id = ${cart_id}`;
            const data = await executeQuery(query);
            if(data[0].quantity > 1){
                const statement = `update cart set quantity = quantity - 1, 
                cart_total = unit_price * quantity where id = ${cart_id}`;
                await executeQuery(statement);
                response.status(200).send({message: "Quantity decreased"});
            }
            else{
                response.status(200).send({message: "Reached minimum quantity"});
            }
        }
    }catch(error){
        response.status(400).send({message: "something went wrong"});
    }
});

//api to delete product from cart
ecommRouter.delete('/cart', verifyToken, async(request, response) => {
    try{
        const {cart_id} = request.body;
        const statement = `delete from cart where id = ${cart_id}`;
        const data = await executeQuery(statement);
        if(data.affectedRows === 1){
            response.status(201).send({message: "Product removed from cart"});
        }else{
            response.status(404).send({message: "Product not found in cart"});
        }
    }catch(error){
        response.status(400).send({message: "something went wrong"});
    }
});

function generateOrderNumber(){
    const randomNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    return dateString + "-0" + randomNum;
}

async function orderItems(orderId, user_id){
    const statement = `select product_id, quantity from cart where user_id = ${user_id}`;
    const data = await executeQuery(statement);
    for(i=0; i<data.length; i++){
        const query = `insert into order_items values(default, ${orderId}, 
            ${data[i].product_id}, ${data[i].quantity})`;
        await executeQuery(query);
    }
    for(i=0; i<data.length; i++){
        const query = `update products set stock = stock - ${data[i].quantity} 
        where id = ${data[i].product_id}`;
        await executeQuery(query);
    }
}

async function sendMail(orderNumber, orderId){
    const statement = `select p.name, p.description, round(p.price*(1-p.discount), 2) unit_price, oi.quantity, 
    o.total, date(o.placed_date) order_date, date(o.delivery_date) delivery_date, u.name username, u.email 
    from orders o, order_items oi, products p, users u
    where oi.order_id = o.id and oi.product_id = p.id and o.user_id = u.id and o.id = ${orderId}`;
    const data = await executeQuery(statement);
    if(data.length === 0){
        return;
    }
    const result = data.map(item => {
        return `
        Medicine: ${item.name}<br/>
        Description: ${item.description}<br/>
        Unit Price: ${item.unit_price}<br/>
        Quantity: ${item.quantity}<br/>
        --------------------------------<br/>
        `
    });
    const mailId = process.env.EMAIL;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSKEY
        }
    });
    const username = data[0].username;
    const user_email = data[0].email;
    const order_date = data[0].order_date;
    const delivery_date = data[0].delivery_date;
    const total = data[0].total;
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedODate = order_date.toLocaleDateString('en-US', options);
    const formattedDDate = delivery_date.toLocaleDateString('en-US', options);

    const message = `
Dear ${username},<br/><br/>

Thank you for choosing <strong>PharmaSwift</strong> for your medicine needs.<br/><br/>
We are pleased to confirm the receipt of your order <strong>#${orderNumber}</strong> placed on ${formattedODate}.<br/><br/>

<strong>Order details:</strong><br/><br/>
${result}<br/>

<strong>Delivery Date:</strong> ${formattedDDate}<br/>
<strong>Total Amount:</strong> ₹ ${total}<br/><br/>

We will notify you once your order has been dispatched for delivery.<br/><br/>

If you have any questions or concerns about your order, please don't hesitate to contact our customer support team at <u>medbookingpro@gmail.com</u> or <u>+91 9823629901</u>.<br/><br/>

Thank you again for choosing <strong>PharmaSwift</strong>. We appreciate your business!<br/><br/>

Best regards,<br/>
<strong>PharmaSwift Team</strong>
    `;

    const mailOptions = {
        from: process.env.EMAIL,
        to: user_email,
        subject: `Order Confirmation - #${orderNumber}`,
        html: message,
    };

    transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
        }else{
        }
    });
}

async function deleteCart(user_id){
    const statement = `delete from cart where user_id = ${user_id}`;
    await executeQuery(statement);
}

//api to place order
ecommRouter.post('/order', verifyToken, async(request, response) => {
    try{
        const {user_id} = request.body;
        const res = 
            await executeQuery(`select count(id) product_count, round(sum(cart_total), 2) total from cart where user_id = ${user_id}`);
        const {product_count, total} = res[0];
        const statement = `insert into orders values(default, ${product_count}, ${user_id}, 
            default, default, ${total}, default)`;
        const data = await executeQuery(statement);
        const orderNumber = generateOrderNumber();

        const query = `insert into order_numbers values(${orderNumber}, ${data.insertId})`;
        await executeQuery(query);
        orderItems(data.insertId, user_id);
        deleteCart(user_id);
        sendMail(orderNumber, data.insertId);
        response.status(201).send({message: "Order placed", "Order Id":orderNumber});
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to show orders to the user
ecommRouter.get('/order/:id', verifyToken, async(request, response) => {
    try{
        const user_id = request.params.id;
        const statement = `select o.id, onr.order_number, o.placed_date, o.total 
        from orders o, order_numbers onr
        where onr.order_id = o.id and o.user_id = ${user_id}`;
        const data = await executeQuery(statement);
        if(data.length === 0){
            response.status(400).send({message: "Orders not found"});
        }
        else{
            response.status(200).send(data);
        }
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to cancel order
ecommRouter.post('/cancelorder', verifyToken, async(request, response) => {
    try{
        const {order_id} = request.body;
        // const statement = `update orders set status = 'CANCELLED', delivery_date = NULL 
        //     where id = ${order_id}`;
        // await executeQuery(statement);
        const query = `select product_id, quantity from order_items where order_id = ${order_id}`;
        const data = executeQuery(query);
        response.send(data);
        // for(i=0; i<data.length; i++){
        //     await executeQuery(`update products set stock = stock + ${data[i].quantity}
        //     where id = ${data[i].product_id}`);
        // }
        // response.status(200).send({message: "Ordered cancelled"});
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to view order by order id
ecommRouter.get('/vieworder/:id', verifyToken, async(request, response) => {
    try{
        const order_id = request.params.id;
        const statement = `select p.name, p.description, p.image, round(p.price*(1-p.discount), 2) unit_price, oi.quantity, 
        o.placed_date, o.delivery_date, o.product_count, o.total, o.status
        from order_items oi, orders o, products p 
        where oi.order_id = o.id and oi.product_id = p.id and o.id = ${order_id}`;
        const data = await executeQuery(statement);
        response.status(200).send(data);
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to view profile
ecommRouter.get('/profile/:id', verifyToken, async(request, response) => {
    try{
        const user_id = request.params.id;
        const statement = `select u.id user_id, u.name, u.email, u.mobile, a.id address_id, a.address, a.city, a.state, a.country, a.pin_code
        from users u, addresses a where a.user_id = u.id and u.id = ${user_id}`;
        const data = await executeQuery(statement);
        response.status(200).send(data);
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to update profile - name, email, mobile, address
ecommRouter.put('/profile', verifyToken, async(request, response) => {
    try{
        const {user_id, name, email, mobile, address_id, country, state, city, address, pincode} = request.body;
        const statement = `update users set name = '${name}', email = '${email}', mobile = '${mobile}'
        where id = ${user_id}`;
        await executeQuery(statement);
        const query = `update addresses set country = '${country}', state = '${state}', city = '${city}',
        address = '${address}', pin_code = '${pincode}' where id = ${address_id}`;
        await executeQuery(query);
        response.status(200).send({message: "Profile updated"});
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to add an backup address
ecommRouter.post('/profile', verifyToken, async(request, response) => {
    try{
        const {country, state, city, address, pincode, user_id} = request.body;
        const statement = `insert into addresses values(default, '${country}', '${state}',
        '${city}', '${address}', '${pincode}', ${user_id})`;
        await executeQuery(statement);
        response.status(200).send({message: "Alternate address added"});
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api to update password
ecommRouter.post('/updatepass', verifyToken, async(request, response) => {
    try{
        const {old_password, new_password, user_id} = request.body;
        const statement = `select password from users where id = ${user_id}`;
        const data = await executeQuery(statement);
        const isPasswordValid = await bcrypt.compare(old_password, data[0].password);
        if(isPasswordValid){
            const hashedPassword = await bcrypt.hash(new_password, 10);
            const query = `update users set password = '${hashedPassword}' where id = ${user_id}`;
            await executeQuery(query);
            response.status(200).send({message: "Password updated"});
        }
        else{
            response.status(400).send({message: "Old password is wrong"});
        }
    }catch(error){
        response.status(400).send({message: "Something went wrong"});
    }
});

//api for forgot password

module.exports = ecommRouter;