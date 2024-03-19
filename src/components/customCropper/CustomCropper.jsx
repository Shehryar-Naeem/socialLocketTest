import React, { memo, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ModalComponent from "../modalComponent/ModalComponent";
import Dropzone from "../dropzone/Dropzone";
import CustomButton from "../customButton/CustomButton";
import Swal from "sweetalert2";
function CustomCropper({ mutate, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleModalOpen = () => setIsOpen((prev) => !prev);
  const cropperRef = useRef(null);
  const [file, setFile] = useState(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    // cropper.getCroppedCanvas().toBlob(async (blob) => {
    //   setFile(blob);
    // });
  };
  const onSubmit = () => {
    if (cropperRef.current?.cropper) {
      const cropper = cropperRef.current?.cropper;
      setIsLoading(true);

      cropper.getCroppedCanvas().toBlob(async (blob) => {

        setIsLoading(true);
        console.log("blob", blob);
        mutate(blob, {
          onSuccess: (res) => {
            console.log("res", res);
            handleModalOpen();
            onSuccess && onSuccess(res);
            setFile(null);
          },
          onError: () =>
            Swal.fire({
              title: "Error",
              text: "Something went wrong! While file has been uploaded",
              icon: "error",
            }),
          onSettled: () => setIsLoading(false),
        });
      });
    }
  };

  const onDrop = async (acceptedFiles) => {
    setFile(acceptedFiles?.[0]);
    handleModalOpen();
    // setUploadStatus("uploading");
  };
  return (
    <>
      <Dropzone onDrop={onDrop} />
      <ModalComponent
        show={isOpen}
        onHide={handleModalOpen}
        size="xs"
        heading="Upload Image"
      >
        <CropFn cropperRef={cropperRef} file={file} />
        <div className="d-flex justify-content-center mt-2">
          <CustomButton
            title={"Add Photo"}
            onClick={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </ModalComponent>
    </>
  );
}

export default CustomCropper;

const CropFn = memo(({ file, cropperRef }) => {
  return (
    <Cropper
      key="crop-image"
      src={file ? URL.createObjectURL(file) : null}
      style={{ height: 400, width: "100%" }}
      initialAspectRatio={16 / 9}
      aspectRatio={16 / 9}
      guides={true}
      ref={cropperRef}
      draggable={false}
      scalable={false}
      viewMode={1}
      minCropBoxWidth={400}
      minCropBoxHeight={400}
      background={false}
      responsive={true}
      checkOrientation={false}
      cropBoxResizable={false}
      autoCrop={true}
    />
  );
});
