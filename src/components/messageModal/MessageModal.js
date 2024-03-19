import React, { useEffect } from "react";
import LoadingModal from "./LoadingModal";
import ModalComponent from "components/modalComponent/ModalComponent";
import CustomButton from "components/customButton/CustomButton";

function MessageModal({ children }) {
  const [handler, setHandler] = React.useState({
    message: "",
    isVisible: false,
    type: undefined,
    successBtnStyle: {},
    successTitleSTyle: {},
    title: "info",
    cancelTitle: "",
  });
  const [loadingHandler, setLoadingHandler] = React.useState({
    isLoading: false,
    loadingText: "",
  });

  useEffect(() => {
    showMessage = ({
      message = "",
      successFn,
      cancelFn,
      showCancelButton = false,
      successTitle = "",
      type = "info",
      successBtnStyle,
      successTitleSTyle,
      title,
      cancelTitle,
      closeIconVisible = false,
    }) => {
      setHandler({
        isVisible: true,
        message,
        title,
        showCancelButton,
        successTitle,
        type,
        closeIconVisible,
        cancelTitle,
        ...(successFn && { successFn }),
        ...(cancelFn && { cancelFn }),
        ...(successBtnStyle && { successBtnStyle }),
        ...(successTitleSTyle && { successTitleSTyle }),
      });
      return null;
    };

    showLoadingSpinner = ({ loadingText = "Loading" }) => {
      setHandler((prev) => {
        return {
          ...prev,
          isVisible: false,
        };
      });
      setLoadingHandler((prev) => {
        return {
          ...prev,
          isLoading: true,
          loadingText,
        };
      });
      return null;
    };

    hideMessage = () => {
      setHandler({ ...handler, isVisible: false });
      return null;
    };
    hideLoadingSpinner = () => {
      setLoadingHandler((prev) => {
        return {
          ...prev,
          isLoading: false,
        };
      });
      return null;
    };
  }, [handler, loadingHandler]);
  return (
    <div>
      {loadingHandler?.isLoading ? (
        <LoadingModal loadingText={loadingHandler?.loadingText} />
      ) : null}

      {handler?.isVisible ? (
        <ModalComponent
          show={handler?.isVisible}
          onHide={hideMessage}
          size="lg"
          heading={handler?.title}
        >
          {/* <div>
            <p >{handler?.title}</p>
            <p>{handler?.message}</p>
          </div> */}
          <div className="card-body text-center">
            <h5 className="card-title">{handler?.message}</h5>
            {/* <p className="card-title">{handler?.message}</p> */}
            <CustomButton
              title={handler?.successTitle || "Ok"}
              onClick={() => {
                handler?.successFn && handler?.successFn();
                hideMessage();
              }}
              className={"mt-3"}
            />
          </div>
        </ModalComponent>
      ) : null}
      {children}
    </div>
  );
}

export default MessageModal;

export let showMessage = ({}) => null;
export let hideMessage = () => null;
export let hideLoadingSpinner = () => null;
export let showLoadingSpinner = ({}) => null;
