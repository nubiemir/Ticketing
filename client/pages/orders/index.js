import buildClient from "@/api/buildClient";
export async function getServerSideProps(ctx) {
  const { data } = await buildClient(ctx).get("/api/orders");

  return {
    props: {
      data,
    },
  };
}
export default ({ data }) => {
  return (
    <ul>
      {data.orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};
