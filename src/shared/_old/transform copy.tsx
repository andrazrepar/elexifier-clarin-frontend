import React, { useState, useEffect } from "react";
import { TransformTree } from "../shared/old/ele-transform-tree";
import { createDmlexSpec, attributeDefaultValues } from "../shared/dmlex-spec";
import {
	Form,
	redirect,
	useLoaderData,
	useLocation,
	useFetcher,
} from "react-router-dom";
import beautify from "xml-beautifier";
import { useParams } from "react-router-dom";
import eleApiService from "../shared/ele-api-service";
import { TransformTree3 } from "../shared/client/ele-transform-tree3";
import EleTabs from "../shared/client/ele-tabs";
import EleButtonGroup from "../shared/client/ele-button-group";
import { EleDropdownField } from "../shared/client/ele-dropdown-field";
import { EleSearchableDropdownField } from "../shared/client/ele-searchable-dropdown-field";
import EleToggle from "../shared/client/ele-toggle";
import { getOutElementPaths } from "../shared/client/find-elements";

async function applyTransformationToEntry(
	transformationId: Number,
	entryId: Number
) {
	const transformationResponse = await eleApiService.applyTransformation(
		transformationId,
		entryId
	);
	const transformedEntry = await transformationResponse.json();

	if (transformationResponse.status === 404) {
		throw new Error(`Transformation failed: ${transformedEntry.error}`);
	}

	const transformedEntryData = transformedEntry.data[0].entrys[0];

	return transformedEntryData;
}

function removeNullInSelector(obj: any) {
	if (Array.isArray(obj)) {
		return obj
			.map((v) => {
				if (v.inSelector === null || v.inSelector === "") {
					return null;
				}
				return removeNullInSelector(v);
			})
			.filter((n) => n);
	} else if (typeof obj === "object" && obj !== null) {
		if (
			!("inSelector" in obj) &&
			obj.attribute === "{http://elex.is/wp1/teiLex0Mapper/meta}constant" &&
			obj.constant === null
		) {
			return null; // If 'inSelector' is not present and 'constant' is null, return null
		}

		Object.keys(obj).forEach((key) => {
			if (key === "inSelector" && obj[key] === null) {
				delete obj[key];
			} else if (key === "regex" && obj[key] === "") {
				delete obj[key];
			} else if (key === "regexGroup" && obj[key] === "") {
				delete obj[key];
			} else {
				obj[key] = removeNullInSelector(obj[key]);
			}
		});
	}
	return obj;
}

function setSimpleOrAdvanced(
	formData: FormData,
	advancedMode: boolean
): FormData {
	// Convert formData to a plain object
	let objectData: { [key: string]: any } = {};
	formData.forEach((value, key) => {
		objectData[key] = value;
	});

	// Apply the setSimpleOrAdvanced function
	if (advancedMode === true) {
		Object.keys(objectData).forEach((key) => {
			if (key.endsWith("inSelector-simple")) {
				delete objectData[key];
			} else if (key.endsWith("inSelector-advanced")) {
				objectData[key.replace("-advanced", "")] = objectData[key];
				delete objectData[key];
			}
		});
	} else {
		Object.keys(objectData).forEach((key) => {
			if (key.endsWith("inSelector-advanced")) {
				delete objectData[key];
			} else if (key.endsWith("inSelector-simple")) {
				objectData[key.replace("-simple", "")] = objectData[key];
				delete objectData[key];
			}
		});
	}

	// Convert the object back to FormData
	let updatedFormData = new FormData();
	Object.keys(objectData).forEach((key) => {
		updatedFormData.append(key, objectData[key]);
	});

	return updatedFormData;
}

