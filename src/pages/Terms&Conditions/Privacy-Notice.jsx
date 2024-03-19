import React from "react"

import { Link } from 'react-router-dom'

/* eslint-disable react/no-unescaped-entities */
const PrivacyNotice = () => {
    return (
      <div>
        {/* <div>
          <ul className="breadcrumb">
            <li>
              <a href="dashboard.html">Dashboard</a>
            </li>
            <li>
              <a href="setting.html"> Setting</a>
            </li>
            <li>
              <a href="/privacy" className="active">
                {" "}
                Privacy
              </a>
            </li>
          </ul>
        </div> */}
        <div className="box-shadow mb-3 py-4">
          <div className="privacy-tabs">
            <ul>
              <li><Link to={"/terms-conditions"} >Terms & Conditions</Link></li>
              <li><Link to={"/privacy-Notice"} className="active">Privacy Notice</Link></li>
              <li><Link to={"/cookie-Policy"}>Cookie Policy</Link></li>
              <li><Link to={"/acceptable-Policy"}>Acceptable Use Policy</Link></li>
            </ul>            
          </div>
        </div>
        <div className="box-shadow">
          <div className="privacy-policy p-3">
            <h2>Privacy Notice</h2>
            <p>
              A Privacy Policy is a legal document outlining how your organization
              collects, uses, and discloses personal information.
            </p>
            <p>
              A properly written Privacy Policy tells customers what data you
              collect about them when they engage with your business (e.g.,
              through your website) or purchase one of your products/services, and
              why you're collecting that information. It also lets people know how
              long their information will be stored, who can access these records
              and more.
            </p>
            <p>
              Protecting data, especially private, personal information, is
              crucial in a complex world where so much depends upon it. The most
              important step for business owners to protect their customers' data
              is to create a concise and transparent Privacy Policy. So, a good
              Privacy Policy should outline what data is being collected and
              explain why you're collecting it, who has access to it, and the time
              frame during which you plan to store it. It should also include any
              third parties with whom your company shares personal or private
              information, as well as any steps taken to ensure the security of
              such information.
            </p>
            <h3>Data Controllers and Contracting Parties</h3>
            <p>
              Privacy Policies often disclose information about third-party
              services used by websites. It is important to disclose information
              about third-party usage because the Privacy Policies of third
              parties may differ from yours. Users need to know who has access and
              what their own unique policies are, since this may affect their
              data.
            </p>
            <p>
              A website might use a third-party credit card processor to process
              transactions. Although the website does not store or handle this
              transaction information, users need to be able to see who has access
              to their credit card information and what they do with it.
            </p>
            <p>
              You should also display a Privacy Policy link at places where you
              request to collect personal information.
            </p>
            <ul>
              <li>Email newsletter sign-up forms</li>
              <li>Contact forms</li>
              <li>Account sign-up forms</li>
              <li>Collect personal information in a new way</li>
              <li>
                Start using personal information in a way you didn't previously
                use it
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  export default PrivacyNotice;
  