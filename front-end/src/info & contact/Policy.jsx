import { useEffect } from "react";
import img from "/images/men/banner/privacy.jpg";

const Policy = () => {
  useEffect(() => {
    document.title = "Policy";
  }, []);
  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="policy" loading="lazy" className="detailImg" />
      </div>
      <div className="story">
        <h1 className="orderTitle">Privacy Policy</h1>
        <br />
        <br />
        <p>
          Desire ("us", "we", or "our") operates the website
          [https://www.desire.com] (the "Service").
          <br />
          This page informs you of our policies regarding the collection, use,
          and disclosure of personal data when you use our Service and the
          choices you have associated with that data.
          <br />
          We use your data to provide and improve the Service. By using the
          Service, you agree to the collection and use of information in
          accordance with this policy.
          <br />
          <br />
        </p>
        <h3>Information Collection and Use:</h3>
        <br />
        <p>
          We collect several different types of information for various purposes
          to provide and improve our Service to you.
        </p>
        <br />
        <br />
        <h3>Types of Data Collected:</h3>
        <br />
        <p>
          .Personal Data: While using our Service, we may ask you to provide us
          with certain personally identifiable information that can be used to
          contact or identify you ("Personal Data"). Personally identifiable
          information may include, but is not limited to:
          <br />
          <span style={{ marginLeft: "1.5rem" }}>.Email address</span>
          <br />
          <span style={{ marginLeft: "1.5rem" }}>.Phone number</span>
          <br />
          <span style={{ marginLeft: "1.5rem" }}>.Cookies and Usage Data</span>
          <br />
          .Usage Data: we may use third-party services such as Google Analytics
          that collect, monitor, and analyze this data.
        </p>
        <br />
        <br />
        <h3>Communications:</h3>
        <br />
        <p>
          We may use your Personal Information to contact you with newsletters,
          marketing, or promotional materials and other information that may be
          of interest to you. You may opt out of receiving any, or all, of these
          communications from us by following the unsubscribe link or
          instructions provided in any email we send.
        </p>
        <br />
        <br />
        <h3>Cookies:</h3>
        <br />
        <p>
          Cookies are files with small amounts of data, which may include an
          anonymous unique identifier. Cookies are sent to your browser from a
          web site and stored on your computer's hard drive. Like many sites, we
          use "cookies" to collect information. You can instruct your browser to
          refuse all cookies or to indicate when a cookie is being sent.
          However, if you do not accept cookies, you may not be able to use some
          portions of our Site.
        </p>
        <br />
        <br />
        <h3>Security :</h3>
        <br />
        <p>
          The security of your Personal Information is important to us, but
          remember that no method of transmission over the Internet, or method
          of electronic storage, is 100% secure. While we strive to use
          commercially acceptable means to protect your Personal Information, we
          cannot guarantee its absolute security.
        </p>
        <br />
        <br />
        <h3>Changes to This Privacy Policy :</h3>
        <br />
        <p>
          This Privacy Policy is effective as of [Date] and will remain in
          effect except with respect to any changes in its provisions in the
          future, which will be in effect immediately after being posted on this
          page.
          <br />
          We reserve the right to update or change our Privacy Policy at any
          time and you should check this Privacy Policy periodically. Your
          continued use of the Service after we post any modifications to the
          Privacy Policy on this page will constitute your acknowledgment of the
          modifications and your consent to abide and be bound by the modified
          Privacy Policy.
          <br />
          If we make any material changes to this Privacy Policy, we will notify
          you either through the email address you have provided us, or by
          placing a prominent notice on our website.
        </p>
        <br />
        <br />
        <h3>Contact Us:</h3>
        <br />
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at [email address].
        </p>
      </div>
    </div>
  );
};

export default Policy;
