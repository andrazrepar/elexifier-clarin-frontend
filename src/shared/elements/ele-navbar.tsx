import {
	Bars3BottomLeftIcon,
	CircleStackIcon,
} from "@heroicons/react/24/outline";
import {
	Await,
	Form,
	Outlet,
	useMatches,
	useParams,
	useRouteLoaderData,
	useNavigate,
	useFetcher,
} from "react-router-dom";
import React, { Suspense } from "react";
import { EleBadge } from "./ele-badge";

export const EleNavbar = () => {
	const fetcher = useFetcher();
	const navigate = useNavigate();

	const { organisationId } = useParams();

	const appRouteData = useRouteLoaderData("routes/_app/route");

	return (
		<div className="flex flex-1 flex-col md:pl-64">
			<div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
				<div className="flex flex-1 justify-between px-4">
					<div className="flex flex-1"></div>
					<div className="ml-4 flex items-center md:ml-6">
						<Form
							onSubmit={async (e) => {
								e.preventDefault();
								//await nhost.auth.signOut();

								fetcher.submit({}, { method: "POST", action: "/logout" });
							}}
						>
							<button type="submit">Logout</button>
						</Form>
					</div>
				</div>
			</div>

			<main>
				<div className="py-6">
					<div className="mx-auto max-w-9xl px-4 sm:px-6 md:px-8">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
};
