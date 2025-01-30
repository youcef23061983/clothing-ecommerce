import React from "react";
import Product from "../pages/Product";
import { motion } from "framer-motion";

const Products = ({ productsFilter, searchParams }) => {
  return (
    <motion.div layout className="productsDiv">
      {productsFilter?.map((product) => {
        return (
          <Product
            key={product.id}
            product={product}
            searchParams={searchParams}
          />
        );
      })}
    </motion.div>
  );
};

export default Products;
