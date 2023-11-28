import {
	LoaderFunctionArgs,
	defer,
	useParams,
	Link,
	Await,
	useLoaderData,
	redirect,
	Form,
	useFetcher,
} from "react-router-dom";
import { Suspense } from "react";
import EleButtonGroup from "../shared/elements/ele-button-group";
import eleApiService from "../shared/ele-api-service";
import NewDictionaryModal from "../shared/elements/ele-new-dictionary-modal";
import { useState, useEffect } from "react";

type LinkingTasks = {
	linkingTask: LinkingTasks[];
};

export async function loader({
	request,
	params: { organisationId },
}: LoaderFunctionArgs) {
	const tasksResponse = await eleApiService.listTasks();
	const tasks = await tasksResponse.json();
	console.log(tasks);
	const linkingTasks = tasks.tasks.filter((task) => task.type === "link");
	return linkingTasks;
}

export function LinkDictionary() {
	const linkingTasks = useLoaderData();
	const { organisationId } = useParams();

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [file, setFile] = useState(null);

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-xl font-semibold text-gray-900">Linking Tasks</h1>
				</div>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<button
						onClick={() => setModalIsOpen(true)}
						className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					>
						Add Linking Task
					</button>
				</div>
			</div>
			{/*
			{modalIsOpen && (
				<NewDictionaryModal
					setOpen={setModalIsOpen}
					open={modalIsOpen}
					handleFileChange={handleFileChange}
					handleSubmit={handleSubmit}
				/>
			)}*/}

			<Suspense fallback={<div>Loading...</div>}>
				<Await
					resolve={linkingTasks}
					errorElement={<div>Could not load linking Tasks 😬</div>}
					children={(resolvedLinkingTasks) => {
						return (
							<div className="mt-8 flex flex-col">
								<div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
									<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
										<div className=" shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
											<Form method="post">
												<table className="min-w-full divide-y divide-gray-300">
													<thead className="bg-gray-50">
														<tr>
															<th
																scope="col"
																className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
															>
																ID
															</th>
															<th
																scope="col"
																className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
															>
																Left
															</th>
															<th
																scope="col"
																className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
															>
																Right
															</th>
															<th
																scope="col"
																className="py-3.5 pl-4 pr-12 text-right text-sm font-semibold text-gray-900 sm:pl-6"
															>
																Actions
															</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-gray-200 bg-white">
														{resolvedLinkingTasks.map(
															(linkingTask: LinkingTasks) => {
																let buttons = [
																	{
																		name: "Start",
																		type: "link",
																		to: `${linkingTask.id}/view`,
																	},
																	{
																		name: "Delete",
																		type: "link",
																		to: `${linkingTask.id}/transform`,
																	},
																	{
																		name: "Import",
																		type: "link",
																		to: `${linkingTask.id}/link`,
																	},
																	{
																		name: "View",
																		type: "submit",
																		id: linkingTask.id,
																		value: "delete",
																	},
																];
																return (
																	<tr key={linkingTask.id}>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{linkingTask.id}
																		</td>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{linkingTask?.name}
																		</td>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{linkingTask?.access}
																		</td>

																		<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
																			<EleButtonGroup items={buttons} />
																		</td>
																	</tr>
																);
															}
														)}
													</tbody>
												</table>
											</Form>
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
