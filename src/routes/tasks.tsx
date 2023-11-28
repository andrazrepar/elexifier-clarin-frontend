import {
	LoaderFunctionArgs,
	useParams,
	Await,
	useLoaderData,
} from "react-router-dom";
import { Suspense } from "react";
import EleButtonGroup from "../shared/elements/ele-button-group";
import eleApiService from "../shared/ele-api-service";
import { useState, useEffect } from "react";

type Task = {
	id: string;
	type: string;
	status: string;
	input: {
		file_id: string;
	};
	started_at: string;
	completed_at: string;
};

type Tasks = {
	task: Task[];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
	//const dictionariesPromise = getOrganisationDictionaries();
	const tasks = await eleApiService.listTasks();
	return tasks.json();
}

export async function action({ request }) {
	return {
		success: true,
	};
}

export function UserTasks() {
	const tasks = useLoaderData();
	const { organisationId } = useParams();
	console.log(tasks);

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
				</div>
			</div>

			<Suspense fallback={<div>Loading...</div>}>
				<Await
					resolve={tasks}
					errorElement={<div>Could not load tasks 😬</div>}
					children={(resolvedTasks) => {
						return (
							<div className="mt-8 flex flex-col">
								<div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
									<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
										<div className=" shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
											<table className="min-w-full divide-y divide-gray-300">
												<thead className="bg-gray-50">
													<tr>
														<th
															scope="col"
															className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
														>
															ID
														</th>
														<th
															scope="col"
															className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
														>
															Type
														</th>
														<th
															scope="col"
															className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
														>
															Status
														</th>
														<th
															scope="col"
															className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
														>
															Input
														</th>
														<th
															scope="col"
															className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
														>
															Started at
														</th>
														<th
															scope="col"
															className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
														>
															Completed at
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200 bg-white">
													{resolvedTasks.tasks.map((task: Task) => {
														return (
															<tr key={task.id}>
																<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
																	{task.id}
																</td>
																<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
																	{task?.type}
																</td>
																<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
																	{task?.status}
																</td>
																<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
																	{task?.input?.file_id}
																</td>
																<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
																	{new Date(
																		task?.started_at
																	).toLocaleDateString("en-US", {
																		year: "numeric",
																		month: "long",
																		day: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																	})}
																</td>
																<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
																	{new Date(
																		task?.completed_at
																	).toLocaleDateString("en-US", {
																		year: "numeric",
																		month: "long",
																		day: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																	})}
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						);
					}}
				/>
			</Suspense>
		</div>
	);
}
