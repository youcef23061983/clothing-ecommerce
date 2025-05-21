CREATE TYPE product_type AS ENUM (
  'jacket',
  'jeans',
  'shoes',
  'shirt',
  'trousers',
  'tshirt',
  'sneaker',
  'sweatshirt'
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_name TEXT NOT NULL,
  description TEXT,
  type product_type NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  new_price NUMERIC(10, 2),
  sizes TEXT[], -- array of 's', 'm', 'l', etc.
  images TEXT[], -- array of image URLs
  new_arrival BOOLEAN DEFAULT false,
  on_sale BOOLEAN DEFAULT false,
  best_seller BOOLEAN DEFAULT false,
  rating NUMERIC(2, 1),
  preview INTEGER,
  amount INTEGER DEFAULT 1
);


INSERT INTO products (
   product_name, description, type, price, new_price, sizes, images,
  new_arrival, on_sale, best_seller, rating, preview, amount
)
VALUES
-- Product 1
( 'Men''s Classic Wool Overcoat 2023',
 'Latest 2023 Custom Latest Design Spring Winter Wool Men Overcoat Casual Slim Fit Long Woolen Coat High Quality Men''s wool coat',
 'jacket', 79.99, NULL, 
 ARRAY['s','m','l','xl'],
 ARRAY[
   '/images/men/jacket1/image1.jpg',
   '/images/men/jacket1/image2.jpg',
   '/images/men/jacket1/image3.jpg',
   '/images/men/jacket1/image4.jpg'
 ],
 true, false, true, 4.0, 11, 1),

-- Product 2
( 'Men’s Classic Brown Leather Jacket',
 'Long Lasting Quality Popular Brown In Color Leather Jacket jackets For Men Fashionable Trending Cloths Accessories',
 'jacket', 59.99, 39.99,
 ARRAY['s','m','l','xl'],
 ARRAY[
   '/images/men/jacket2/image1.jpg',
   '/images/men/jacket2/image2.jpg',
   '/images/men/jacket2/image3.jpg',
   '/images/men/jacket2/image4.jpg'
 ],
 false, true, false, 3.8, 12, 1),

-- Product 3
( 'Ultra Light Waterproof Down Puffer Jacket',
 'Ultra Light Outdoor Hiking Unisex Men Warm Insulated Duck Down Coat Waterproof Padded Quilted Puffer Jacket',
 'jacket', 59.99, 49.99,
 ARRAY['s','m','l','xl'],
 ARRAY[
   '/images/men/jacket3/image1.jpg',
   '/images/men/jacket3/image2.jpg',
   '/images/men/jacket3/image3.jpg',
   '/images/men/jacket3/image4.jpg'
 ],
 false, true, true, 3.0, 11, 1),

-- Product 4
( 'Men''s Winter Fleece Jacket - Cotton-Padded Sports Coat',
 'Hot Selling Men''s Winter Fleece Jaket Coat Long Sleeve Solid Color Cotton-padded Shirt Jacket Mens Sports Jacket',
 'jacket', 79.99, 59.99,
 ARRAY['s','m','l','xl'],
 ARRAY[
   '/images/men/jacket4/image1.jpg',
   '/images/men/jacket4/image2.jpg',
   '/images/men/jacket4/image3.jpg',
   '/images/men/jacket4/image4.jpg'
 ],
 true, false, false, 2.8, 10, 1),

-- Product 5
('Army Green Puffer Jacket with Removable Hood',
 'Army Green puffer jacket zip up inside and out side buttons with removable hood customize cheap price',
 'jacket', 29.99, 19.99,
 ARRAY['s','m','l','xl'],
 ARRAY[
   '/images/men/jacket5/image1.jpg',
   '/images/men/jacket5/image2.jpg',
   '/images/men/jacket5/image3.jpg',
   '/images/men/jacket5/image4.jpg'
 ],
 false, true, true, 2.0, 13, 1),
