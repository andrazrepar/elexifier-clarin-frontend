import { removeToken } from "../shared/auth";
import { redirect } from "react-router-dom";

export async function action({ request }) {
	removeToken();

	return redirect("/login");
}
