import React from "react";
import PostWebImage from "../../../assets/images/post-image.webp";
import PostImage from "../../../assets/images/post-image.png";
import Image from "../../../components/image/Image";
import { parseStringArray } from "../../../helpers";

function PostCard({ item, setSelectedPost, selectedPost }) {
  const MAX_LENGTH = 200;
  const extractFirstParagraph = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const paragraphs = doc.getElementsByTagName("p");

    if (paragraphs.length > 0) {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = paragraphs[0].innerHTML;
      return tempElement.innerText;
    }

    return "";
  };
  const firstParagraph = extractFirstParagraph(item?.description);

  return (
    <li
      className={selectedPost?.id === item?.id ? "active" : ""}
      onClick={(event) => {
        setSelectedPost(item);
      }}
    >
      <a href="#">
        <div className="inventory-collection">
          <Image
            src={parseStringArray(item?.images ?? "")?.[0]}
            imageStyle={{
              height: 70,
              width: 70,
            }}
          />
          {/* <figure>
            <picture>
              <source srcSet={PostWebImage} type="image/webp" />
              <source srcSet={PostImage} type="image/png" />
              <img
                loading="lazy"
                src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                data-src="assets/images/post-image.png"
                alt="user-img"
                className=""
                width={70}
                height={70}
              />
            </picture>
          </figure> */}
          <figcaption>
            <h6>{item?.title}</h6>
            <p>
              {" "}
              {item?.description.length > MAX_LENGTH ? (
                <>
                  {firstParagraph.substring(0, MAX_LENGTH)}
                  {firstParagraph.length > MAX_LENGTH && "..."}
                </>
              ) : (
                firstParagraph
              )}
            </p>
          </figcaption>
        </div>
        {/* <div className="inventory-bottom">
          <div className="inventory-likes">
            <div className="like-count">
              <i className="fa-solid fa-thumbs-up" />
              <span>{item?.total_likes}</span>
            </div>
            <div className="commnet-count">
              <i className="fa fa-message" />
              <span>{item?.total_comments}</span>
            </div>
          </div>
          <div className="inventory-price">
            <div>{item?.price}</div>
          </div>
        </div> */}
      </a>
    </li>
  );
}

export default PostCard;
