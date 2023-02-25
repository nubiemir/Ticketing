import buildClient from "@/api/buildClient";
import useRequest from "@/hooks/useRequest";
import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  const { data } = await buildClient(ctx).get(`/api/orders/${id}`);
  return {
    props: { data }, // will be passed to the page component as props
  };
}

const OrderShow = ({ data, currentUser }) => {
  const [time, setTime] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: data.order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(data.order.expiresAt) - new Date();
      setTime(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  if (time < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <>Time left to pay: {time} seconds</>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51LCsrxKVYPLP2blFhIq7SYUp4by0mh7ch6cLGYFO1DnYYLcRqi69qOvZuX15RKA16lLW5b6z9wpbbMe5R82JDZtk00usG3Eytm"
        amount={data.order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

export default OrderShow;