(
  
  'Vintage Ripped Elastic Breathable Men''s Denim Jeans',
  'Fashion New Design Hot-sell ripped vintage Elastic Breathable Long Pants Men''s Denim jean''s loose jeans for men',
  'jeans',
  39.99,
  NULL,
  ARRAY['s', 'm', 'l', 'xl'],
  ARRAY[
    '/images/men/jeans/image1.jpg',
    '/images/men/jeans/image2.jpg',
    '/images/men/jeans/image3.jpg',
    '/images/men/jeans/image4.jpg'
  ],
  true,
  false,
  true,
  4.2,
  11,
  1
),
(
  
  'Custom Double Breasted Men''s Long Sleeve Shirt',
  'Custom Fashion Men''s Long Sleeve Shirt Double Breasted Long Sleeve Menufecture Shirt for men',
  'shirt',
  29.99,
  19.99,
  ARRAY['s', 'm', 'l', 'xl'],
  ARRAY[
    '/images/men/shirt/image1.jpg',
    '/images/men/shirt/image2.jpg',
    '/images/men/shirt/image3.jpg',
    '/images/men/shirt/image4.jpg'
  ],
  false,
  true,
  true,
  3.7,
  8,
  1
),
(
  
  'Affordable Men''s Short Sleeve Office Shirt',
  'Cheap office shirt men short sleeve Casual men''s office plain shirt wear shirts for men office',
  'shirt',
  17.99,
  NULL,
  ARRAY['s', 'm', 'l', 'xl'],
  ARRAY[
    '/images/men/shirt2/image1.jpg',
    '/images/men/shirt2/image2.jpg',
    '/images/men/shirt2/image3.jpg',
    '/images/men/shirt2/image4.jpg'
  ],
  true,
  false,
  false,
  2.0,
  9,
  1
),
(
  
  'LANCI Genuine Cowhide Leather Men’s Loafers',
  'LANCI Cow Skin Real Leather Men Casual Footwear Shoes Men''S Loafer Shoes Good Quality',
  'shoes',
  29.99,
  19.99,
  ARRAY[39, 40, 41, 42],
  ARRAY[
    '/images/men/shoes/image1.jpg',
    '/images/men/shoes/image2.jpg',
    '/images/men/shoes/image3.jpg',
    '/images/men/shoes/image4.jpg'
  ],
  false,
  true,
  true,
  2.8,
  13,
  1
),
(
  
  'Men’s High-Quality Leather Lace-Up Dress Boots',
  'High Quality Leather Shoes Lace Up Stylish Formal Casual Business Boots Men Dress Shoes New Design Men Leather Shoes',
  'shoes',
  89.99,
  NULL,
  ARRAY[39, 40, 41, 42],
  ARRAY[
    '/images/men/shoes2/image1.jpg',
    '/images/men/shoes2/image2.jpg',
    '/images/men/shoes2/image3.jpg',
    '/images/men/shoes2/image4.jpg'
  ],
  true,
  false,
  false,
  4.4,
  10,
  1
),
( 'Men’s White Leather Running & Skate Sneakers', 'Top quality Man Leather Shoe sports Running Sneakers, White fashion men''s skateboard Casual Shoes', 'sneaker', 49.99, 39.99, ARRAY[39, 40, 41, 42], ARRAY[
  '/images/men/sneakers1/image1.jpg',
  '/images/men/sneakers1/image2.jpg',
  '/images/men/sneakers1/image3.jpg',
  '/images/men/sneakers1/image4.jpg'
], false, true, true, 3.8, 8, 1),

( 'GT-2000-11 Men''s Lightweight Racing Running Shoes', 'Genuine GT-2000-11 Stable Support Racing Shoe Lightweight Cushioning Elastic Durable Casual Men''s Running Shoe', 'sneaker', 29.99, NULL, ARRAY[39, 40, 41, 42], ARRAY[
  '/images/men/sneakers2/image1.jpg',
  '/images/men/sneakers2/image2.jpg',
  '/images/men/sneakers2/image3.jpg',
  '/images/men/sneakers2/image4.jpg'
], true, false, false, 4.4, 9, 1),

( 'Breathable Lace-up Casual Women’s Walking Sneakers', 'Factory Wholesale Breathable Walking Style Shies High Quality Lace-up Casual Women Sneakers', 'sneaker', 29.99, 19.99, ARRAY[39, 40, 41, 42], ARRAY[
  '/images/men/sneakers3/image1.jpg',
  '/images/men/sneakers3/image2.jpg',
  '/images/men/sneakers3/image3.jpg',
  '/images/men/sneakers3/image4.jpg'
], false, true, true, 4.7, 10, 1),

( 'High Quality Mesh Breathable Men’s Casual Running Sneakers', 'Wholesale Popular New Design High Quality Fashion Mesh Breathable Shoes Men Casual Running Sneakers', 'sneaker', 39.99, NULL, ARRAY[39, 40, 41, 42], ARRAY[
  '/images/men/sneakers4/image1.jpg',
  '/images/men/sneakers4/image2.jpg',
  '/images/men/sneakers4/image3.jpg',
  '/images/men/sneakers4/image4.jpg'
], true, false, false, 4.1, 11, 1),

