import { useContext } from "react";
import { AppContext } from "../data managment/AppProvider";
import { CiTrash } from "react-icons/ci";

const CartItem = ({ item }) => {
  const { remove, increase, decrease } = useContext(AppContext);
  let itemsPrice = (item?.newPrice || item?.price) * item?.amount;
  itemsPrice = parseFloat(itemsPrice.toFixed(2));

  return (
    <div className="cartDiv" data-testid="cart-item">
      <div className="cartImg">
        <img
          src={item?.images[0]}
          alt="cartItem"
          loading="lazy"
          className="img"
        />
      </div>
      <h3 className="cartName">{item?.product_name}</h3>
      <div>
        <h3>{item?.newPrice || item?.price} $</h3>
        <h3>{itemsPrice} $</h3>
      </div>
      <div className="cartAmount">
        <button className="cartBtn" onClick={() => decrease(item?.id)}>
          -
        </button>
        <div>
          <h3>{item?.amount}</h3>
        </div>
        <button className="cartBtn" onClick={() => increase(item?.id)}>
          +
        </button>
      </div>
      <div>
        <CiTrash className="cartTrash" onClick={() => remove(item?.id)} />
      </div>
    </div>
  );
};

export default CartItem;
