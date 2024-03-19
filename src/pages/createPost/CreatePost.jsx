/* eslint-disable no-unused-vars */
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useCallback, useContext, useEffect, useState } from "react";
// import parse from "html-react-parser";
import { Form, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { postsService } from "../../services/ImageUploadApi";
import { getUserFullName, getUserProfileImage } from "../../utils/Storage";
import { getInitials, isNonEmptyString, parseStringArray } from "../../helpers";
import Dropzone from "../../components/dropzone/Dropzone";
import ShowImage from "../../components/showImages/ShowImages";
import TagInputField from "../../components/tagInputField/TagInputField";
import { API } from "../../services/ApiClient";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { updatePost } from "../../services/PostApi";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../components/messageModal/MessageModal";
import Avatar from "../../components/image/Avatar";
import AddressAutoComplete from "../setting/details/updateAddress/AddressAutoComplete";
import CustomCropper from "../../components/customCropper/CustomCropper";
import {
  getPostImageByUserId,
  uploadPostImage,
} from "../../services/fileUploadApi";
import useGetVerification from "hooks/query/AllUserProfile/useGetVerification";
import useGetInventory from "hooks/query/commonData/useGetInventory";
import useGetCurrency from "hooks/query/commonData/useGetCurrency";
import useGetBedrooms from "hooks/query/commonData/useGetBedroom";
import LoadingSpinner from "components/messageModal/LoadingSpinner";
import imageCompression from "browser-image-compression";
const CLOUDINARY_UPLOAD_PRESET = "social_locket";
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dzs0eyrnl/image/upload";
const schema = yup.object().shape({
  // title: yup.string().required(),
  title: yup
    .string()

    .required("Title is required"),
  type: yup.string().nullable().required("Please select type"),
  // pages: yup.string().required(),
  pages: yup
    .mixed()
    .test("positiveOrNaN", "Page must be greater than zero", (value) => {
      return Number(value) > 0 || Number.isNaN(value);
    })
    .required("Page must be greater than zero"),
  // price: yup.number().positive("Price must be greater than zero").typeError(""),
  // price: yup.number().positive().label("seats").required("pls enter").min(1),
  price: yup
    .mixed()
    .test("positiveOrNaN", "Price must be greater than zero", (value) => {
      return typeof value === "number" && (value > 0 || Number.isNaN(value));
    })
    .required("Price must be greater than zero"),
});
const CreatePost = () => {
  const getInventory = useGetInventory();
  const getCurrency = useGetCurrency();
  const getBedroom = useGetBedrooms();

  const [images, setImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const userProfilePic = getUserProfileImage();
  const userFullName = getUserFullName();
  const { state } = useLocation();
  const [tags, setTags] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("$");
  const [address, setAddress] = useState(null);
  const preloadedValues = {
    title: state?.title,
  };
  const postUpdateValue = {
    description: state?.post?.description,
    title: state?.title,
    price: Number(state?.post?.price?.replace(/[^\d.]/g, "") || ""),
    pages: Number(state?.post?.pages),
    location: state?.post?.location,
    type: state?.post?.type ? state?.post?.type?.toLowerCase() : "",
  };

  useEffect(() => {
    if (state?.post) {
      const post = state?.post;
      setImages(parseStringArray(post.images ?? "") ?? []);
      setTags(parseStringArray(post?.keywords) ?? []);

      setAddress({
        latitude: Number(post?.latitude || 0),
        longitude: Number(post?.longitude || 0),
      });
    }
  }, [state]);

  useEffect(() => {
    if (state?.post) {
      const post = state?.post;
      const tempCurrency = getCurrency?.data?.find(
        (item) => item?.currency_symbol === post?.currency
      );

      setSelectedCurrency(tempCurrency ?? "$");
    }
  }, [getCurrency,state?.post]);
  

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: state?.post ? postUpdateValue : preloadedValues,
    resolver: yupResolver(schema),
  });
  const queryClient = useQueryClient();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    register("description");
  });

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", "post_image");
    formData.append("user_id", auth?.userId);
    console.log("formData", formData);

    // formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    // formData.append("folder", "my_folder");

    try {
      const result = await uploadPostImage(formData);
      console.log("result", result);
      const response = await getPostImageByUserId(auth?.userId);
      let url = response?.[response?.length - 1]?.images;
      console.log("url", url);
      return url;
      // return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary: ", error);
      throw new Error("Error uploading to Cloudinary");
    }
  };

  const { mutateAsync, isLoading } = useMutation(uploadToCloudinary);
  // const onDrop = async (acceptedFiles) => {
  //   setUploadStatus("uploading");

  //   try {
  //     showLoadingSpinner({
  //       loadingText: "Uploading",
  //     });
  //     const uploadedImages = await Promise.all(
  //       acceptedFiles?.map((file) => mutateAsync(file))
  //     );
  //     setImages([...images, ...uploadedImages]);
  //     setUploadStatus("success");
  //   } catch (error) {
  //     console.error("Error uploading images: ", error);
  //     setUploadStatus("error");
  //   } finally {
  //     hideLoadingSpinner({});
  //   }
  // };

  const compressImage = async (file) => {
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1, // Set your desired maximum file size
      });
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image: ", error);
      throw new Error("Error compressing image");
    }
  };

  const onDrop = async (acceptedFiles) => {
    setUploadStatus("uploading");

    try {
      showLoadingSpinner({
        loadingText: "Uploading",
      });
      const compressedFiles = await Promise.all(
        acceptedFiles.map((file) => compressImage(file))
      );

      const uploadedImages = await Promise.all(
        compressedFiles.map((file) => mutateAsync(file))
      );

      setImages([...images, ...uploadedImages]);
      setUploadStatus("success");
    } catch (error) {
      console.error("Error uploading images: ", error);
      setUploadStatus("error");
    } finally {
      hideLoadingSpinner({});
    }
  };
  const { mutate: savePost, isLoading: isPostLoading } = useMutation(
    async (payload) => {
      const res = await API.post("/posts", payload);

      if (isNonEmptyString(res?.data?.message)) {
        Swal.fire({
          title: "Success",
          text: res?.data?.message,
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      }
      return null;
    },
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries(["posts"]);
        }
      },
    }
  );

  const { mutate: updateMutate } = useMutation(updatePost, {
    onMutate: () => showLoadingSpinner({}),
    onSuccess: async (res) => {
      Swal.fire({
        title: "Success",
        text: res?.data?.message,
        icon: "success",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(-1);
        }
      });
    },
    onError: (err, data) => {
      Swal.fire({
        title: "Update Post",
        text: err?.response?.data?.message,
        icon: "error",
      });
    },
    onSettled: () => hideLoadingSpinner(),
  });

  const onSubmit = async (data) => {
    // const tagsString = `['${tags.join("','")}']`;
    const tempCurrency = getCurrency?.data?.find(
      (item) => item?.currency_symbol === selectedCurrency
    );
    const tagsString = tags?.length ? JSON.stringify(tags) : "";
    let obj = {
      title: data?.title,
      description: data.description,
      type: data?.type,
      location: data?.location,
      price: data?.price,
      currency: tempCurrency?.currency_symbol,
      currency_id: tempCurrency?.id,
      status: "AVAILABLE",
      user_id: auth?.userId.toString(),
      pages: data?.pages.toString(),
      images: images ? JSON.stringify(images) : JSON.stringify([]),
      keywords: tagsString?.length ? JSON.stringify(tagsString) : tagsString,
      //   available: "24/04/2023",
      offer_price: null,
      purchased_price: "",
      customer_user_id: null,
      latitude: address?.latitude,
      longitude: address?.longitude,
    };
    if (state?.post) {
      obj = {
        ...obj,
        id: state?.post?.id,
      };
      updateMutate(obj);
    } else {
      savePost(obj, {
        onError: (err) => {
          Swal.fire({
            title: "Error",
            text: err.response?.data?.message,
            icon: "error",
          });
        },
      });
    }
  };
  //   {
  //     "title": "Create A new Post",
  //     "description": "Create A new Post description",
  //     "type": "Article",
  //     "location": "511 4th Floor Buddha Marg, mandawali",
  //     "price": "£120.00",
  //     "status": "AVAILABLE",
  //     "user_id": "51",
  //     "pages": "5",
  //     "images": "['https://images.pexels.com/photos/6544374/pexels-photo-6544374.jpeg', 'https://images.pexels.com/photos/357737/pexels-photo-357737.jpeg', 'https://images.pexels.com/photos/1437811/pexels-photo-1437811.jpeg']",
  //     "keywords": "['One', 'two', 'three', 'four' ]",
  //     "available": "26/03/2023",
  //     "offer_price": "£12.50",
  //     "purchased_price": "",
  //     "customer_user_id": 51
  // }
  const onRemoveImage = (index) => {
    const temp = images;
    temp.splice(index, 1);
    setImages([...temp]);
  };

  const verificationBadge = useGetVerification();

  return (
    <div>
      {getBedroom?.isLoading ||
      getCurrency?.isLoading ||
      getInventory?.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="box-shadow">
          <div className="create-post">
            <h3 className="text-center">Listing</h3>
            <hr />
            <div className="user-post">
              <div className="post-profile">
                {/* <figure>
          {userProfilePic !== null ? (
            // <picture>
            //   <source
            //     srcSet="assets/images/user-img.webp"
            //     type="image/webp"
            //   />
            //   <source srcSet={userProfilePic} type="image/png" />
            //   <img
            //     loading="lazy"
            //     src={userProfilePic}
            //     data-src={userProfilePic}
            //     alt="user-img"
            //     className="img-fluid"
            //     width={50}
            //     height={50}
            //   />
            // </picture>
            <Avatar
              src={userProfilePic}
              // imageStyle={}
              className="img-fluid"
              imageStyle={{
                height: 50,
                width: 50,
              }}
            />
          ) : (
            <span>{userFullName ? getInitials(userFullName) : ""}</span>
          )}
        </figure> */}
                <Avatar
                  isVerified={!!verificationBadge}
                  src={userProfilePic}
                  // imageStyle={}
                  className="img-fluid me-2"
                  imageStyle={{
                    height: 50,
                    width: 50,
                  }}
                  firstName={getInitials(userFullName)}
                  lastName={""}
                />
                <figcaption>
                  <h5 className="mb-0 ms-1">{userFullName}</h5>
                </figcaption>
              </div>
            </div>
            <div className="new-post">
              <form>
                <div className="mb-3">
                  <div className="post-input">
                    <label>Create Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Write Something..."
                      name="title"
                      {...register("title")}
                    />
                    {errors?.title?.message ? (
                      <div className="post-validation" style={{ color: "red" }}>
                        {errors?.title?.message}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="post-input">
                    <label>
                      Description <small>(Content Required 150 words*)</small>
                    </label>
                    <CKEditor
                      id="full-featured-non-premium"
                      editor={ClassicEditor}
                      //   data={text}
                      // onChange={(event, editor) => {
                      //   const data = editor.getData();
                      //   setText(data);
                      // }}
                      //   onChange={(event, editor) => {
                      //     setValue("input", editor.getData());
                      //     trigger("input");
                      //   }}
                      data={postUpdateValue?.description}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setValue("description", data);
                      }}
                    />
                    {/* <p>{parse(text)}</p> */}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="post-input">
                    <label>
                      Upload Images{" "}
                      <small>(you can upload multiple images here*)</small>
                    </label>
                    <Dropzone onDrop={onDrop} />
                    {/* <CustomCropper
                      mutate={mutateAsync}
                      onSuccess={(res) => {
                        setImages([...images, res]);
                      }}
                    /> */}
                    <ShowImage
                      onRemoveImage={onRemoveImage}
                      images={images}
                      uploadStatus={uploadStatus}
                    />
                  </div>
                </div>
                {/* <div className="mb-3 add-to-post">
          <h6 className="mb-0">Add to your post</h6>
          <ul>
          
            <li>
              <button type="button">
                <i className="fa-solid fa-location-dot" />
              </button>
            </li>
            <li>
              <button type="button">
                <i className="fa-solid fa-user-tag" />
              </button>
            </li>
          </ul>
        </div> */}
                {/* <div className="mb-3">
                  <div className="post-input">
                    <label>Number of Rooms</label>
                    <input
                      className="form-control"
                      placeholder="Rooms"
                      name="pages"
                      type="number"
                      min={1}
                      {...register("pages", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors?.pages?.message ? (
                      <div className="post-validation" style={{ color: "red" }}>
                        {errors?.pages?.message}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div> */}

                <div className="mb-3">
                  <div className="post-input">
                    <label>Number of Rooms</label>
                    <select
                      type="select"
                      name="pages"
                      {...register("pages")}
                      className="form-select"
                    >
                      <option value={""} disabled>
                        Select type
                      </option>
                      {getBedroom?.data?.map((item) => (
                        <option value={item?.bedrooms} key={item?.id}>
                          {item?.bedrooms}
                        </option>
                      ))}
                    </select>
                    {errors?.pages && (
                      <div className="post-validation" style={{ color: "red" }}>
                        {errors?.pages.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="post-input">
                    <label>Add Your Address</label>
                    {/* <input
              type="text"
              className="form-control"
              placeholder="Address"
              name="location"
              {...register("location", {
                required: "Please enter your address.",
              })}
            /> */}
                    <AddressAutoComplete
                      onChange={(value) => {
                        setAddress(value);
                        setValue("location", value?.completeAddress);
                      }}
                      latitude={state?.post?.latitude}
                      longitude={state?.post?.longitude}
                    />

                    {errors?.location?.message ? (
                      <div style={{ color: "red" }}>
                        {errors?.location?.message}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div>
                  <div className="post-input">
                    <label>Add Some Keywords</label>
                    <TagInputField setTags={setTags} tags={tags} />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="post-input">
                    <label>Property Type</label>
                    <select
                      type="select"
                      name="type"
                      {...register("type")}
                      className="form-select"
                    >
                      <option value={""} disabled>
                        Select type
                      </option>
                      {getInventory?.data?.map((item) => (
                        <option value={item?.type} key={item?.id}>
                          {item?.type}
                        </option>
                      ))}
                    </select>
                    {errors?.type && (
                      <div className="post-validation" style={{ color: "red" }}>
                        {errors?.type.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="post-input">
                  <label>Add Property Price</label>
                  <InputGroup className="mb-3">
                    {/* <InputGroup.Text id="basic-addon1">$</InputGroup.Text> */}
                    <Form.Select
                      style={{ flex: 0.1 }}
                      id="basic-addon1"
                      aria-label="Default select example"
                      value={selectedCurrency}
                      onChange={(event) => {
                        const { value } = event.target;
                        setSelectedCurrency(value);
                      }}
                    >
                      <option disabled>Select Currency</option>
                      {getCurrency?.data?.map((item) => (
                        <option value={item?.currency_symbol} key={item?.id}>
                          {item?.currency_code} {item?.currency_symbol}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control
                      placeholder="Price"
                      aria-label="Price"
                      aria-describedby="basic-addon1"
                      type="number"
                      name="price"
                      min={1}
                      {...register("price", {
                        valueAsNumber: true,
                      })}
                    />
                  </InputGroup>
                  {errors?.price?.message ? (
                    <div className="post-validation" style={{ color: "red" }}>
                      {errors?.price?.message}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mb-3 text-end">
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="btn btn-common"
                    disabled={isPostLoading}
                  >
                    {state?.post ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
