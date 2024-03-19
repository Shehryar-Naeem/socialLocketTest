/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Avatar from "react-avatar-edit";
import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Multiselect } from "multiselect-react-dropdown";
import { useNavigate } from "react-router-dom";
import UserImage from "../../../assets/images/user-img.png";
import { postsService } from "../../../services/ImageUploadApi";
import { userTitles } from "../../../constants/UserTitles";
import { countryService } from "../../../services/CountryService";
import { AuthContext } from "../../../context/authContext";
import useGetUserType from "hooks/query/commonData/useGetUserType";
import LoadingSpinner from "components/messageModal/LoadingSpinner";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  forename: yup.string().required("First Name is required"),
  surname: yup.string().required("Last Name is required"),
  mobile: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Mobile is required")
    .min(8, "Mobile number must be greater than 8 characters")
    .max(15, "Mobile number must be less than 15 characters"),
  gender: yup.string().required("Gender is required"),
  // main_user_type: yup.string().required("Main user type is required"),
  user_type: yup
    .array()
    .min(1, "User type is required")
    .required("User type is required"),
});

const UserDetailForm = (props) => {
  const options = [
    "buyer",
    "seller",
    "finance",
    "legal",
    "agent",
    "accountant",
    "other",
  ];
  const [countryList, SetCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    id: 1,
    name: "AFGHANISTAN",
    nick_name: "Afghanistan",
    iso3: "AFG",
    phone_code: 93,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const value = useContext(AuthContext);
  const [dialogs, setDialogs] = useState(false);
  const [imageCrop, setImageCrop] = useState(false);
  const [storeImage, setStoreImage] = useState([]);
  const [image, setImage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const {
    // refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      user_type: props.UserType,
    },
  });
  const UserType = watch("user_type");
  useEffect(() => {
    async function getCounties() {
      const countryData = await countryService.GetCountryCodes();
      SetCountryList(countryData);
    }
    getCounties();
  }, []);

  useEffect(() => {
    if (value?.auth?.isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [value?.auth?.isAuthenticated]);
  // const handleFileInput = (e) => {
  //   setSelectedFile(e.target.files[0]);
  // };
  const onClose = () => {
    setImageCrop(null);
  };
  const onCrop = (view) => {
    setImageCrop(view);
  };
  const saveCropImage = async () => {
    setStoreImage([...storeImage, { imageCrop }]);
    setDialogs(false);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "social_locket");
      formData.append("cloud_name", "dzs0eyrnl");
      const response = await postsService.uploadProfile(formData);
      setProfileImage(response?.url);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 3500000) {
      alert("File is too big!");
      // eslint-disable-next-line no-param-reassign
      elem.target.value = "";
    }
    setImage(elem.target.files[0]);
    // console.log(elem.target.files[0]);
  };

  // console.log(selectedFile);
  const onSave = async (data) => {
    // let user_Types = "";
    // if (data?.user_type) {
    //   user_Types = [...data.user_type].join(",");
    // }

    let userTypePayload = {};
    data?.map?.((item) => {
      userTypePayload = {
        ...userTypePayload,
        [item?.type.toLowerCase()]: UserType.includes(item?.type) ? "1" : "0",
      };
    });

    const userData = {
      email: props?.emailValue,
      forename: data?.forename,
      surname: data.surname,
      mobile: `+${selectedCountry?.phone_code} ${
        data?.mobile ? (data?.mobile + "")?.trim() : ""
      }`,
      password: props?.passwordValue,
      bio: data?.bio,
      privacy_policy: "1",
      user_session_id: "",
      title: data?.title,
      gender: data.gender,
      profile_image: profileImage,
      // profile_image: selectedFile?.name,
      banner: "no banner upload",
      dob: data?.dob,
      main_user_type: UserType?.[0],
      seller: UserType && UserType.includes("seller") ? "1" : "0",
      buyer: UserType && UserType.includes("buyer") ? "1" : "0",
      finance: UserType && UserType.includes("finance") ? "1" : "0",
      legal: UserType && UserType.includes("legal") ? "1" : "0",
      status: "",
      agent: UserType && UserType.includes("agent") ? "1" : "0",
      other: UserType && UserType.includes("other") ? "1" : "0",
      accountant: UserType && UserType.includes("accountant") ? "1" : "0",
      unit_number: "",
      street_number: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      region: "",
      postal_code: "",
      country_id: selectedCountry?.id,
      address_type: "Personal",
      user_verification: "0",
      referral_code_used: data.referral_code_used,
      ...userTypePayload,
      // nick_name: "Albania",
    };
    // e.preventDefault();
    
    try {
      const response = await value.register(userData);
      if (response && response?.data?.accessToken) {
        const userId = response?.data?.user_id;
        navigate(`/otp-verification/${userId}/${response?.data?.accessToken}`, {
          state: { accessToken: response?.data?.accessToken },
        });
      }
      
    } catch (err) {
      console.log(err);
    }
  };
  const handleCountryChange = async (event) => {
    const selectedCountryData = countryList.find(
      (x) => x.id === Number(event.target.value)
    );
    setSelectedCountry(selectedCountryData);
  };

  const { data, isLoading } = useGetUserType();
  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div
      id="complete_profile"
      tabIndex="-1"
      aria-labelledby="complete_profileModalLabel"
      aria-hidden="true"
    >
      <div className="">
        <div className="modal-content border-0">
          <div>
            {value?.auth?.message ? (
              <div
                className="alert alert-danger"
                style={{ textAlign: "center" }}
                role="alert"
              >
                {value?.auth?.message}
              </div>
            ) : null}
            {/* <div className="user-profile complete-profile">
              <figure>
                <img
                  loading="lazy"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "-0.3rem",
                    // border: "4px solid grey"
                  }}
                  onClick={() => setDialogs(true)}
                  src={imageCrop || UserImage}
                  alt=""
                />{" "}
                <i
                  className="fa fa-camera change-img"
                  onClick={() => setDialogs(true)}
                />
                <Dialog
                  visible={dialogs}
                  header={() => (
                    <p htmlFor="" className="text-2xl font-semibold textColor">
                      Update Profile
                    </p>
                  )}
                  onHide={() => setDialogs(false)}
                >
                  <div className="confirmation-content flex flex-column align-items-center">
                    <Avatar
                      width={500}
                      height={400}
                      onCrop={onCrop}
                      onClose={onClose}
                      //   src={src}
                      onBeforeFileLoad={onBeforeFileLoad}
                      shadingColor="#474649"
                      backgroundColor="#474649"
                    />
                    <div className="flex flex-column align-items-center mt-5 w-12">
                      <div className="flex justify-content-around w-12 mt-4">
                        <button
                          type="button"
                          onClick={saveCropImage}
                          // label='Save'
                          icon="pi pi-check"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog>
              
              </figure>
            </div> */}

            <form className="row g-3 mt-4">
              {/* <div className="col-md-12">
                <div className="input-group mb-3">
                  <input type="file" name="file" onChange={handleFileInput} />
                </div>
                {errors?.forename?.message ? (
                  <div style={{ color: "red" }}>
                    {errors?.forename?.message}
                  </div>
                ) : (
                  ""
                )}
              </div> */}
              <div className="col-md-6 col-sm-12 mb-2">
                <label htmlFor="title" className="form-label">
                  First Name
                </label>
                <div className="input-group">
                  <select
                    {...register("title")}
                    className="form-select"
                    id="title"
                  >
                    {userTitles.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {/* <input type="file" name="file" onChange={handleFileInput} /> */}
                  <input
                    type="text"
                    className="form-control"
                    id="forename"
                    placeholder="First Name"
                    name="forename"
                    {...register("forename")}
                  />
                </div>
                {errors?.forename?.message ? (
                  <div style={{ color: "red" }}>
                    {errors?.forename?.message}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="col-md-6 col-sm-12 mb-2">
                <label htmlFor="surname" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="surname"
                  placeholder="Last Name"
                  name="surname"
                  {...register("surname")}
                />
                {errors?.surname?.message ? (
                  <div style={{ color: "red" }}>{errors?.surname?.message}</div>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-2">
                <label htmlFor="gender" className="form-label">
                  Select a Gender
                </label>
                <select
                  {...register("gender")}
                  className="form-select"
                  id="gender"
                >
                  <option value="">Select a gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
                {errors?.gender?.message ? (
                  <div style={{ color: "red" }}>{errors?.gender?.message}</div>
                ) : (
                  ""
                )}
              </div>
              {/* <div className="col-md-3">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="bio"
                    placeholder="Content Creator"
                    name="bio"
                    {...register("bio")}
                  />
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>
                </div>
              </div> */}
              {/* <div className="col-md-3 d-none">
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="test@gmail.com"
                    defaultValue={props?.emailValue}
                    {...register("email", {
                      //   required: "Required",
                    })}
                    disabled
                  />
                  <label htmlFor="email">Email ID</label>
                </div>
                {errors?.email?.message ? (
                  <div style={{ color: "red" }}>{errors?.email?.message}</div>
                ) : (
                  ""
                )}
              </div> */}
              {/* 
              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    className="form-control"
                    id="dob"
                    name="dob"
                    placeholder="Address 1"
                    {...register("dob")}
                  />
                  <label htmlFor="dob" className="form-label">
                    D.O.B
                  </label>
                </div>
              </div> */}
              <div className="col-md-12 mb-2">
                <label htmlFor="mobile" className="form-label">
                  Enter Your Phone Number
                </label>
                {countryList?.length > 0 ? (
                  <div className="input-group phone-number-dropdown">
                    <select
                      className="form-select"
                      onChange={(e) => handleCountryChange(e)}
                    >
                      {countryList
                        ? countryList.map((option) => (
                            <option key={option.id} value={option.id}>
                              {`${option.iso} +${option.phone_code}`}
                            </option>
                          ))
                        : null}
                    </select>
                    <input
                      type="number"
                      className="form-control"
                      id="mobile"
                      placeholder="Contact Number"
                      {...register("mobile")}
                    />
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
                {errors?.mobile?.message ? (
                  <div style={{ color: "red" }}>{errors?.mobile?.message}</div>
                ) : (
                  ""
                )}
              </div>

              <div className="mb-2">
                <label htmlFor="search_input" className="form-label">
                  Select User Types
                </label>
                <Controller
                  control={control}
                  name="user_type"
                  defaultValue={[props.userType]}
                  render={({ field: { value, onChange } }) => (
                    <Multiselect
                      options={data?.map((item) => item?.type) ?? []}
                      isObject={false}
                      showCheckbox
                      hidePlaceholder
                      closeOnSelect={false}
                      onSelect={onChange}
                      onRemove={onChange}
                      selectedValues={value}
                      placeholder="Select User Type"
                      className="text"
                      singleSelect
                    />
                  )}
                />
                {errors?.user_type?.message ? (
                  <div style={{ color: "red" }}>
                    {errors?.user_type?.message}
                  </div>
                ) : (
                  ""
                )}
                {/* <div className="col-md-12">
                  <select
                    {...register("main_user_type")}
                    className="form-select"
                    id="main_user_type"
                    style={{
                      height: "48px",
                    }}
                  >
                    <option value="">Select a type</option>
                    {UserType
                      ? UserType.map((item, idx) => (
                          <option key={idx} value={item}>
                            {item}
                          </option>
                        ))
                      : ""}
                  </select>
                  {errors?.main_user_type?.message ? (
                    <div style={{ color: "red" }}>
                      {errors?.main_user_type?.message}
                    </div>
                  ) : (
                    ""
                  )}
                </div> */}
                {/* <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    id="stakeholder"
                    multiple
                    aria-label="Floating label select example"
                    {...register("stakeholder")}
                  >
                    <option selected="">Buyer</option>
                    <option value={1}>Seller</option>
                    <option value={2}>Reader</option>
                    <option value={3}>Writter</option>
                  </select>
                  <label htmlFor="stakeholder">Stakeholder Type</label>
                </div> */}
              </div>
              <div className="mb-2">
                <label htmlFor="referral_code" className="form-label">
                  Referral Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="referral_code_used"
                  placeholder="Enter your Referral Code"
                  name="referral_code"
                  {...register("referral_code_used")}
                />
                {/* {errors?.referral_code?.message ? (
                  <div style={{ color: "red" }}>{errors?.referral_code?.message}</div>
                ) : (
                  ""
                )} */}
              </div>
              {/* <div className="mb-2">
                <label htmlFor="main_user_type" className="form-label">
                  Select Main User Type
                </label>
                <div className="col-md-12">
                  <select
                    {...register("main_user_type")}
                    className="form-select"
                    id="main_user_type"
                    style={{
                      height: "48px",
                    }}
                  >
                    <option value="">Select a type</option>
                    {UserType
                      ? UserType.map((item, idx) => (
                          <option key={idx} value={item}>
                            {item}
                          </option>
                        ))
                      : ""}
                  </select>
                  {errors?.main_user_type?.message ? (
                    <div style={{ color: "red" }}>
                      {errors?.main_user_type?.message}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div> */}
            </form>
          </div>
          <br />
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-common w-100 mb-3"
              onClick={handleSubmit(onSave)}
              // disabled={value?.loading}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailForm;
