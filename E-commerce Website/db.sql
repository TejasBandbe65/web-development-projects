create database Ecommerce;

use Ecommerce;

create table Products(
    id int primary key auto_increment,
    name varchar(30) not null,
    image varchar(255) not null,
    description varchar(255),
    category varchar(20) not null,
    price float not null,
    discount float default 0,
    stock int not null,
    status varchar(15) not null default 'active'
);

create table Users(
    id int primary key auto_increment,
    name varchar(30) not null,
    email varchar(50) not null unique,
    password varchar(255) not null,
    mobile varchar(10) not null unique,
    status enum('ACTIVE', 'INACTIVE') not null default 'ACTIVE',
    token varchar(255)
);

create table Addresses(
    id int primary key auto_increment,
    country varchar(20) not null,
    state varchar(20) not null,
    city varchar(20) not null,
    address varchar(50),
    pin_code varchar(6),
    user_id int not null,
    constraint fk_addresses_userId foreign key(user_id) references Users(id) on update cascade on delete cascade
);

create table Cart(
    id int primary key auto_increment,
    product_id int not null,
    quantity int not null default 1,
    user_id int not null,
    unit_price float not null,
    cart_total float not null default(unit_price*quantity),
    constraint fk_cart_productId foreign key(product_id) references Products(id)  on update cascade on delete cascade,
    constraint fk_cart_userId foreign key(user_id) references Users(id)  on update cascade on delete cascade
);

create table Orders(
    id int primary key auto_increment,
    product_count int not null,
    user_id int not null,
    placed_date datetime not null default now(),
    delivery_date datetime default(date_add(now(), interval 4 day)),
    total float not null,
    status enum('ORDERED', 'DELIVERED', 'CANCELLED') not null default 'ORDERED',
    constraint fk_orders_userId foreign key(user_id) references Users(id) on update cascade on delete cascade
);

create table Order_Items(
    id int primary key auto_increment,
    order_id int not null,
    product_id int not null,
    quantity int not null,
    constraint fk_orderItems_orderId foreign key(order_id) references Orders(id) on update cascade on delete cascade,
    constraint fk_orderItems_productId foreign key(product_id) references Products(id) on update cascade on delete cascade
);

create table Wishlist(
    id int primary key auto_increment,
    product_id int not null,
    user_id int not null,
    constraint fk_wishlist_productId foreign key(product_id) references Products(id) on update cascade on delete cascade,
    constraint fk_wishlist_userId foreign key(user_id) references Users(id) on update cascade on delete cascade
);

create table Order_Numbers(
    order_number varchar(15) primary key,
    order_id int,
    constraint fk_orderNumbers_orderId foreign key(order_id) references Orders(id) on update cascade on delete cascade
);

create table Address_Data(
    country varchar(20),
    state varchar(20),
    city varchar(20)
);

