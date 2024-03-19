import React from "react";

import DocSvg from "./icons/doc.svg";
import PdfSvg from "./icons/pdf.svg";
import AudioSvg from "./icons/audio.svg";
import VideoSvg from "./icons/video.svg";
import ImageSvg from "./icons/image.svg";
import { Link } from "react-router-dom";
import CustomButton from "../customButton/CustomButton";
const iconStyle = {
  height: 60,
  width: 60,
  marginRight: 10,
};
const crossIcon = {
  height: 30,
  width: 30,
  borderRadius: 30,
  background: "red",
  position: "absolute",
  right: -10,
  top: -10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FFF",
  cursor: "pointer",
};

const audioExtensions = ["mp3", "wav", "ogg"];
const videoExtensions = ["mp4", "avi", "mkv"];
const imageExtensions = ["jpg", "jpeg", "png", "gif"];
const docExtensions = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];

function CustomFileIcon({
  file,
  className,
  isDownload,
  onRemove,
  onDelete,
  isDeleteLoading,
}) {
  const renderFileIcon = () => {
    const extension = getUrlExtension(
      file?.type ? file?.name : file?.url ?? ""
    );
    // if (fileType === "image") {
    //   //   return <AiOutlineFileImage className="file-icon" />;
    //   return <img src={ImageSvg} style={iconStyle} />;
    // } else if (fileType === "pdf") {
    //   return <img src={PdfSvg} style={iconStyle} />;
    // } else {
    //   return <img src={DocSvg} style={iconStyle} />;
    // }
    if (audioExtensions.includes(extension)) {
      return <img src={AudioSvg} style={iconStyle} />;
    } else if (videoExtensions.includes(extension)) {
      return <img src={VideoSvg} style={iconStyle} />;
    } else if (imageExtensions.includes(extension)) {
      return <img src={ImageSvg} style={iconStyle} />;
    } else if (docExtensions.includes(extension)) {
      return <img src={DocSvg} style={iconStyle} />;
    } else if (extension === "pdf") {
      return <img src={PdfSvg} style={iconStyle} />;
    } else {
      return <img src={DocSvg} style={iconStyle} />;
    }
  };

  return (
    <div className={`card p-2 ${className}`}>
      <div className="d-flex align-items-center">
        {renderFileIcon()}
        <p className="file-name mb-0" style={{ flex: 1 }}>
          {file.name}
        </p>
        {file?.url && (
          <CustomButton
            title={
              <Link
                to={file?.url}
                target="_blank"
                style={{
                  color: "#FFF",
                }}
              >
                View
              </Link>
            }
            className={"me-2 btn-sm"}
          />
        )}
        {isDownload && (
          <CustomButton
            title={
              <Link
                to={file?.url}
                target="_blank"
                download
                style={{
                  color: "#FFF",
                }}
              >
                Download
              </Link>
            }
            className={"btn-sm"}
          />
        )}
        {onDelete && (
          <CustomButton
            title={"Delete"}
            className="unfollow-btn ms-2 btn-sm"
            onClick={onDelete}
            isLoading={isDeleteLoading}
          />
        )}
      </div>
      {onRemove && (
        <div style={crossIcon} onClick={onRemove}>
          X
        </div>
      )}
    </div>
  );
}

export default CustomFileIcon;
// const getFileTypeFromName = (fileName) => {
//   const extension = getUrlExtension(fileName);
//   switch (extension) {
//     case "jpg":
//     case "jpeg":
//     case "png":
//       return "image";
//     case "pdf":
//       return "pdf";
//     case "doc":
//     case "docx":
//       return "document";
//     default:
//       return "unknown";
//   }
// };
export function getUrlExtension(_url) {
  let ext = _url.split(/[#?]/)[0].split(".").pop();
  return ext ?? "".trim();
}
