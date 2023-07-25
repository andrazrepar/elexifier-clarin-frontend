import {
	Await,
	Link,
	useRouteLoaderData,
	redirect,
	useLoaderData,
} from "react-router-dom";
import { Suspense } from "react";
import {
	CalendarIcon,
	UserCircleIcon,
	ChevronRightIcon,
} from "@heroicons/react/24/outline";
import eleApiService from "../shared/ele-api-service";
import { Organisation } from "../api/organisations";

export async function action({ request }) {
	return null;
}

export async function loader({ request, params }) {
	return null;
}

export function Organisations() {
	const organisations = useRouteLoaderData("app");
	//const organisations = useLoaderData();

	return (
		<div className="overflow-hidden bg-white shadow sm:rounded-md mt-12">
			<h2 className="text-xl font-semibold text-gray-900">My organisations</h2>
			<ul role="list" className="divide-y divide-gray-200">
				<Suspense fallback={<div>Loading...</div>}>
					<Await
						resolve={organisations}
						errorElement={<div>Could not load organisations 😬</div>}
						children={(resolvedOrganisations) => {
							return resolvedOrganisations.organizations.map(
								(o: Organisation) => (
									<li key={o.id}>
										<Link
											to={`/organisations/${o.id}`}
											className="block hover:bg-gray-50"
										>
											<div className="flex items-center px-4 py-4 sm:px-6">
												<div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
													<div className="truncate">
														<div className="flex text-sm">
															<p className="truncate font-medium text-sky-600">
																{o.name}
															</p>
														</div>
														<div className="mt-2 flex">
															<div className="flex items-center text-sm text-gray-500">
																<CalendarIcon
																	className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
																	aria-hidden="true"
																/>
																<p>
																	Last activity on{" "}
																	{/*<time dateTime={o.updated_at}>
																{toNiceDate(o.updated_at)}
															</time>*/}
																</p>
															</div>
														</div>
													</div>
												</div>
												<div className="ml-5 flex-shrink-0">
													<ChevronRightIcon
														className="h-5 w-5 text-gray-400"
														aria-hidden="true"
													/>
												</div>
											</div>
										</Link>
									</li>
								)
							);
						}}
					/>
				</Suspense>
			</ul>

			{/*<pre>{JSON.stringify(organisations, null, 2)}</pre>*/}
		</div>
	);
}