insert into Address_Data values
('India', 'Maharashtra', 'Pune'),('India', 'Maharashtra', 'Mumbai'),
('India', 'Maharashtra', 'Nagpur'),('India', 'Maharashtra', 'Ratnagiri'),
('India', 'Maharashtra', 'Thane'),('India', 'Maharashtra', 'Nashik'),
('India', 'Maharashtra', 'Kolhapur'),('India', 'Maharashtra', 'Navi Mumbai'),
('India', 'Maharashtra', 'Sambhaji Nagar'),('India', 'Maharashtra', 'Solapur'),
('India', 'Maharashtra', 'Jalgaon'), ('India', 'Maharashtra', 'Latur'),
('India', 'Maharashtra', 'Satara'), ('India', 'Maharashtra', 'Dhule'),
('India', 'Maharashtra', 'Chandrapur'), ('India', 'Maharashtra', 'Parbhani'),
('India', 'Maharashtra', 'Sangli'), ('India', 'Maharashtra', 'Akola'),
('India', 'Uttar Pradesh', 'Lucknow'),('India', 'Uttar Pradesh', 'Kanpur'),
('India', 'Uttar Pradesh', 'Varanasi'), ('India', 'Uttar Pradesh', 'Agra'),
('India', 'Uttar Pradesh', 'Prayagraj'), ('India', 'Uttar Pradesh', 'Noida'),
('India', 'Uttar Pradesh', 'Meerut'), ('India', 'Uttar Pradesh', 'Mathura'),
('India', 'Uttar Pradesh', 'Ghaziabad'), ('India', 'Uttar Pradesh', 'Bareilly'),
('India', 'Gujrat', 'Ahmedabad'), ('India', 'Gujrat', 'Surat'), 
('India', 'Gujrat', 'Vadodara'), ('India', 'Gujrat', 'Rajkot'),
('India', 'Gujrat', 'Gandhinagar'), ('India', 'Gujrat', 'Bhavnagar'),
('India', 'Gujrat', 'Jamnagar'), ('India', 'Gujrat', 'Junagadh'),
('India', 'Tamil Nadu', 'Chennai'), ('India', 'Tamil Nadu', 'Coimbatore'),
('India', 'Tamil Nadu', 'Madurai'), ('India', 'Tamil Nadu', 'Trichy'),
('India', 'Tamil Nadu', 'Salem'), ('India', 'Tamil Nadu', 'Erode'),
('India', 'Tamil Nadu', 'Tirunelveli'), ('India', 'Tamil Nadu', 'Vellore'),
('India', 'Tamil Nadu', 'Thoothukudi'), ('India', 'Tamil Nadu', 'Tiruppur'),
('India', 'Karnataka', 'Bengaluru'), ('India', 'Karnataka', 'Mysore'),
('India', 'Karnataka', 'Hubli'), ('India', 'Karnataka', 'Mangaluru'),
('India', 'Karnataka', 'Belgaum'), ('India', 'Karnataka', 'Vijayapura'),
('India', 'Karnataka', 'Kalaburagi'), ('India', 'Karnataka', 'Davanagere'),
('India', 'Karnataka', 'Udupi'), ('India', 'Karnataka', 'Ballari'),
('India', 'Madhya Pradesh', 'Bhopal'), ('India', 'Madhya Pradesh', 'Indore'),
('India', 'Madhya Pradesh', 'Jabalpur'), ('India', 'Madhya Pradesh', 'Gwalior'),
('India', 'Madhya Pradesh', 'Ujjain'), ('India', 'Madhya Pradesh', 'Sagar'),
('India', 'Madhya Pradesh', 'Dewas'), ('India', 'Madhya Pradesh', 'Satna'),
('India', 'Madhya Pradesh', 'Ratlam'), ('India', 'Madhya Pradesh', 'Rewa'),
('China', 'Beijing', 'Beijing'), ('China', 'Shanghai', 'Shanghai'),
('China', 'Guangzhou', 'Chongqing'), ('China', 'Guangdong', 'Shenzhen'),
('China', 'Tianjin', 'Tianjin'), ('China', 'Chongqing', 'Chongqing'),
('China', 'Hubei', 'Wuhan'), ('China', 'Sichuan', 'Chengdu'),
('China', 'Shaanxi', "Xi'an"), ('China', 'Zhejiang', 'Hangzhou'),
('China', 'Jiangsu', 'Nanjing'), ('China', 'Hebei', 'Shijiazhuang'),
('China', 'Jiangsu', 'Suzhou'), ('China', 'Hunan', 'Changsha'),
('China', 'Shandong', 'Qingdao'), ('China', 'Liaoning', 'Dalian'),
('China', 'Henan', 'Zhengzhou'), ('China', 'Liaoning', 'Shenyang'),
('China', 'Harbin', 'Heilongjiang'), ('China', 'Yunnan', 'Kunming'),
('England', 'Greater London', 'London'), ('England', 'Greater Manchester', 'Manchester'),
('England', 'West Midlands', 'Birmingham'), ('England', 'Merseyside', 'Liverpool'),
('England', 'Bristol', 'Bristol'), ('England', 'West Yorkshire', 'Leeds'),
('England', 'Nottinghamshire', 'Nottingham'), ('England', 'South Yorkshire', 'Sheffield'),
('England', 'Hampshire', 'Southampton'), ('England', 'Leicestershire', 'Leicester'),
('England', 'Devon', 'Plymouth'), ('England', 'Oxfordshire', 'Oxford'),
('England', 'Cambridgeshire', 'Cambridge'), ('England', 'Norfolk', 'Norwich'),
('England', 'East Sussex', 'Brighton'), ('England', 'North Yorkshire', 'York'),
('England', 'Somerset', 'Bath'), ('England', 'West Midlands', 'Coventry'),
('England', 'Berkshire', 'Reading'),
('Japan', 'Tokyo', 'Tokyo'), ('Japan', 'Osaka', 'Osaka'), 
('Japan', 'Kanagawa', 'Yokohama'), ('Japan', 'Hokkaido', 'Sapporo'), 
('Japan', 'Aichi', 'Nagoya'), ('Japan', 'Fukuoka', 'Fukuoka'), 
('Japan', 'Kanagawa', 'Kawasaki'), ('Japan', 'Hyogo', 'Kobe'), 
('Japan', 'Kyoto', 'Kyoto'), ('Japan', 'Saitama', 'Saitama'), 
('Japan', 'Hiroshima', 'Hiroshima'), ('Japan', 'Miyagi', 'Sendai'), 
('Japan', 'Chiba', 'Chiba'), ('Japan', 'Fukuoka', 'Kitakyushu'), 
('Japan', 'Nara', 'Nara'), ('Japan', 'Shizuoka', 'Shizuoka'), 
('Japan', 'Kumamoto', 'Kumamoto'), ('Japan', 'Okayama', 'Okayama'), 
('Japan', 'Nagasaki', 'Nagasaki'), ('Japan', 'Ishikawa', 'Kanazawa'),
('USA', 'Illinois', 'Chicago'), ('USA', 'New York', 'New York City'), 
('USA', 'California', 'Los Angeles'), ('USA', 'Texas', 'Houston'), 
('USA', 'Arizona', 'Phoenix'), ('USA', 'Pennsylvania', 'Philadelphia'), 
('USA', 'Texas', 'San Antonio'), ('USA', 'California', 'San Diego'), 
('USA', 'California', 'San Jose'), ('USA', 'Texas', 'Dallas'), 
('USA', 'Texas', 'Austin'), ('USA', 'Texas', 'Fort Worth'), 
('USA', 'California', 'San Francisco'), ('USA', 'Florida', 'Jacksonville'), 
('USA', 'Indiana', 'Indianapolis'), ('USA', 'Ohio', 'Columbus'), 
('USA', 'North Carolina', 'Charlotte'), ('USA', 'Washington', 'Seattle'), 
('USA', 'Colorado', 'Denver'), ('USA', 'D.C', 'Washington');

