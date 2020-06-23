import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "./../../shared/components/UIElements/LoadingSpinner";
import { useFetchData } from "./../../shared/hooks/useFetchData";

const Users = () => {
  const { isLoading, error, sendRequest, errorHandler } = useFetchData();
  const [users, setUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await sendRequest({
        url: "http://localhost:5000/api/users",
      });
      if (data) {
        setUsers(data.users);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading ? (
        <div className='center'>
          <LoadingSpinner />
        </div>
      ) : users ? (
        <UsersList items={users} />
      ) : null}
      ;
    </>
  );
};

export default Users;