function createXlatAndFieldsToUpdate(formData: FormData): {
	xlat: { [key: string]: any };
	fieldsToUpdate: { [key: string]: any };
} {
	let fieldsToUpdate: { [key: string]: any } = Object.fromEntries(formData);

	// create xlat mapping and remove from fieldsToUpdate
	let xlat: { [key: string]: any } = {};
	Object.keys(fieldsToUpdate).forEach((key) => {
		if (key.startsWith("ud-mapping")) {
			// Remove 'ud-mapping-' from the key and add the key-value pair to xlat
			let newKey = key.replace("ud-mapping-", "");
			let udValue = fieldsToUpdate[key].toLowerCase();

			if (udValue !== "") {
				xlat[newKey] = udValue;
			}

			// Remove the key-value pair from fieldsToUpdate
			delete fieldsToUpdate[key];
		}
	});

	return { xlat, fieldsToUpdate };
}

function generateDefaultTransformationName(dictName: string) {
	const now = new Date();
	const formattedDate =
		"" +
		now.getFullYear() +
		(now.getMonth() + 1).toString().padStart(2, "0") +
		now.getDate().toString().padStart(2, "0") +
		now.getHours().toString().padStart(2, "0") +
		now.getMinutes().toString().padStart(2, "0") +
		now.getSeconds().toString().padStart(2, "0");

	return formattedDate + "_" + dictName;
}

type TransformLoaderData = {
	entries: object[];
	firstEntry: object;
	transformedFirstEntryData: object;
	dictionaryEntry: string;
	dictionaryLemma: string;
	dictionaryLexicographicResource: string;
	dictionaryName: string;
	dictionaryMetadata: object;
	transformationId: Number;
	transformationData: object;
	paths: object;
};

export async function action({ request, params }) {
	let formData = await request.formData();

	let namespaces = null; // or some array of namespaces
	let dictSelector = formData.get("dictionary-lexicographic-resource");
	let entrySelector = formData.get("dictionary-entry");
	let lemmaSelector = formData.get("dictionary-lemma");
	let transformationId = formData.get("transformation-id");
	let transformationName = formData.get("transformation-name");
	const dictionaryId = params.dictionaryId;
	const dictionaryName = formData.get("dictionary-name");
	const organisationId = params.organisationId;
	const dictionaryTitle = formData.get("dictionary-title");
	const dictionaryUri = formData.get("dictionary-uri");
	const dictionaryLanguage = formData.get("dictionary-language");
	const advancedMode = JSON.parse(formData.get("advanced-mode"));

	console.log("intent", formData.get("intent"));

	console.log("lemma", typeof advancedMode);

	const intent = formData.get("intent");

	switch (intent) {
		case "update":
			// update dictionary metadata
			const dictionaryMetadata = {
				title: dictionaryTitle,
				uri: dictionaryUri,
				language: dictionaryLanguage,
			};

			const updateDictionaryResponse = await eleApiService.updateDictionary(
				dictionaryId,
				entrySelector,
				lemmaSelector,
				dictionaryMetadata
			);

			if (updateDictionaryResponse.status === 404) {
				throw new Error(
					`Dictionary not found: ${updateDictionaryResponse.error}`
				);
			}

			// update transformation
			const { xlat, fieldsToUpdate } = createXlatAndFieldsToUpdate(formData);
			console.log("xlat2", xlat);

			// set simple or advanced
			formData = setSimpleOrAdvanced(formData, advancedMode);

			// Call createDmlexSpec
			let result = createDmlexSpec({
				fieldsToUpdate,
				formData,
				namespaces,
				dictSelector,
				entrySelector,
				dictionaryTitle,
				dictionaryUri,
				dictionaryLanguage,
				xlat,
			});

			// Remove null values from the selector
			const newResult = removeNullInSelector(result);

			const transformationResponse = await eleApiService.getTransformation(
				transformationId
			);
			const transformation = await transformationResponse.json();

			if (transformationResponse.status === 404) {
				throw new Error(`Transformation not found: ${transformation.error}`);
			}

			const updatedTranformationResponse =
				await eleApiService.updateTransformation(
					transformationId,
					entrySelector,
					lemmaSelector,
					transformationName,
					newResult,
					advancedMode
				);
			const updatedTransformation = await updatedTranformationResponse.json();

			//return window.location.reload();

			return {
				success: true,
			};
		//return redirect(
		//	`/app/organisation/${organisationId}/dictionaries/${dictionaryId}/transform/`
		//);

		case "reset":
			console.log("Resetting transformation ...");

			const newTransformationResponse = await eleApiService.resetTransformation(
				transformationId,
				entrySelector,
				lemmaSelector,
				dictSelector,
				transformationName,
				dictionaryId,
				dictionaryTitle,
				dictionaryUri,
				dictionaryLanguage
			);
			if (newTransformationResponse.status === 400) {
				throw new Error("Transformation is not valid");
			}

			const newTransformation = await newTransformationResponse.json();

			transformationId = newTransformation.id;
			return window.location.reload();

		case "import":
			console.log("Importing into dmlex ...");
			const createTaskBody = {
				type: "export",
				input: {
					file_id: dictionaryId,
					transformation_id: transformationId,
				},
			};
			const createTaskResponse = await eleApiService.createTask(createTaskBody);
			console.log(createTaskResponse);

		default:
			return {
				status: 400,
				body: "Invalid intent",
			};
	}
}

