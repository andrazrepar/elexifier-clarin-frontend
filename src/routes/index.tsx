import { redirect } from "react-router-dom";

export async function loader({ params }) {
	return redirect("/app");
}

export function Index() {
	return (
		<p id="zero-state">
			This is a demo for React Router.
			<br />
			Check out{" "}
			<a href="https://reactrouter.com">the docs at reactrouter.com</a>.
		</p>
	);
}