insert into Products values
(default, 'Dolo', 'https://cdn01.pharmeasy.in/dam/products/059346/dolo-650mg-strip-of-15-tablets-2-1653986150.jpg?dim=320x320&dpr=1&q=100', 'Dolo 650mg Strip Of 15 Tablets', 'medicine', 28.56, 0.15, 1200, default),
(default, 'Cofsils', 'https://cdn01.pharmeasy.in/dam/products_otc/I04110/cofsils-orange-lozenges-strip-of-10-2-1669655050.jpg?dim=700x0&dpr=1&q=100', 'Cofsils Orange Lozenges Strip Of 10', 'medicine', 34.65, 0.15, 1200, default),
(default, 'Koflet-H', 'https://cdn01.pharmeasy.in/dam/products_otc/100343/koflet-h-orange-flavour-strip-of-6-lozenges-2-1679653351.jpg?dim=700x0&dpr=1&q=100', 'Koflet H Orange Flavour Strip Of 6 Lozenges', 'medicine', 32.4, 0.15, 1200, default),
(default, 'Digene', 'https://cdn01.pharmeasy.in/dam/products_otc/272033/digene-acidity-gas-relief-tablets-15s-mixed-fruit-flavour-2-1671740738.jpg?dim=700x0&dpr=1&q=100', 'Digene Acidity & Gas Relief Tablets 15s- Mixed Fruit Flavour', 'medicine', 22.21, 0.15, 1200, default),
(default, 'Zincovit', 'https://cdn01.pharmeasy.in/dam/products_otc/188996/zincovit-strip-of-15-tablets-green-2-1702990444.jpg?dim=700x0&dpr=1&q=100', 'Zincovit Strip Of 15 Tablets (Green)', 'medicine', 110, 0.15, 1200, default),
(default, 'Nurobion Plus', 'https://cdn01.pharmeasy.in/dam/products/122021/neurobion-plus-strip-of-10-tablets-2-1656662066.jpg?dim=700x0&dpr=1&q=100', 'Neurobion Plus Strip Of 10 Tablets', 'medicine', 126.1, 0.15, 1200, default),
(default, 'Livogen-Z', 'https://cdn01.pharmeasy.in/dam/products_otc/I32380/livogen-z-captab-15s-2-1669710431.jpg?dim=700x0&dpr=1&q=100', 'Livogen Z Captab 15', 'medicine', 88.35, 0.15, 1200, default),
(default, 'Pan D', 'https://cdn01.pharmeasy.in/dam/products/I03192/pan-d-strip-of-15-capsules-2-1641535847.jpg?dim=320x320&dpr=1&q=100', 'Pan D Strip Of 15 Capsules', 'medicine', 178.5, 0.15, 1200, default),
(default, 'Shelcal', 'https://cdn01.pharmeasy.in/dam/products_otc/159115/shelcal-500mg-strip-of-15-tablets-2-1679999355.jpg?dim=700x0&dpr=1&q=100', 'Shelcal 500mg Strip Of 15 Tablets', 'medicine', 120.8, 0.15, 1200, default),
(default, 'Calcimax', 'https://cdn01.pharmeasy.in/dam/products_otc/I13917/calcimax-p-strip-of-15-tablets-2-1669710266.jpg?dim=700x0&dpr=1&q=100', 'Calcimax P Strip Of 15 Tablets', 'medicine', 190.44, 0.15, 1200, default),
(default, 'Telmikind', 'https://cdn01.pharmeasy.in/dam/products/254917/telmikind-ct-40mg-strip-of-10-tablets-2-1648821132.jpg?dim=320x320&dpr=1&q=100', 'Telmikind 40mg Strip Of 10 Tablets', 'medicine', 36.77, 0.15, 1200, default),
(default, 'Amlokind', 'https://cdn01.pharmeasy.in/dam/products/S37463/amlokind-at-5-50mg-strip-of-15-tablets-1-1641539057.jpg?dim=320x320&dpr=1&q=100', 'Amlokind At 5/50mg Strip Of 15 Tablets', 'medicine', 41.69, 0.15, 1200, default),
(default, 'Liv.52', 'https://cdn01.pharmeasy.in/dam/products_otc/105920/himalaya-liv52-tablets-100s-2-1671740901.jpg?dim=700x0&dpr=1&q=100', 'Himalaya Liv.52 Tablets - 100', 'medicine', 159.8, 0.15, 1200, default),
(default, 'Rantac Od', 'https://cdn01.pharmeasy.in/dam/products/270547/rantac-od-300mg-strip-of-10-tablets-2-1688725478.jpg?dim=320x320&dpr=1&q=100', 'Rantac Od 300mg Strip Of 10 Tablets', 'medicine', 61.45, 0.15, 1200, default),
(default, 'Ecosprin', 'https://cdn01.pharmeasy.in/dam/products/064422/ecosprin-av-75mg-strip-of-15-capsules-1-1641535995.jpg?dim=320x320&dpr=1&q=100', 'Ecosprin Av 75mg Strip Of 15 Capsules', 'medicine', 56.40, 0.15, 1200, default),
(default, 'Liveasy', 'https://cdn01.pharmeasy.in/dam/products_otc/E34104/liveasy-foods-healthy-seed-mix-blend-of-6-fibre-rich-healthy-seeds-2-1656420891.jpg?dim=700x0&dpr=1&q=100', 'Liveasy Foods Healthy Seed Mix - Blend Of 6 Fibre Rich Healthy Seeds - 200 Gms', 'healthcare', 188.46, 0.15, 1200, default),
(default, 'Boroplus', 'https://cdn01.pharmeasy.in/dam/products_otc/028190/boroplus-antiseptic-cream-40-ml-2-1669634850.jpg?dim=700x0&dpr=1&q=100', 'Boroplus Antiseptic Cream 40 Ml', 'helathcare', 75, 0.15, 1200, default),
(default, 'Vicks Vaporub', 'https://cdn01.pharmeasy.in/dam/products_otc/181150/vicks-vaporub-10ml-relief-from-cold-cough-headache-and-body-pain-2-1677525517.jpg?dim=700x0&dpr=1&q=100', 'Vicks Vaporub 10ml Relief From Cold Cough Headache And Body Pain', 'healthcare', 44.55, 0.15, 1200, default),
(default, 'Vaseline Deep Moisture', 'https://cdn01.pharmeasy.in/dam/products_otc/O79319/vaseline-intensive-care-deep-moisture-body-lotion-600-ml-2-1671742917.jpg?dim=700x0&dpr=1&q=100', 'Vaseline Intensive Care Deep Moisture Body Lotion - 600 Ml', 'healthcare', 543.75, 0.15, 1200, default),
(default, 'Amrutanjan', 'https://cdn01.pharmeasy.in/dam/products_otc/D07856/amrutanjan-new-maha-strong-pain-balm-50ml-2-1697103351.jpg?dim=700x0&dpr=1&q=100', 'Amrutanjan New Maha Strong Pain Balm 50ml', 'healthcare', 169.2, 0.15, 1200, default),
(default, 'Colgate', 'https://cdn01.pharmeasy.in/dam/products_otc/I12598/colgate-visible-white-sparking-mint-whitening-toothpaste-tube-of-100-g-2-1669710149.jpg?dim=700x0&dpr=1&q=100', 'Colgate Visible White Sparking Mint Whitening Toothpaste Tube Of 100 G', 'healthcare', 149, 0.15, 1200, default),
(default, 'Sensodyne', 'https://cdn01.pharmeasy.in/dam/products_otc/222329/sensodyne-fresh-mint-toothpaste-tube-of-40-g-2-1671741808.jpg?dim=700x0&dpr=1&q=100', 'Sensodyne Fresh Mint Toothpaste Tube Of 40 G', 'healthcare', 84.15, 0.15, 1200, default),
(default, 'Dettol Antiseptic', 'https://cdn01.pharmeasy.in/dam/products_otc/I40695/dettol-antiseptic-liquid-bottle-of-550-ml-2-1669710729.jpg?dim=700x0&dpr=1&q=100', 'Dettol Antiseptic Disinfectant Liquid, 550ml', 'healthcare', 235, 0.15, 1200, default),
(default, 'Dettol Handwash', 'https://cdn01.pharmeasy.in/dam/products_otc/I48130/dettol-original-handwash-pump-free-skincare-refill-200ml-175ml-2-1691586274.jpg?dim=700x0&dpr=1&q=100', 'Dettol Original Handwash Pump + Free Skincare Refill 200ml + 175ml', 'healthcare', 96, 0.15, 1200, default),
(default, 'Glucometer', 'https://cdn01.pharmeasy.in/dam/products_otc/I05582/dr-morepen-gluco-one-bg-03-glucometer-test-strips-box-of-50-1-1669655233.jpg?dim=700x0&dpr=1&q=100', 'Dr. Morepen Gluco One Bg 03 Glucometer Test Strips Box Of 50', 'devices', 602.50, 0.15, 1200, default),
(default, 'Glucometer', 'https://cdn01.pharmeasy.in/dam/products_otc/000665/accu-chek-active-glucometer-test-strips-box-of-50-1-1669655023.jpg?dim=700x0&dpr=1&q=100', 'Accu-Chek Active Glucometer Test Strips Box Of 50', 'devices', 984, 0.15, 1200, default),
(default, 'Glucometer', 'https://cdn01.pharmeasy.in/dam/products_otc/K68237/accu-chek-active-glucometer-kit-with-free-10-strips-dr-morepen-bp-one-bp02-bp-monitor-combo-2-1671742323.jpg?dim=700x0&dpr=1&q=100', 'Accu-Chek Active Glucometer Kit With Free 10 Strips + Dr Morepen Bp One Bp02 Bp Monitor Combo', 'devices', 1898.98, 0.15, 1200, default),
(default, 'Thermometer', 'https://cdn01.pharmeasy.in/dam/products_otc/W16773/pharmeasy-digital-thermometer-2-1700220095.jpg?dim=700x0&dpr=1&q=100', 'Pharmeasy Digital Thermometer', 'devices', 165, 0.15, 1200, default),
(default, 'Thermometer', 'https://cdn01.pharmeasy.in/dam/products_otc/B63401/pharmeasy-infrared-thermometer-2-1671745340.jpg?dim=700x0&dpr=1&q=100', 'Pharmeasy Infrared Thermometer', 'devices', 659.70, 0.15, 1200, default),
(default, 'Oximeter', 'https://cdn01.pharmeasy.in/dam/products_otc/R08890/oxysat-finger-tip-pulse-oximeter-with-spo2-perfusion-index-oleds-display-18m-warranty-orange-2-1690014097.jpg?dim=700x0&dpr=1&q=100', 'Oxysat - Finger Tip Pulse Oximeter With Spo2, Perfusion Index Oleds Display & 18m Warranty, Orange', 'devices', 1429, 0.15, 1200, default),
(default, 'Nailcutter', 'https://cdn01.pharmeasy.in/dam/products_otc/V36025/liveasy-essentials-nail-cutter-2-1671742475.jpg?dim=700x0&dpr=1&q=100', 'Liveasy Essentials Nail Cutter', 'devices', 109.35, 0.15, 1200, default),
(default, 'Hot Water Bag', 'https://cdn01.pharmeasy.in/dam/products_otc/B39499/pharmeasy-hot-water-bag-relieves-pain-relaxes-sore-muscles-improves-blood-supply-blue-2l-2-1671777719.jpg?dim=700x0&dpr=1&q=100', 'Pharmeasy Hot Water Bag - Relieves Pain - Relaxes Sore Muscles - Improves Blood Supply - Blue - 2l', 'devices', 275.51, 0.15, 1200, default),
(default, 'Thermometer', 'https://cdn01.pharmeasy.in/dam/products_otc/C59636/control-d-thermometer-1-1654252158.jpg?dim=700x0&dpr=1&q=100', 'Control D Thermometer', 'devices', 224.1, 0.15, 1200, default),
(default, 'Coviself', 'https://cdn01.pharmeasy.in/dam/products_otc/O70942/coviself-covid-self-test-kit-2-1671742428.jpg?dim=700x0&dpr=1&q=100', 'Coviself Covid Self Test Kit', 'devices', 195, 0.15, 1200, default),
(default, 'Weighing scale', 'https://cdn01.pharmeasy.in/dam/products_otc/V35573/omron-hn-289-weighing-scale-2-1641790916.jpg?dim=700x0&dpr=1&q=100', 'Omron Hn-289 Weighing Scale', 'devices', 2217, 0.15, 1200, default);