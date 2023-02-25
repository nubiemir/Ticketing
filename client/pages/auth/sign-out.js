import useRequest from "@/hooks/useRequest";
import Router from "next/router";
import { useEffect } from "react";

export default () => {
  const { doRequest } = useRequest({
    url: "/api/users/sign-out",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/auth/sign-in"),
  });
  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing you out</div>;
};
