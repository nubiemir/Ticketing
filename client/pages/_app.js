import { requestInitial } from "@/api/buildClient";
import Header from "@/components/Header";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";

export default function App({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

App.getInitialProps = async (ctx) => {
  const { data } = await requestInitial(ctx.ctx).get("/api/users/current-user");
  return data;
};