export async function loader({ params }) {
	// get dictionary entries
	//const entries = await getEntries(params.dictionaryId);

	console.log("LOADER");

	const { organisationId, dictionaryId } = params;

	const limit = 10;

	const dictionaryResponse = await eleApiService.getDictionary(dictionaryId);

	if (dictionaryResponse.status === 404) {
		throw new Error("Dictionary not found");
	}

	const dictionary = await dictionaryResponse.json();

	const dictionaryName = dictionary.name;
	const dictionaryEntry = dictionary.entry;
	const dictionaryLemma = dictionary.lemma;
	const dictionaryMetadata = dictionary.dictionary_metadata;

	const entriesResponse = await eleApiService.listEntries(dictionaryId, limit);
	const entries = await entriesResponse.json();

	if (entries.length === 0) {
		throw new Error("No entries found");
	}

	const firstEntryId = entries.entries[0].id;

	const firstEntryResponse = await eleApiService.getEntry(
		dictionaryId,
		firstEntryId
	);

	const firstEntry = await firstEntryResponse.json();

	// parse xml and get root - TODO: implement this in the backend as a field in the database (field exists, let's wait for some feedback)
	let parser = new DOMParser();
	let xmlDoc = parser.parseFromString(firstEntry.text, "text/xml");
	let root = xmlDoc.documentElement;
	const dictionaryLexicographicResource = `${root.nodeName}`;

	// get transformation id, if no transformation exists, create one, otherwise load from the database
	let transformationId;

	if (!dictionary.default_transformation_id) {
		console.log("No default transformation found");
		const newTransformationName = generateDefaultTransformationName(
			dictionary.name
		);
		const newTransformationResponse = await eleApiService.createTransformation(
			dictionaryEntry,
			dictionaryLemma,
			dictionaryLexicographicResource,
			newTransformationName,
			dictionaryId,
			dictionaryMetadata.title,
			dictionaryMetadata.uri,
			dictionaryMetadata.language
		);
		if (newTransformationResponse.status === 400) {
			throw new Error("Transformation is not valid");
		}

		const newTransformation = await newTransformationResponse.json();

		transformationId = newTransformation.transformation_id;
	} else {
		console.log("Default transformation found");
		transformationId = dictionary.default_transformation_id;
	}

	const transformationDataResponse = await eleApiService.getTransformation(
		transformationId
	);

	const transformationData = await transformationDataResponse.json();

	const transformedFirstEntryData = await applyTransformationToEntry(
		transformationId,
		firstEntryId
	);

	const pathsResponse = await eleApiService.getEntryPaths(
		dictionaryId,
		firstEntryId
	);
	const paths = await pathsResponse.json();

	return {
		entries,
		firstEntry,
		transformedFirstEntryData,
		dictionaryEntry,
		dictionaryLemma,
		dictionaryLexicographicResource,
		dictionaryName,
		dictionaryMetadata,
		transformationId,
		transformationData,
		paths,
	};
}

