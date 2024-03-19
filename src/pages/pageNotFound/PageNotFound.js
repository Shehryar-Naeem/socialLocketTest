import { Link } from "react-router-dom";
import ErrorImage from "../../assets/images/error.png";

const PageNotFound = () => {
  return (
    <section className="page-error page--error">
      <div className="stars stars1" />
      <div className="stars stars2" />
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center py-5">
            <div className="position-relative">
              <h2 className="mb-0">Oops! page not found</h2>
              <img src={ErrorImage} alt="error" width="500" height="333" />
              <h5>
                The page you are trying to access doesn’t exist or has been
                moved.
              </h5>
              <h5 className="mb-4">Try going back to our homepage.</h5>
              <Link to="/" className="btn btn-common">
                Go to Home page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
