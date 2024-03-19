import moment from "moment";
import { isNonEmptyString } from "../../../helpers";
import { useQuery } from "react-query";
import { getUserAddressById } from "../../../services/addressApi";
import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { countryService } from "../../../services/CountryService";

const UserBio = ({
  userDetailsData,
  isUserDetailsLoading,
  userDetailsError,
}) => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId;
  const [countryList, SetCountryList] = useState([]);
  useEffect(() => {
    async function getCounties() {
      const countryData = await countryService.GetCountryCodes();
      SetCountryList(countryData);
    }
    getCounties();
  }, []);

  const { data, isLoading } = useQuery(
    [`address`, userId],
    () =>
      getUserAddressById({
        userId,
      }),
    {
      select: (res) => {
        return res;
      },
    }
  );

  if (isUserDetailsLoading) {
    return (
      <div>
        <p>...Loading</p>
      </div>
    );
  }

  return (
    <div className="profile-bio">
      {userDetailsError && <p> {userDetailsError} </p>}

      <div className="personal-information">
        <h3 className="mb-4">Information</h3>
        <ul>
          <li>
            <div className="personal-information-title">Full Name</div>
            <div className="">
              {isNonEmptyString(userDetailsData?.forename)
                ? `${userDetailsData?.forename}`
                : ""}{" "}
              {isNonEmptyString(userDetailsData?.surname)
                ? `${userDetailsData?.surname}`
                : ""}
            </div>
          </li>
          <li>
            <div className="personal-information-title">Bio</div>
            <div className="">
              {" "}
              {isNonEmptyString(userDetailsData?.bio)
                ? `${userDetailsData?.bio}`
                : ""}
            </div>
          </li>
          <li>
            <div className="personal-information-title">Email Id</div>
            <div className="">
              {" "}
              {isNonEmptyString(userDetailsData?.email)
                ? `${userDetailsData?.email}`
                : ""}
            </div>
          </li>
          <li>
            <div className="personal-information-title">Gender</div>
            <div className="">
              {isNonEmptyString(userDetailsData?.gender)
                ? `${userDetailsData?.gender}`
                : ""}
            </div>
          </li>
          <li>
            <div className="personal-information-title">Age</div>
            <div className="">
              {userDetailsData?.dob
                ? moment(userDetailsData?.dob, "mm/dd/yyyy")
                    .fromNow()
                    .split(" ")
                    ?.filter((item) => item !== "ago")
                    .join(" ")
                : ""}
            </div>
          </li>
          <li>
            <div className="personal-information-title">Contant No.</div>
            <div className="">
              {" "}
              {isNonEmptyString(userDetailsData?.mobile)
                ? `${userDetailsData?.mobile}`
                : ""}
            </div>
          </li>
          <li>
            <div className="personal-information-title">Main User Type</div>
            <div className="">
              {" "}
              {isNonEmptyString(userDetailsData?.main_user_type)
                ? `${userDetailsData?.main_user_type}`
                : ""}
            </div>
          </li>
          <li>
            <div className="personal-information-title">Referral Code</div>
            <div className="">{userDetailsData?.referral_code ?? "-"}</div>
          </li>
        </ul>
      </div>

      {!!data?.length && (
        <div className="addrssess my-4">
          <div className="personal-information">
            <h3 className="mb-4">Address</h3>
            <div className="row">
              {data?.map((e) => {
                return (
                  <div
                    key={e?.id}
                    className="col-md-4 mb-3"
                    style={{
                      opacity: e?.user_address_status === "active" ? 1 : 0.5,
                    }}
                  >
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="address-tag">
                          {e?.address_type === "Business"
                            ? "Primary"
                            : "Secondary"}
                        </div>
                        <span className="address-list">
                          <strong>Street no.</strong> {e?.street_number}
                          <br></br>
                          <strong>Address Line 1:</strong> {e?.address_line_1},
                          <br></br>
                          {isNonEmptyString(e?.address_line_2) ? (
                            <span>
                              <strong>Address Line 2: </strong>
                              {e?.address_line_2},
                            </span>
                          ) : (
                            ""
                          )}
                          {e.city}, {e.region}, {e?.postal_code},{" "}
                          {
                            countryList?.find((el) => el?.id == e?.country_id)
                              ?.nick_name
                          }{" "}
                        </span>
                        {/* <ul>
                            <li>
                              <div className="personal-information-title">
                                Unit Number:
                              </div>
                              <div className="">{e?.unit_number}</div>
                            </li>
                            <li>
                              <div className="personal-information-title">
                                Address Line 1:
                              </div>
                              <div className="">{e?.address_line_1}</div>
                            </li>
                            <li>
                              <div className="personal-information-title">
                                Address Line 2:
                              </div>
                              <div className="">{e?.address_line_2}</div>
                            </li>
                            <li>
                              <div className="personal-information-title">
                                Street:
                              </div>
                              <div className="">{e?.street_number}</div>
                            </li>
                            <li>
                              <div className="personal-information-title">
                                City:
                              </div>
                              <div className="">{e.city}</div>
                            </li>
                            <li>
                              <div className="personal-information-title">
                                Region:
                              </div>
                              <div className="">{e.region}</div>
                            </li>
                            <li>
                              <div className="personal-information-title">
                                Zip code:
                              </div>
                              <div className="">{e?.postal_code}</div>
                            </li>
                            <li>
                              <div className="personal-information-title">
                                Country:
                              </div>
                              <div className="">
                                {
                                  countryList?.find(
                                    (el) => el?.id == e?.country_id
                                  )?.nick_name
                                }{" "}
                              </div>
                            </li>
                          </ul> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBio;
