import buildClient from "@/api/buildClient";
import Link from "next/link";

export async function getServerSideProps(ctx) {
  const { data } = await buildClient(ctx).get("/api/tickets");

  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const ticketList = data.tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/id" as={`/tickets/${ticket.id}`} legacyBehavior>
            <a className="nav-link">View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
}
