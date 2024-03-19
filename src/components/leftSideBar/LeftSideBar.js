import OwlCarousel from 'react-owl-carousel';
import slide1 from '../../assets/images/login-banner.webp';
import slide2 from '../../assets/images/login-banner.png';
import slide3 from '../../assets/images/register-slider.png';
import slide4 from '../../assets/images/register-slider.webp';
import slide5 from '../../assets/images/login-banner-2.webp';
import slide6 from '../../assets/images/login-banner-2.png';
import Line from '../../assets/images/lines.png';
import Triangle from '../../assets/images/tringle.png';
import circle from '../../assets/images/circle.png';

const LeftSidebar = () => {
  return (
    <div className="col-lg-6 animation">
      <div className="login main-left align-items-center">
        {/* <h4>SocialLocket</h4> */}
        <div className="container-fluid">
          <OwlCarousel
            items={1}
            margin={8}
            autoplay
            className="owl-theme main-left login-slider"
            loop
          >
            <div className="item">
              <picture>
                <source srcSet={slide1} type="image/webp" />
                <source srcSet={slide2} type="image/png" />
                <img
                  loading="lazy"
                  src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  srcSet="assets/images/login-banner.png"
                  className="img-fluid"
                  alt="slider"
                  width="680"
                  height="558"
                />
              </picture>
            </div>
            <div className="item">
              {' '}
              <picture>
                <source srcSet={slide3} type="image/webp" />
                <source srcSet={slide4} type="image/png" />
                <img
                  loading="lazy"
                  src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  srcSet="assets/images/register-slider.png"
                  className="img-fluid"
                  alt="slider"
                  width="680"
                  height="558"
                />
              </picture>
            </div>
            <div className="item">
              <picture>
                <source srcSet={slide5} type="image/webp" />
                <source srcSet={slide6} type="image/png" />
                <img
                  loading="lazy"
                  src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  srcSet="assets/images/login-banner-2.png"
                  className="img-fluid"
                  alt="slider"
                  width="680"
                  height="558"
                />
              </picture>
            </div>
          </OwlCarousel>
        </div>
      </div>
      <div>
        <div className="animate lines">
          {' '}
          <img src={Line} alt="lines" />
        </div>
        <div className="animate tringle">
          <img src={Triangle} alt="tringle" width="" height="" />
        </div>
        <div className="animate circle">
          <img src={circle} alt="circle" width="" height="" />
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
