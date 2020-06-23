import { useState, useCallback, useEffect, useRef } from "react";

export const useFetchData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async ({ url, method = "GET", body = null, headers = {} }) => {
      setIsLoading(true);
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
          throw new Error(response.message);
        }
        return data;
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const errorHandler = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.map((request) => request.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, errorHandler };
};
