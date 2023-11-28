import {
	Await,
	NavLink,
	useParams,
	useRouteLoaderData,
} from "react-router-dom";
import { Suspense } from "react";
import {
	BuildingOffice2Icon,
	CreditCardIcon,
	FolderIcon,
	KeyIcon,
	UsersIcon,
	Cog6ToothIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";

import { Organisation } from "../../api/organisations";

export type Organisations = {
	organisation: Organisation[];
};

export const EleSidebarDesktop = () => {
	const { organisationId } = useParams();
	const organisations = useRouteLoaderData("app");

	return (
		<div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className="flex flex-grow flex-col overflow-y-auto bg-indigo-700 pt-5">
				<NavLink
					to="/"
					className="flex flex-shrink-0 items-center px-4 justify-center"
				>
					{/*<img className="h-8 w-auto" src={elexifier_logo} alt="Elexifier" />*/}
				</NavLink>
				<div className="mt-5 flex flex-1 flex-col">
					<nav className="flex-1 space-y-1 px-2 pb-4">
						<NavLink
							to={`/app/organisation/create`}
							className={({ isActive }) =>
								`${
									isActive
										? "bg-indigo-800 text-white"
										: "text-indigo-100 hover:bg-indigo-600"
								} group flex items-center px-2 py-2 text-sm font-medium rounded-md`
							}
						>
							<PlusIcon
								className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
								aria-hidden="true"
							/>
							Create organisation
						</NavLink>

						<Suspense fallback={<div>Loading...</div>}>
							<Await
								resolve={organisations}
								errorElement={<div>Could not load organisations 😬</div>}
								children={(resolvedOrganisations) => {
									return resolvedOrganisations.organizations.map(
										(o: Organisation) => (
											<div key={o.id}>
												<NavLink
													to={`/app/organisation/${o.id}/dictionaries`}
													className={({ isActive }) =>
														`${
															isActive
																? "bg-indigo-800 text-white"
																: "text-indigo-100 hover:bg-indigo-600"
														} group flex items-center px-2 py-2 text-sm font-medium rounded-md`
													}
												>
													<BuildingOffice2Icon
														className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
														aria-hidden="true"
													/>
													{o.name}
												</NavLink>
												{organisationId == o.id ? (
													<div className="ml-3">
														<NavLink
															to={`/app/organisation/${o.id}/dictionaries`}
															className={({ isActive }) =>
																`${
																	isActive
																		? "bg-indigo-800 text-white"
																		: "text-indigo-100 hover:bg-indigo-600"
																} group flex items-center px-2 py-2 text-sm font-medium rounded-md`
															}
														>
															<BuildingOffice2Icon
																className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
																aria-hidden="true"
															/>
															Dictionaries
														</NavLink>
														<NavLink
															to={`/app/organisation/${o.id}/members`}
															className={({ isActive }) =>
																`${
																	isActive
																		? "bg-indigo-800 text-white"
																		: "text-indigo-100 hover:bg-indigo-600"
																} group flex items-center px-2 py-2 text-sm font-medium rounded-md`
															}
														>
															<BuildingOffice2Icon
																className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
																aria-hidden="true"
															/>
															Members
														</NavLink>
														<NavLink
															to={`/app/organisation/${o.id}/settings`}
															className={({ isActive }) =>
																`${
																	isActive
																		? "bg-indigo-800 text-white"
																		: "text-indigo-100 hover:bg-indigo-600"
																} group flex items-center px-2 py-2 text-sm font-medium rounded-md`
															}
														>
															<BuildingOffice2Icon
																className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
																aria-hidden="true"
															/>
															Settings
														</NavLink>
													</div>
												) : null}
											</div>
										)
									);
								}}
							/>
						</Suspense>
					</nav>
				</div>
			</div>
		</div>
	);
};
