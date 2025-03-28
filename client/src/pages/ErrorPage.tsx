import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <section>
      <h1>404: Page Not Found</h1>
      <h1> ¯\_(ツ)_/¯</h1>
      <h2>You are seeing this if the page routes are wrong.</h2>
      <p>This route does not lead to a page</p>
      <Link to="/">Return Home</Link>
    </section>
  );
}

export default ErrorPage;