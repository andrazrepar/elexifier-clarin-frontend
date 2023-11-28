import { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { EleSidebarDesktop } from "../shared/elements/ele-sidebar";
import { EleNavbar } from "../shared/elements/ele-navbar";
import eleApiService from "../shared/ele-api-service";

export async function loader({ request, params }: LoaderFunctionArgs) {
	try {
		// reload

		const organisationsResult = await eleApiService.listOrganisations();
		return organisationsResult.json();
	} catch (error) {
		if (
			error.message === "NoTokenError" ||
			error.message === "UnauthorizedError"
		) {
			return redirect("/login");
		} else {
			throw error; // Handle other errors
		}
	}
}

export function App() {
	return (
		<>
			<div>
				<EleSidebarDesktop />
				<EleNavbar /> {/*EleNavbar contains an Outlet element*/}
			</div>
		</>
	);
}
