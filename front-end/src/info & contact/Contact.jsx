import React, { useEffect, useState } from "react";
import img from "../images/men/banner/contact.jpg";
import emailjs from "@emailjs/browser";
import { useRef } from "react";

const Contact = () => {
  const [formStatus, setFormStatus] = useState(null);
  const form = useRef();
  const [user, setUser] = useState({ name: "", email: "", comment: "" });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();

    // Validation check
    if (!user.name || !user.email || !user.comment) {
      alert("Please enter your information");
      return; // Return early to prevent further execution
    }

    emailjs
      .sendForm("service_vgkozvc", "template_sv5btsr", form.current, {
        publicKey: import.meta.env.VITE_CONTACT_PUBLIC_KEY,
      })
      .then(
        () => {
          setFormStatus("Message sent successfully!");
          setUser({ name: "", email: "", comment: "" });
          setTimeout(() => {
            setFormStatus(null);
          }, 5000);
        },
        (error) => {
          setFormStatus(`Failed to send message: ${error.text}`);
        }
      );
  };
  useEffect(() => {
    document.title = "Contact";
  }, []);
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
              <input
                type="text"
                name="name"
                id="name"
                value={user.name}
                onChange={handleChange}
              />
            </div>

            <div className="info">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="info">
              <label htmlFor="comment">Comment:</label>
              <textarea
                name="comment"
                id="comment"
                value={user.comment}
                onChange={handleChange}
                style={{ height: "20rem" }}
              />
            </div>
            <button onClick="submit" className="addCart">
              Submit:
            </button>
          </form>
          {formStatus && (
            <div className="formStatusMessage" style={{ marginTop: "1rem" }}>
              {formStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
