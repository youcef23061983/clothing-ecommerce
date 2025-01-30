import { useEffect } from "react";
import img from "/images/men/banner/terms.jpg";

const Terms = () => {
  useEffect(() => {
    document.title = "Terms&conditions";
  }, []);
  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="terms" loading="lazy" className="detailImg" />
      </div>
      <div className="story">
        <h1 className="orderTitle">Terms & Conditions</h1>
        <br />
        <br />
        <p>
          Please read these terms and conditions carefully before using the
          [https://www.desire.com] website (the "Service") operated by Desire
          ("us", "we", or "our").
          <br />
          Your access to and use of the Service is conditioned on your
          acceptance of and compliance with these terms. These terms apply to
          all visitors, users, and others who access or use the Service.
          <br />
          By accessing or using the Service you agree to be bound by these
          terms. If you disagree with any part of the terms then you may not
          access the Service.
        </p>
        <br />
        <br />
        <h3>Accounts:</h3>
        <br />
        <br />
        <p>
          When you create an account with us, you must provide accurate,
          complete, and up-to-date information. Failure to do so constitutes a
          breach of the terms, which may result in immediate termination of your
          account on our Service.
          <br />
          You are responsible for safeguarding the password that you use to
          access the Service and for any activities or actions under your
          password, whether your password is with our Service or a third-party
          service.
          <br />
          You agree not to disclose your password to any third-party. You must
          notify us immediately upon becoming aware of any breach of security or
          unauthorized use of your account.
        </p>
        <br />
        <br />
        <h3>Links To Other Web Sites:</h3>
        <br />
        <br />
        <p>
          Our Service may contain links to third-party web sites or services
          that are not owned or controlled by Desire.
          <br />
          Desire has no control over, and assumes no responsibility for, the
          content, privacy policies, or practices of any third-party web sites
          or services. You further acknowledge and agree that Desire shall not
          be responsible or liable, directly or indirectly, for any damage or
          loss caused or alleged to be caused by or in connection with use of or
          reliance on any such content, goods, or services available on or
          through any such web sites or services.
          <br />
          We strongly advise you to read the terms and conditions and privacy
          policies of any third-party web sites or services that you visit.
          <br />
          <br />
        </p>
        <h3>Governing Law:</h3>
        <p>
          These terms shall be governed and construed in accordance with the
          laws of [Your Country], without regard to its conflict of law
          provisions.
          <br />
          Our failure to enforce any right or provision of these terms will not
          be considered a waiver of those rights. If any provision of these
          terms is held to be invalid or unenforceable by a court, the remaining
          provisions of these terms will remain in effect. These terms
          constitute the entire agreement between us regarding our Service, and
          supersede and replace any prior agreements we might have between us
          regarding the Service.
          <br />
          <br />
        </p>
        <h3>Changes :</h3>
        <p>
          <br />
          <br />
          We reserve the right, at our sole discretion, to modify or replace
          these terms at any time. If a revision is material, we will try to
          provide at least 30 days' notice prior to any new terms taking effect.
          What constitutes a material change will be determined at our sole
          discretion.
          <br />
          By continuing to access or use our Service after those revisions
          become effective, you agree to be bound by the revised terms. If you
          do not agree to the new terms, please stop using the Service.
          <br />
          <br />
        </p>
        <h3>Contact Us :</h3>
        <br />
        <br />
        <p>
          If you have any questions about these terms, please contact us:
          <br />
          .By visiting this page on our website: [Contact Page]
          <br />
          .By emailing us at: [Email Address]
        </p>{" "}
      </div>
    </div>
  );
};

export default Terms;
