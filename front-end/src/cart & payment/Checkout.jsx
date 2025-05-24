import { useState } from "react";
import React, { useContext } from "react";
import { AppContext } from "../data managment/AppProvider";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const Checkout = ({ onSuccess }) => {
  const { total, cartShipping, cart } = useContext(AppContext);

  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [currency, setCurrency] = useState(options.currency);

  const onCurrencyChange = ({ target: { value } }) => {
    setCurrency(value);
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: value,
      },
    });
  };
  const onCreateOrder = (data, actions) => {
    const items = cart.map((item) => {
      const price = (item.newPrice ?? item.price) || 0;
      return {
        name: item.product_name,
        unit_amount: {
          value: price.toFixed(2), // PayPal expects string here
          currency_code: "USD",
        },
        quantity: item.amount.toString(),
        // image_url is not officially supported in PayPal's items,
        // but you can add it as a custom field or metadata if needed elsewhere
      };
    });

    // Calculate subtotal and tax with 2 decimals as strings
    const subtotal = total.toFixed(2);
    const taxAmount = (total * 0.1).toFixed(2);
    const totalWithTax = (parseFloat(subtotal) + parseFloat(taxAmount)).toFixed(
      2
    );

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalWithTax,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: subtotal,
              },
              tax_total: {
                currency_code: "USD",
                value: taxAmount,
              },
            },
          },
          items,
        },
      ],
    });
  };

  // const onCreateOrder = (data, actions) => {
  //   return actions.order.create({
  //     purchase_units: [
  //       {
  //         amount: {
  //           value: total,
  //         },
  //       },
  //     ],
  //   });
  // };

  // const onApproveOrder = (data, actions) => {
  //   return actions.order.capture().then((details) => {
  //     const name = details.payer.name.given_name;
  //     alert(`Transaction completed by ${name}`);
  //     onSuccess();
  //   });
  // };

  //   console.log(details);
  //   {
  //   "payer": {
  //     "email_address": "customer@example.com",
  //     "name": {
  //       "given_name": "John",
  //       "surname": "Doe"
  //     },
  //     "payer_id": "ABC123XYZ"
  //   },
  //   "purchase_units": [
  //     {
  //       "shipping": {
  //         "name": {
  //           "full_name": "John Doe"
  //         },
  //         "address": {
  //           "address_line_1": "123 Main St",
  //           "admin_area_2": "City",
  //           "admin_area_1": "State",
  //           "postal_code": "12345",
  //           "country_code": "US"
  //         }
  //       },
  //       ...
  //     }
  //   ],
  //   "status": "COMPLETED"
  // }
  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then((details) => {
      const clientData = {
        // fullName: details.purchase_units[0]?.shipping?.name?.full_name,
        fullName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
        name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
        email: details.payer.email_address,
        country:
          details.purchase_units?.[0]?.shipping?.address?.country_code || "N/A",
        state: details.purchase_units[0]?.shipping?.address?.admin_area_1,
        city: details.purchase_units[0]?.shipping?.address?.admin_area_2,
        street: details.purchase_units[0]?.shipping?.address?.address_line_1,
        transactionId: details.id,
        postalCode: details.purchase_units[0]?.shipping?.address?.postal_code,
        countryCode: details.purchase_units[0]?.shipping?.address?.country_code,
        phone: details.purchase_units[0]?.shipping?.address?.phone,
        last4:
          details.purchase_units[0]?.payments?.captures[0]?.card_last_digits ||
          "****",
        created: details.create_time || new Date().toISOString(),
        amount: details.purchase_units[0]?.amount?.value,
      };

      // You can save this to context, localStorage, or your backend
      cartShipping(clientData);
      alert(`Transaction completed by ${fullName}`);

      onSuccess();
    });
  };

  return (
    <div className="checkout">
      {isPending ? (
        <p>LOADING...</p>
      ) : (
        <div className="paypal">
          <select
            value={currency}
            onChange={onCurrencyChange}
            data-testid="money-div"
          >
            <option value="USD">💵 USD</option>
            <option value="EUR">💶 Euro</option>
          </select>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => onCreateOrder(data, actions)}
            onApprove={(data, actions) => onApproveOrder(data, actions)}
          />
        </div>
      )}
    </div>
  );
};

export default Checkout;
