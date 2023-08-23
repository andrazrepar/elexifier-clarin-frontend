import {
	LoaderFunctionArgs,
	defer,
	useParams,
	download,
	Await,
	useLoaderData,
	redirect,
	Form,
	useFetcher,
} from "react-router-dom";
import { Suspense } from "react";
import EleButtonGroup from "../shared/client/ele-button-group";
import eleApiService from "../shared/ele-api-service";
import NewDictionaryModal from "../shared/client/ele-new-dictionary-modal";
import { useState, useEffect } from "react";

type DownloadTasks = {
	downloadTask: DownloadTasks[];
};

export async function loader({
	request,
	params: { organisationId },
}: LoaderFunctionArgs) {
	const tasksResponse = await eleApiService.listTasks();
	const tasks = await tasksResponse.json();
	console.log(tasks);
	const downloadTasks = tasks.tasks.filter((task) => task.type === "download");
	return downloadTasks;
}

export function DownloadDictionary() {
	const downloadTasks = useLoaderData();
	const { organisationId } = useParams();

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [file, setFile] = useState(null);

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-xl font-semibold text-gray-900">
						Download Tasks
					</h1>
				</div>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<button
						onClick={() => setModalIsOpen(true)}
						className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					>
						Add Download Task
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
					resolve={downloadTasks}
					errorElement={<div>Could not load Download Tasks 😬</div>}
					children={(resolvedDownloadTasks) => {
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
														{resolvedDownloadTasks.map(
															(downloadTask: downloadTasks) => {
																let buttons = [
																	{
																		name: "Download",
																		type: "download",
																		to: `${downloadTask.id}/view`,
																	},
																	{
																		name: "Delete",
																		type: "download",
																		to: `${downloadTask.id}/transform`,
																	},
																];
																return (
																	<tr key={downloadTask.id}>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{downloadTask.id}
																		</td>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{downloadTask?.name}
																		</td>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{downloadTask?.access}
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
