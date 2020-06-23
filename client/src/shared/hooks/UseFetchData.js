import { useState, useCallback, useEffect, useRef } from "react";

export const useFetchData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async ({ url, method, body, headers, callback }) => {
      setIsLoading(true);

      method = method ? method : "GET";
      body = body ? body : null;
      headers = headers ? headers : {};

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        if (callback) {
          callback();
        }
        return data;
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [activeHttpRequests]
  );

  const errorHandler = () => {
    setError(null);
  };

  useEffect(() => {
    const requests = activeHttpRequests.current;
    return () => {
      requests.map((request) => request.abort());
    };
  }, [activeHttpRequests]);

  return { isLoading, error, sendRequest, errorHandler };
};
