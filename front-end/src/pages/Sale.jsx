import React from "react";
import img from "../images/men/banner/sale.jpg";
import Product from "./Product";
import { useQuery } from "@tanstack/react-query";

const Sale = () => {
  const productsFun = async () => {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) {
      throw Error("there is no products data");
    }
    return res.json();
  };
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: productsFun,
  });
  const productsFilter = data?.filter((product) => product.onSale === true);
  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <div>
        <h2 className="orderTitle">Your Sale</h2>
        <div className="productsDiv">
          {productsFilter?.map((product) => {
            return <Product key={product.id} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Sale;