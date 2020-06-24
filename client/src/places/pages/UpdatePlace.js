import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";
import { useFetchData } from "./../../shared/hooks/useFetchData";
import LoadingSpinner from "./../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";

const INITIAL_STATE = {
  title: {
    value: "",
    isValid: false,
  },
  description: {
    value: "",
    isValid: false,
  },
  address: {
    value: "",
    isValid: false,
  },
};

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const [place, setPlace] = useState();
  const { isLoading, error, sendRequest, errorHandler } = useFetchData();
  const [formState, inputHandler, setFormData] = useForm(INITIAL_STATE, false);
  const history = useHistory();

  useEffect(() => {
    const fetchPlace = async () => {
      const data = await sendRequest({
        url: `http://localhost:5000/api/places/${placeId}`,
      });
      if (data) {
        setPlace(data.place);
      }
    };
    fetchPlace();
  }, [sendRequest, placeId]);

  useEffect(() => {
    if (place) {
      setFormData(
        {
          title: {
            value: place.title,
            isValid: true,
          },
          description: {
            value: place.description,
            isValid: true,
          },
          address: {
            value: place.address,
            isValid: true,
          },
        },
        true
      );
    }
  }, [place, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    const data = await sendRequest({
      url: `http://localhost:5000/api/places/${placeId}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
      }),
    });
    if (data) {
      history.goBack();
    }
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!place && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {!isLoading && place && (
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            initialValue={place.title}
            initialValid={formState.inputs.title.isValid}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description (min. 5 characters).'
            onInput={inputHandler}
            initialValue={place.description}
            initialValid={formState.inputs.description.isValid}
          />
          <Input
            id='address'
            element='input'
            label='Address'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid address.'
            onInput={inputHandler}
            initialValue={place.address}
            initialValid={formState.inputs.address.isValid}
          />
          <Button type='submit' disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
