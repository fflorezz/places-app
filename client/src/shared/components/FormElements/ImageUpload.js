import React, { useRef, useState, useEffect } from "react";
import "./imageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const { onInput, id, errorText, avatar } = props;
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickeRef = useRef(null);

  const pickImageHandler = () => {
    filePickeRef.current.click();
  };

  const pickedHandler = ({ target: { files } }) => {
    if (files && files.length === 1) {
      const pickedFile = files[0];
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    if (file) {
      onInput(id, file, isValid);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  }, [file, isValid, onInput, id]);

  return (
    <div className='form-control'>
      <input
        type='file'
        id={props.id}
        style={{ display: "none" }}
        accept='.jpg,.png,jpeg'
        ref={filePickeRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        {previewUrl ? (
          <div className='image-upload__preview'>
            <img
              src={previewUrl}
              alt='preview'
              className={avatar ? "avatar-preview" : ""}
            />
          </div>
        ) : (
          <p>Please provide an image</p>
        )}
        <Button type='button' onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && previewUrl && <p className='image-error'>{errorText}</p>}
    </div>
  );
};

export default ImageUpload;
