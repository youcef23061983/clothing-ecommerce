import { useState } from "react";
import React, { useContext } from "react";
import { AppContext } from "../data managment/AppProvider";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const Checkout = ({ onSuccess }) => {
  const { total, cart, shipping } = useContext(AppContext);
  const [customerData, setCustomerData] = useState(null);

  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [currency, setCurrency] = useState(options.currency);
  const shippingPrice = parseFloat((total * 0.13).toFixed(2));
  const tax = parseFloat((total * 0.1).toFixed(2));
  const totalAll = parseFloat((total + shippingPrice + tax).toFixed(2));

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
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalAll,
          },
        },
      ],
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then((details) => {
      const clientData = {
        fullName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
        email: details.payer.email_address,
        country:
          details.purchase_units?.[0]?.shipping?.address?.country_code || "N/A",
        state: details.purchase_units[0]?.shipping?.address?.admin_area_1,
        city: details.purchase_units[0]?.shipping?.address?.admin_area_2,
        address: details.purchase_units[0]?.shipping?.address,
        transactionId: details.id,
        postalCode: details.purchase_units[0]?.shipping?.address?.postal_code,
        countryCode: details.purchase_units[0]?.shipping?.address?.country_code,
        phone: details.purchase_units[0]?.shipping?.address?.phone,
        paymentMethod: "PayPal",
        last4:
          details.purchase_units[0]?.payments?.captures[0]?.card_last_digits ||
          "****",
        created: details.create_time || new Date().toISOString(),
        amount: details.purchase_units[0]?.amount?.value,
        currency: currency,
        status: details.status || "COMPLETED",
        payerId: details.payer.payer_id,
      };

      setCustomerData(clientData);
      onSuccess();
    });
  };

  return (
    <div className="checkout">
      {isPending ? (
        <div className="flex justify-center item?s-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Original Checkout (Enhanced) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between item?s-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Complete Payment
              </h2>
              <select
                value={currency}
                onChange={onCurrencyChange}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <PayPalButtons
              style={{
                layout: "vertical",
              }}
              createOrder={(data, actions) => onCreateOrder(data, actions)}
              onApprove={(data, actions) => onApproveOrder(data, actions)}
            />
          </div>

          {/* Enhanced Client Data Display */}
          {customerData && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg">
              {/* Header with PayPal branding */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-5 flex item?s-center">
                <div className="bg-white p-1.5 rounded-full mr-3">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                    {/* PayPal logo SVG remains the same */}
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Order Confirmation
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {new Date(customerData.created).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Main Content Sections */}
              <div className="space-y-6 p-6">
                {/* Section 1: Order Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h2 className="text-lg font-bold text-blue-800 mb-3 border-b pb-2">
                    Order Summary
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Order Number</p>
                      <p className="font-mono text-sm">
                        {customerData.transactionId}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Payment Status</p>
                      <span className="inline-flex item?s-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {customerData.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Total Amount</p>
                      <p className="text-xl font-bold text-blue-600">
                        {customerData.amount} {customerData.currency}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Customer Information */}
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">
                    Customer Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">
                        Contact Details
                      </h3>
                      <p className="text-gray-900">{customerData.fullName}</p>
                      <p className="text-blue-600">{customerData.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">
                        Payment Method
                      </h3>
                      <div className="flex item?s-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium mr-2">
                          PayPal
                        </span>
                        <span>•••• {customerData.last4}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Shipping Information */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <svg
                      className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
                      Shipping Details
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Address Line 1 - with letter-spacing */}
                    <div className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0 tracking-tight">
                        Address:
                      </span>
                      <p className="font-medium text-gray-700 tracking-wide leading-relaxed">
                        {customerData.address?.address_line_1 ||
                          "Not specified"}
                      </p>
                    </div>

                    {/* Address Line 2 */}
                    {customerData.address?.address_line_2 && (
                      <div className="flex">
                        <span className="text-gray-500 w-24 flex-shrink-0 tracking-tight">
                          Line 2:
                        </span>
                        <p className="font-medium text-gray-700 tracking-wide leading-relaxed">
                          {customerData.address.address_line_2}
                        </p>
                      </div>
                    )}

                    {/* City/State/Zip - with better spacing */}
                    <div className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0 tracking-tight">
                        Location:
                      </span>
                      <p className="font-medium text-gray-700 tracking-wide leading-relaxed">
                        <span className="mr-2">{customerData.city},</span>
                        <span className="mr-2">{customerData.state}</span>
                        <span>{customerData.postalCode}</span>
                      </p>
                    </div>

                    {/* Country - with separation */}
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24 flex-shrink-0 tracking-tight">
                        Country:
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700 tracking-wide">
                          {customerData.country}
                        </span>
                        {customerData.countryCode && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded tracking-tighter">
                            {customerData.countryCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Estimate with proper spacing */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap items-center gap-x-2 text-sm tracking-wide">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600">
                        Free standard shipping
                      </span>
                      <span className="text-gray-400 hidden sm:inline">•</span>
                      <span className="text-gray-600">Delivery: 3-5 days</span>
                    </div>
                  </div>
                </div>
                {/* Section 4: Order Item?s */}
                <div className="border rounded-lg overflow-hidden">
                  <h2 className="text-lg font-bold text-gray-800 bg-gray-50 px-4 py-3 border-b">
                    Your Order Item?s
                  </h2>
                  <div className="divide-y divide-gray-200">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 p-4 hover:bg-gray-50"
                      >
                        {/* Product column */}
                        <div className="col-span-6 flex item?s-center">
                          <img
                            src={
                              item?.images?.[0] || "/placeholder-product.jpg"
                            }
                            alt={item?.product_name}
                            className="h-16 w-16 object-cover rounded-md mr-3"
                          />
                          <div>
                            <p className="font-medium">{item?.product_name}</p>
                            <p className="text-sm text-gray-500">
                              SKU: {item?.id}
                            </p>
                          </div>
                        </div>

                        {/* Quantity column */}
                        <div className="col-span-2 flex item?s-center justify-center">
                          <p>{item?.amount}</p>
                        </div>

                        {/* Price column */}
                        <div className="col-span-2 flex item?s-center justify-center">
                          <p>{item?.newPrice || item?.price} $</p>
                        </div>

                        {/* Total column */}
                        <div className="col-span-2 flex item?s-center justify-center">
                          <p className="font-medium">
                            {(item?.newPrice || item?.price) * item?.amount} $
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Order Totals */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">
                    Order Totals
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{total} $</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{shippingPrice} $</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>{tax} $</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>
                        {totalAll} {currency} $
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 6: Help Information */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h2 className="text-lg font-bold text-yellow-800 mb-2">
                    Need Help With Your Order?
                  </h2>
                  <p className="text-sm text-yellow-700">
                    Contact our customer support at support@example.com or call
                    (123) 456-7890
                  </p>
                </div>
              </div>

              {/* Footer with receipt download */}
              <div className="bg-gray-50 px-6 py-4 border-t flex justify-between item?s-center">
                <p className="text-sm text-gray-500">
                  An email confirmation has been sent to {customerData.email}
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex item?s-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;
