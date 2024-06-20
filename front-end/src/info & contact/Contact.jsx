import React from "react";
import img from "../images/men/banner/contact.jpg";
import emailjs from "@emailjs/browser";
import { useRef } from "react";

const Contact = () => {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_vgkozvc", "template_sv5btsr", form.current, {
        publicKey: import.meta.env.VITE_CONTACT_PUBLIC_KEY,
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };
  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <div className="form">
        <div className="touches">
          <h2>GET IN TOUCH</h2>
          <div className="touch">
            <h4>Address:</h4>
            <p>-------</p>
          </div>
          <div className="touch">
            <h4>Phone:</h4>
            <p>+-- ------</p>
          </div>
          <div className="touch">
            <h4>Fax:</h4>
            <p>-------</p>
          </div>
          <div className="touch">
            <h4>Email:</h4>
            <p>----@---.com</p>
          </div>
        </div>
        <div className="send">
          <form ref={form} onSubmit={sendEmail}>
            <div className="info">
              <label htmlFor="name">First Name:</label>
              <input type="text" name="ame" id="name" />
            </div>

            <div className="info">
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="info">
              <label htmlFor="comment">Comment:</label>
              <textarea
                name="comment"
                id="comment"
                style={{ height: "20rem" }}
              />
            </div>
            <button onClick="submit" className="addCart">
              Submit:
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
