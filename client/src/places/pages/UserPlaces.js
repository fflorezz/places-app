import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useFetchData } from "./../../shared/hooks/useFetchData";
import LoadingSpinner from "./../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const userId = useParams().userId;
  const [places, setPlaces] = useState([]);
  const { isLoading, sendRequest } = useFetchData();

  useEffect(() => {
    const fetchPlaces = async () => {
      const data = await sendRequest({
        url: `http://localhost:5000/api/places/user/${userId}`,
      });
      if (data) {
        setPlaces(data.places);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      ;{!isLoading && places && <PlaceList items={places} />}
    </>
  );
};

export default UserPlaces;