( 'Popular Breathable Anti-Slip Men’s Athletic Sport Shoes', 'Popular fashion athletic anti slip men sport shoes breathable Casual sport shoes', 'sneaker', 49.99, 39.99, ARRAY[39, 40, 41, 42], ARRAY[
  '/images/men/sneakers5/image1.jpg',
  '/images/men/sneakers5/image2.jpg',
  '/images/men/sneakers5/image3.jpg',
  '/images/men/sneakers5/image4.jpg'
], false, true, true, 4.8, 12, 1),

(
  
  'Wholesale Custom Oversized Cropped Hoodie for Men & Unisex',
  'wholesale winter hoodies & sweatshirts unisex manufacturers Custom blank cropped oversized men high quality cut and sew hoodie',
  'sweatshirt',
  29.99,
  NULL,
  ARRAY['s', 'm', 'l', 'xl'],
  ARRAY[
    '/images/men/sweatshirt1/image1.jpg',
    '/images/men/sweatshirt1/image2.jpg',
    '/images/men/sweatshirt1/image3.jpg',
    '/images/men/sweatshirt1/image4.jpg'
  ],
  true,
  false,
  false,
  4.3,
  9,
  1
),
(
  
  'Casual Streetwear Men’s Pullover Sweatshirt – Stylish Winter Essential',
  'Casual Street Wear Pullover Plain Full Sleeve Winter Style Men Sweatshirts Best Quality Men Wear Stylish Sweatshirts',
  'sweatshirt',
  29.99,
  19.99,
  ARRAY['s', 'm', 'l', 'xl'],
  ARRAY[
    '/images/men/sweatshirt2/image1.jpg',
    '/images/men/sweatshirt2/image2.jpg',
    '/images/men/sweatshirt2/image3.jpg',
    '/images/men/sweatshirt2/image4.jpg'
  ],
  false,
  true,
  true,
  4.7,
  10,
  1
),
(
  
  'Wholesale Office Khaki & Black Cotton-Spandex Business Pants for Men',
  'Wholesale blank office khaki men''s business pants black cotton spandex elastic casual men''s pants',
  'trousers',
  29.99,
  NULL,
  ARRAY['s', 'm', 'l', 'xl'],
  ARRAY[
    '/images/men/trousers1/image1.jpg',
    '/images/men/trousers1/image2.jpg',
    '/images/men/trousers1/image3.jpg',
    '/images/men/trousers1/image4.jpg'
  ],
  true,
  false,
  false,
  4.2,
  11,
  1
),
(
  
  'Men''s Fashion Khaki Jogger Pants - Custom Quality',
  'Custom Sale Men Latest Fashion Khaki Color Good Quality Jogger Pants',
  'trousers',
  39.99,
  29.99,
  ARRAY['s', 'm', 'l', 'xl'],
  ARRAY[
    '/images/men/trousers2/image1.jpg',
    '/images/men/trousers2/image2.jpg',
    '/images/men/trousers2/image3.jpg',
    '/images/men/trousers2/image4.jpg'
  ],
  false,
  true,
  true,
  2.7,
  14,
  1
),
(
  
  'Men''s Oversized Drop Shoulder Heavyweight Cotton T-Shirt – Custom Print Ready',
  'Wholesale Oversized Drop Shoulder T-shirt Mens Blank Heavyweight Cotton Tshirt Custom Printing Men T Shirts',
  'tshirt',
  19.99,
  NULL,
  ARRAY['s', 'm', 'l', 'xl'],
  ARRAY[
    '/images/men/tshirt/image1.jpg',
    '/images/men/tshirt/image2.jpg',
    '/images/men/tshirt/image3.jpg',
    '/images/men/tshirt/image4.jpg'
  ],
  true,
  false,
  false,
  2.2,
  10,
  1
);
CREATE TYPE role AS ENUM ('customer', 'admin');

CREATE TABLE tbluser (
    id SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    contact VARCHAR(15),
    accounts TEXT[],
    password TEXT,
    provider VARCHAR(10) NULL,
    country TEXT,
    currency VARCHAR(5) NOT NULL DEFAULT 'USD',
    user_role role NOT NULL DEFAULT 'customer',  -- Included here directly
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);