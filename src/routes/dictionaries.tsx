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
import { getOrganisationDictionaries, Dictionary } from "../api/dictionaries";
import EleButtonGroup from "../shared/client/ele-button-group";
import eleApiService from "../shared/ele-api-service";
import NewDictionaryModal from "../shared/client/ele-new-dictionary-modal";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

type Dictionaries = {
	dictionary: Dictionary[];
};

export async function action({ request }) {
	const formData = await request.formData();
	const intent = formData.get("intent");
	const dictionaryId = formData.get("dictionary-id");

	console.log(intent, dictionaryId);

	switch (intent) {
		case "Delete":
			const deleteDictionaryResponse = await eleApiService.deleteFile(
				dictionaryId
			);
			return {
				success: true,
			};
		default:
			return {
				success: true,
			};
	}
}

export async function loader({
	request,
	params: { organisationId },
}: LoaderFunctionArgs) {
	//const dictionariesPromise = getOrganisationDictionaries();
	const dictionaries = await eleApiService.listDictionaries();
	return dictionaries.json();
}

export default function OrganisationDictionaries() {
	const dictionaries = useLoaderData();
	const { organisationId } = useParams();

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
		console.log(e);
		setFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Ensure the file exist before trying to upload

		const entry = e.target.elements.entry.value;
		const headword = e.target.elements.headword.value;
		//const title = e.target.elements.title.value;
		//const acronym = e.target.elements.acronym.value;
		//const citation = e.target.elements.citation.value;
		//const publisher = e.target.elements.publisher.value;

		console.log(entry, headword, file);

		if (file) {
			try {
				// Upload the file here
				const uploadResponse = await eleApiService.uploadFile(
					file,
					entry,
					headword
				);
				console.log(uploadResponse);

				if (uploadResponse.success) {
					const file_id = uploadResponse.file_id;

					const createTaskBody = {
						type: "import",
						input: {
							file_id: file_id,
						},
					};
					const createTaskResponse = await eleApiService.createTask(
						createTaskBody
					);
					console.log(createTaskResponse);
				} else {
					console.log(uploadResponse);
				}

				// Log the name and file after a successful upload
				console.log(file);
			} catch (error) {
				// If an error occurs during the upload, log the error
				console.error("Error during file upload:", error);
			}
		} else {
			console.error("No file or name provided for upload");
		}

		// Close the modal regardless of whether the upload was successful
		setModalIsOpen(false);
		redirect(`/app/organisation/${organisationId}/dictionaries`);
	};

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-xl font-semibold text-gray-900">Dictionaries</h1>
				</div>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<button
						onClick={() => setModalIsOpen(true)}
						className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					>
						Add Dictionary
					</button>
				</div>
			</div>

			{modalIsOpen && (
				<NewDictionaryModal
					setOpen={setModalIsOpen}
					open={modalIsOpen}
					handleFileChange={handleFileChange}
					handleSubmit={handleSubmit}
				/>
			)}

			<Suspense fallback={<div>Loading...</div>}>
				<Await
					resolve={dictionaries}
					errorElement={<div>Could not load dictionaries 😬</div>}
					children={(resolvedDictionaries) => {
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
																Name
															</th>
															<th
																scope="col"
																className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
															>
																Access
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
														{resolvedDictionaries.files.map(
															(dictionary: Dictionary) => {
																let buttons = [
																	{
																		name: "View",
																		type: "link",
																		to: `${dictionary.id}/view`,
																	},
																	{
																		name: "Transform",
																		type: "link",
																		to: `${dictionary.id}/transform`,
																	},
																	{
																		name: "Link",
																		type: "link",
																		to: `${dictionary.id}/link`,
																	},
																	{
																		name: "Download",
																		type: "link",
																		to: `${dictionary.id}/download`,
																	},
																	{
																		name: "Delete",
																		type: "submit",
																		id: dictionary.id,
																		value: "delete",
																	},
																];
																return (
																	<tr key={dictionary.id}>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{dictionary.id}
																		</td>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{dictionary?.name}
																		</td>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{dictionary?.access}
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
