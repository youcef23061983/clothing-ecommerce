import { useEffect } from "react";
import img from "/images/men/banner/cookies.jpg";
import { Link } from "react-router-dom";
const Cookies = () => {
  useEffect(() => {
    document.title = "Cookies";
  }, []);
  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="cookies" loading="lazy" className="detailImg" />
      </div>
      <div className="story">
        <h1 className="orderTitle">Cookies Policy for Desire</h1>
        <br />
        <br />
        <p>
          Desire ("us", "we", or "our") operates the website
          [https://www.desire.com] . This page informs you of our policies
          regarding the collection, use, and disclosure of personal data when
          you use our Service and the choices you have associated with that
          data. We use cookies and similar tracking technologies to track the
          activity on our Service and hold certain information.
        </p>
        <br />
        <br />
        <h3>What Are Cookies:</h3>
        <br />
        <p>
          Cookies are small pieces of text sent by your web browser by a website
          you visit. A cookie file is stored in your web browser and allows the
          Service or a third-party to recognize you and make your next visit
          easier and the Service more useful to you. Cookies can be "persistent"
          or "session" cookies. Persistent cookies remain on your personal
          computer or mobile device when you go offline, while session cookies
          are deleted as soon as you close your web browser.
        </p>
        <br />
        <br />
        <h3>How Desire Uses Cookies:</h3>
        <br />
        <p>
          When you use and access the Service, we may place a number of cookies
          files in your web browser.
          <br />
          We use cookies for the following purposes:
          <br />
          .To enable certain functions of the Service
          <br />
          .To provide analytics
          <br />
          .To store your preferences
          <br />
          .To enable advertisements delivery, including behavioral advertising
          <br />
          We use both session and persistent cookies on the Service and we use
          different types of cookies to run the Service:
          <br />
          .Essential cookies. We may use essential cookies to authenticate users
          and prevent fraudulent use of user accounts.
          <br />
          Third-party cookies. In addition to our own cookies, we may also use
          various third-parties cookies to report usage statistics of the
          Service, deliver advertisements on and through the Service, and so on.
          <br />
        </p>
        <br />
        <br />
        <h3>What Are Your Choices Regarding Cookies</h3>
        <br />
        <br />
        <p>
          If you'd like to delete cookies or instruct your web browser to delete
          or refuse cookies, please visit the help pages of your web browser.
          <br />
          Please note, however, that if you delete cookies or refuse to accept
          them, you might not be able to use all of the features we offer, you
          may not be able to store your preferences, and some of our pages might
          not display properly.
        </p>
        <br />
        <br />
        <h3>More Information About Cookies</h3>
        <br />
        <br />
        <p>
          You can learn more about cookies and the following third-party
          websites:
          <br />
          <Link>AllAboutCookies</Link>
          <br />
          <Link>Network Advertising Initiative</Link>
        </p>

        <br />
        <br />
        <h3>Contact Us:</h3>
        <br />
        <p>
          If you have any questions about this Cookies Policy, please contact
          us:
          <br />
          .By visiting this page on our website: [Contact Page]
          <br />
          .By emailing us at: [Email Address]
        </p>
      </div>
    </div>
  );
};

export default Cookies;
