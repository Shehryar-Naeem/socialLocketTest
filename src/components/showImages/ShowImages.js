// import Image from './Image';
import { Fragment } from "react";
import "./showImagesStyles.css";

const Image = ({ image }) => {
  return (
    <div>
      <img className="showImage" alt="" src={image} />
    </div>
  );
};

// export default Image;
const ShowImage = ({ images, uploadStatus, onRemoveImage }) => {
  return (
    <div className="show image-preview-main">
      <div className="image-preview">
        {images?.length > 0 ? (
          images?.map((image, index) => (
            <div
              key={index + ""}
              className="position-relative"
              onClick={() => onRemoveImage && onRemoveImage(index)}
            >
              <img className="showImage" alt="" src={image} />
              <div
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  backgroundColor: "red",
                  height: 20,
                  width: 20,
                  borderRadius: "50%",
                  color: "#FFF",
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <i className="fa-solid fa-times"></i>
              </div>
            </div>
          ))
        ) : (
          <p>
            <strong>
              Drag and drop some files here, or click to select files
            </strong>
          </p>
        )}
      </div>
      {uploadStatus === "success" && (
        <div className="w-100 alert alert-success">
          <strong>Images uploaded successfully!</strong>
        </div>
      )}
      {uploadStatus === "error" && (
        <div className="w-100 alert alert-danger">
          <strong>Error uploading images!</strong>
        </div>
      )}
    </div>
  );
};

export default ShowImage;

// //   const selected_images = selectedImages?.map((file) => (
// //     <div>
// //       <img src={file.preview} style={{ width: "200px" }} alt="" />
// //     </div>
// //   ));
