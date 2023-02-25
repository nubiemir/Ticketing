import buildClient from "@/api/buildClient";
import useRequest from "@/hooks/useRequest";
import Router from "next/router";

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  const { data } = await buildClient(ctx).get(`/api/tickets/${id}`);
  return {
    props: { data }, // will be passed to the page component as props
  };
}

const TicketShow = ({ data }) => {
  const { ticket } = data;
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: ({ order }) =>
      Router.push("/orders/[id]", `/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}$</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

export default TicketShow;
