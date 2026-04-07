import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <div className="justify-content-center d-flex">
        <div className="card-name">
          <img
            alt="mastercard"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png"
          />
        </div>
        <div className="card-name">
          <img
            alt="visa"
            src="https://upload.wikimedia.org/wikipedia/commons/4/40/Visa_Inc._logo_%281999%E2%80%932005%29.svg"
          />
        </div>
        <div className="card-name">
          <img
            alt="paypal"
            src="https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg"
          />
        </div>
        <div className="card-name">
          <img
            alt="express"
            src="https://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/American-Express-icon.png"
          />
        
        </div>
      </div>
    </div>
  );
};

export default Footer;