export function TransformDictionary() {
	const {
		entries,
		firstEntry,
		transformedFirstEntryData,
		dictionaryEntry,
		dictionaryLemma,
		dictionaryLexicographicResource,
		dictionaryName,
		dictionaryMetadata,
		transformationId,
		transformationData,
		paths,
	} = useLoaderData() as TransformLoaderData;

	const [selectedEntry, setSelectedEntry] = useState({
		originalXml: beautify(firstEntry.text),
		transformedJson: transformedFirstEntryData,
	});

	const flatTransformation = getOutElementPaths(
		transformationData.transformation.children[0]
	);

	console.log("FLAT TRANSFORMATION", flatTransformation);

	const [entriesList, setEntriesList] = useState(() => {
		let options = [];
		entries.entries.forEach((entry) => {
			options.push({ label: entry.lemma, value: entry.id });
		});
		return options;
	});

	const [entryPaths, setEntryPaths] = useState(() => {
		let options = [];
		paths.paths.forEach((path: string) => {
			options.push({ label: path, value: `.//${path}` });
		});
		return options;
	});

	const [isAdvancedVisible, setAdvancedVisible] = useState(
		transformationData.advanced_mode
	);

	const { organisationId, dictionaryId } = useParams();

	const prettyXml = beautify(firstEntry.text);

	const handleEntryChange = async (
		selectedOption: React.ChangeEvent<HTMLSelectElement>
	) => {
		// Parse the selected entry ID from the selected option's value
		const selectedEntryId = parseInt(selectedOption.value, 10);

		// Fetch the transformed entry data
		const transformedEntry = await applyTransformationToEntry(
			transformationId,
			selectedEntryId
		);

		// Fetch the original entry data
		const entryResponse = await eleApiService.getEntry(
			dictionaryId,
			selectedEntryId
		);
		const entry = await entryResponse.json();

		// Update the state with the new selected entry data
		setSelectedEntry({
			originalXml: beautify(entry.text),
			transformedJson: transformedEntry,
		});
	};

	let buttons = [
		{
			name: "Update",
			type: "submit",
			id: dictionaryId,
			value: "update",
		},
		{
			name: "Reset",
			type: "submit",
			id: dictionaryId,
			value: "reset",
		},
		{
			name: "Import",
			type: "submit",
			id: dictionaryId,
			value: "import",
		},
	];

	return (
		<div className="flex flex-col md:flex-row">
			<div className="w-full md:w-1/2 p-4">
				<Form method="post">
					<input
						type="hidden"
						name="dictionary-entry"
						value={dictionaryEntry}
					/>
					<input
						type="hidden"
						name="dictionary-lemma"
						value={dictionaryLemma}
					/>
					<input
						type="hidden"
						name="dictionary-lexicographic-resource"
						value={dictionaryLexicographicResource}
					/>

					<input
						type="hidden"
						name="transformation-id"
						value={transformationId.toString()}
					/>

					<input
						type="hidden"
						name="transformation-name"
						value={transformationData.name.toString()}
					/>

					<input
						type="hidden"
						name="dictionary-name"
						value={dictionaryName.toString()}
					/>

					<input
						type="hidden"
						name="dictionary-metadata"
						value={JSON.stringify(dictionaryMetadata)}
					/>

					<input
						type="hidden"
						name="advanced-mode"
						value={isAdvancedVisible.toString()}
					/>

					<div className="flex justify-between items-center mb-4">
						<EleSearchableDropdownField
							label="Entry"
							name="select-entry"
							options={entriesList}
							isClearable={false}
							existingValue={entriesList[0].value}
							onChange={handleEntryChange}
						/>

						<EleToggle
							enabled={isAdvancedVisible}
							setEnabled={setAdvancedVisible}
						/>
						<EleButtonGroup items={buttons} />
					</div>
					<TransformTree3
						entry={selectedEntry.transformedJson}
						flatTransformation={flatTransformation}
						dictionaryMetadata={dictionaryMetadata}
						entryPaths={entryPaths}
						isAdvancedVisible={isAdvancedVisible}
						dictionaryId={dictionaryId}
					/>
				</Form>
			</div>

			<EleTabs
				originalXml={selectedEntry.originalXml}
				transformedResult={selectedEntry.transformedJson}
				jsonSpec={transformationData.transformation}
			/>
		</div>
	);
}
