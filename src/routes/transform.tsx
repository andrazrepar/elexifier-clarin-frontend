import React, { useState, useEffect, useRef } from "react";
import { TransformTree } from "../shared/_old/ele-transform-tree";
import { createDmlexSpec, attributeDefaultValues } from "../shared/dmlex-spec";
import {
	Form,
	redirect,
	useLoaderData,
	useLocation,
	useFetcher,
	useActionData,
} from "react-router-dom";

import { useParams } from "react-router-dom";
import eleApiService from "../shared/ele-api-service";
import { TransformTree3 } from "../shared/elements/ele-transform-tree3";
import EleTabs from "../shared/elements/ele-tabs";
import EleButtonGroup from "../shared/elements/ele-button-group";
import { EleDropdownField } from "../shared/elements/ele-dropdown-field";
import { EleSearchableDropdownField } from "../shared/elements/ele-searchable-dropdown-field";
import EleToggle from "../shared/elements/ele-toggle";
import { generateNewTransformation } from "../shared/transformation/transformation-methods";

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

function getOutElementPaths(obj, path = "", index = 0) {
	let result = {};

	for (let key in obj) {
		let outElement = obj["outElement"];
		let newPath =
			path === ""
				? `${outElement}${index}`
				: key === "textVals" || key === "children"
				? `${path}-${outElement}${index}`
				: `${path}-${outElement}${index}-${key}`;

		if (key !== "outElement" && key !== "children" && key !== "textVals") {
			result[newPath] = obj[key];
		}

		if (key === "children") {
			let groups = {};
			for (let child of obj[key]) {
				// Group children by their outElement
				let childOutElement = child["outElement"];
				if (!groups[childOutElement]) {
					groups[childOutElement] = [];
				}
				groups[childOutElement].push(child);
			}

			// Process each group separately
			for (let group in groups) {
				let groupChildren = groups[group];
				groupChildren.forEach((child, index) => {
					result = {
						...result,
						...getOutElementPaths(child, newPath, index),
					};
				});
			}
		} else if (key === "textVals") {
			for (let child of obj[key]) {
				let childOutElement = child["outElement"];
				let childPath = `${newPath}-${childOutElement}`;
				for (let childKey in child) {
					if (childKey !== "outElement") {
						result[`${childPath}-${childKey}`] = child[childKey];
					}
				}
			}
		}
	}
	return result;
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
	controlledValues: { [key: string]: any };
} {
	let fieldsToUpdate: { [key: string]: any } = Object.fromEntries(formData);

	// create xlat mapping and remove from fieldsToUpdate
	let xlat: { [key: string]: any } = {};

	let controlledValues: { [key: string]: any } = {};

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
		} else if (key.startsWith("controlled-values")) {
			// Remove 'controlled-values-' from the key
			let newKey = key.replace("controlled-values-", "");
			let [type, index, field, subField] = newKey.split("-");
			if (fieldsToUpdate[key] !== "") {
				if (!controlledValues[type]) {
					controlledValues[type] = {};
				}
				if (!controlledValues[type][index]) {
					controlledValues[type][index] = {};
				}

				let value = fieldsToUpdate[key];
				if (
					["forHeadwords", "forTranslations", "forCollocates"].includes(
						field
					) &&
					value === "on"
				) {
					value = "true";
				}
				controlledValues[type][index][field] = value;
			}
			delete fieldsToUpdate[key];
		}
	});

	// Convert arrays of objects to arrays
	Object.keys(controlledValues).forEach((key) => {
		controlledValues[key] = Object.values(controlledValues[key]);
	});

	return { xlat, fieldsToUpdate, controlledValues };
}

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

	const transformedEntryDataJson = transformedEntry.json[0].entrys[0];
	const transformedEntryDataXml = transformedEntry.xml;
	const transformedEntryDataRdf = transformedEntry.rdf;

	return {
		transformedEntryDataJson,
		transformedEntryDataXml,
		transformedEntryDataRdf,
	};
}

async function getDictionaryData(dictionaryId) {
	const dictionaryResponse = await eleApiService.getDictionary(dictionaryId);
	if (dictionaryResponse.status === 404) {
		throw new Error("Dictionary not found");
	}
	return await dictionaryResponse.json();
}

async function getEntries(dictionaryId, limit) {
	const entries = await (
		await eleApiService.listEntries(dictionaryId, limit)
	).json();
	if (entries.length === 0) {
		throw new Error("No entries found");
	}
	return entries;
}

async function getFirstEntry(dictionaryId, firstEntryId) {
	return await (
		await eleApiService.getEntry(dictionaryId, firstEntryId)
	).json();
}

async function getTransformationId(
	dictionaryData: any,
	dictionaryLexicographicResource: string,
	dictionaryId: Number
) {
	let transformationId = dictionaryData.default_transformation_id;
	if (!transformationId) {
		const newTransformationName = generateDefaultTransformationName(
			dictionaryData.name
		);
		const newTransformationResponse = await eleApiService.createTransformation(
			dictionaryData.entry,
			dictionaryData.lemma,
			dictionaryLexicographicResource,
			newTransformationName,
			dictionaryId,
			dictionaryData.dictionary_metadata.title,
			dictionaryData.dictionary_metadata.uri,
			dictionaryData.dictionary_metadata.language
		);

		if (newTransformationResponse.status === 400) {
			throw new Error("Transformation is not valid");
		}

		const newTransformation = await newTransformationResponse.json();
		transformationId = newTransformation.transformation_id;
	}
	return transformationId;
}

async function getTransformationData(transformationId) {
	return await (await eleApiService.getTransformation(transformationId)).json();
}

async function getPaths(dictionaryId, firstEntryId) {
	const pathsResponse = await eleApiService.getEntryPaths(
		dictionaryId,
		firstEntryId
	);
	return await pathsResponse.json();
}

function parseXmlAndGetRoot(xmlString: string): string {
	let parser = new DOMParser();
	let xmlDoc = parser.parseFromString(xmlString, "text/xml");
	let root = xmlDoc.documentElement;
	return `${root.nodeName}`;
}

type TransformLoaderData = {
	entries: object[];
	firstEntry: object;
	transformedEntryDataJson: object;
	transformedEntryDataXml: string;
	transformedEntryDataRdf: string;
	dictionaryEntry: string;
	dictionaryLemma: string;
	dictionaryLexicographicResource: string;
	dictionaryName: string;
	dictionaryMetadata: object;
	transformationId: Number;
	transformationData: object;
	paths: object;
	taskInfo: object;
};

function generatePathOptions(paths) {
	let options = [];
	paths.paths.forEach((path: string) => {
		options.push({ label: path, value: `.//${path}` });
	});
	return options;
}

function generateEntryOptions(entries) {
	let options = [];
	entries.entries.forEach((entry) => {
		options.push({ label: entry.lemma, value: entry.id });
	});
	return options;
}

async function fetchEntryData(dictionaryId, selectedEntryId, transformationId) {
	const { transformedEntryDataJson, transformedEntryDataXml } =
		await applyTransformationToEntry(transformationId, selectedEntryId);
	const entryResponse = await eleApiService.getEntry(
		dictionaryId,
		selectedEntryId
	);
	const entry = await entryResponse.json();
	return {
		originalXml: entry.text,
		transformedJson: transformedEntryDataJson,
		transformedXml: transformedEntryDataXml,
	};
}

async function updateDictionaryMetadata(
	dictionaryId: string,
	entrySelector: string,
	lemmaSelector: string,
	dictionaryTitle: string,
	dictionaryUri: string,
	dictionaryLanguage: string
) {
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
		throw new Error(`Dictionary not found: ${updateDictionaryResponse.error}`);
	}
}

async function updateTransformation(
	transformationId: number,
	entrySelector: string,
	lemmaSelector: string,
	transformationName: string,
	updatedTransformation: any,
	advancedMode: boolean
) {
	const transformationResponse = await eleApiService.getTransformation(
		transformationId
	);
	const transformation = await transformationResponse.json();

	if (transformationResponse.status === 404) {
		throw new Error(`Transformation not found: ${transformation.error}`);
	}

	await eleApiService.updateTransformation(
		transformationId,
		entrySelector,
		lemmaSelector,
		transformationName,
		updatedTransformation,
		advancedMode
	);
}

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
	const intent = formData.get("intent");
	const exportedDictionaryPath = formData.get("exported_dictionary_path");

	console.log("INTENT", intent);
	// log the formData
	//for (let [key, value] of formData.entries()) {
	//	console.log(key, value);
	//}

	switch (intent) {
		case "update":
			// update dictionary metadata
			await updateDictionaryMetadata(
				dictionaryId,
				entrySelector,
				lemmaSelector,
				dictionaryTitle,
				dictionaryUri,
				dictionaryLanguage
			);

			// generate new transformation
			const { xlat, fieldsToUpdate, controlledValues } =
				createXlatAndFieldsToUpdate(formData);
			console.log("fieldsToUpdate", fieldsToUpdate);
			console.log("xlat", xlat);
			let updatedTransformation = generateNewTransformation(
				fieldsToUpdate,
				entrySelector,
				dictSelector,
				dictionaryTitle,
				dictionaryUri,
				dictionaryLanguage,
				xlat,
				controlledValues
			);
			console.log("newTransformation", updatedTransformation);

			// update transformation in the database
			await updateTransformation(
				transformationId,
				entrySelector,
				lemmaSelector,
				transformationName,
				updatedTransformation,
				advancedMode
			);

			//return window.location.reload();

			return {
				success: true,
			};
		//return redirect(
		//	`/app/organisation/${organisationId}/dictionaries/${dictionaryId}/transform/`
		//);

		case "reset":
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
			const importTaskBody = {
				type: "export",
				input: {
					file_id: dictionaryId,
					transformation_id: transformationId,
				},
			};
			const importTaskResponse = await eleApiService.createTask(importTaskBody);
			console.log(importTaskResponse);

		case "transform":
			const downloadTaskBody = {
				type: "download",
				input: {
					file_id: dictionaryId,
					transformation_id: transformationId,
				},
			};
			const downloadTaskResponse = await eleApiService.createTask(
				downloadTaskBody
			);
			console.log(downloadTaskResponse);
			return redirect("/app/tasks");

		case "reload_controlled_values":
			console.log("RELOAD CONTROLLED VALUES");

			const controlledValuesResponse = await eleApiService.getControlledValues(
				transformationId
			);
			const response = await controlledValuesResponse.json();
			switch (controlledValuesResponse.status) {
				case 200:
					// reload the page
					console.log("RESPONSE", response);
					return {
						success: true,
					};

				default:
					// Handle other status codes
					console.log(
						"Unexpected status code",
						controlledValuesResponse.status
					);
			}

		case "get_file":
			console.log("GET FILE");
			const downloadResponse = await eleApiService.getFile(transformationId);
			const downloadData = await downloadResponse.blob();
			console.log("downloadData", downloadData);
			return {
				body: downloadData,
				headers: {
					"Content-Disposition": `attachment; filename="exports.zip"`,
				},
			};

		default:
			return {
				status: 400,
				body: "Invalid intent",
			};
	}
}

export async function loader({ params }) {
	console.log("LOADER");
	const { organisationId, dictionaryId } = params;
	const limit = 10;

	const dictionaryData = await getDictionaryData(dictionaryId);
	const entries = await getEntries(dictionaryId, limit);
	const firstEntryId = entries.entries[0].id;
	const firstEntry = await getFirstEntry(dictionaryId, firstEntryId);

	// parse xml and get root - TODO: implement this in the backend as a field in the database (field exists, let's wait for some feedback)
	const dictionaryLexicographicResource = parseXmlAndGetRoot(firstEntry.text);

	const transformationId = await getTransformationId(
		dictionaryData,
		dictionaryLexicographicResource,
		dictionaryId
	);
	const transformationData = await getTransformationData(transformationId);

	// if task_id is present, check the status of the task
	let taskInfo;
	if (transformationData.task_id) {
		taskInfo = await (
			await eleApiService.getTask(transformationData.task_id)
		).json();
	} else {
		taskInfo = {
			status: "not_started",
		};
	}

	console.log("taskInfo", taskInfo);

	console.log("transformationData", transformationData);
	const {
		transformedEntryDataJson,
		transformedEntryDataXml,
		transformedEntryDataRdf,
	} = await applyTransformationToEntry(transformationId, firstEntryId);
	const paths = await getPaths(dictionaryId, firstEntryId);

	return {
		entries,
		firstEntry,
		transformedEntryDataJson,
		transformedEntryDataXml,
		transformedEntryDataRdf,
		dictionaryEntry: dictionaryData.entry,
		dictionaryLemma: dictionaryData.lemma,
		dictionaryLexicographicResource,
		dictionaryName: dictionaryData.name,
		dictionaryMetadata: dictionaryData.dictionary_metadata,
		transformationId,
		transformationData,
		paths,
		taskInfo,
	};
}

export function TransformDictionary() {
	const {
		entries,
		firstEntry,
		transformedEntryDataJson,
		transformedEntryDataXml,
		transformedEntryDataRdf,
		dictionaryEntry,
		dictionaryLemma,
		dictionaryLexicographicResource,
		dictionaryName,
		dictionaryMetadata,
		transformationId,
		transformationData,
		paths,
		taskInfo,
	} = useLoaderData() as TransformLoaderData;

	const actionData = useActionData();
	console.log("actionData", actionData);

	useEffect(() => {
		if (actionData && actionData.body) {
			const url = URL.createObjectURL(actionData.body);
			const link = document.createElement("a");
			link.href = url;

			const filename = actionData.headers["Content-Disposition"]
				.split("filename=")[1]
				.replace(/"/g, "");
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();
			link.remove();
		}
	}, [actionData]);

	const [selectedEntry, setSelectedEntry] = useState({
		originalXml: firstEntry.text,
		transformedJson: transformedEntryDataJson,
		transformedXml: transformedEntryDataXml,
		transformedRdf: transformedEntryDataRdf,
	});

	const flatTransformation = getOutElementPaths(
		transformationData.transformation.children[0]
	);

	const [allowTransform, setAllowTransform] = useState(
		taskInfo.status === "completed" ||
			taskInfo.status === "error" ||
			taskInfo.status === "not_started"
	);
	//const allowTransform = true;
	console.log("allowTransform", allowTransform);
	console.log("taskInfo", taskInfo);
	const [allowDownload, setAllowDownload] = useState(
		transformationData.exported_dictionary_path !== null &&
			transformationData.exported_dictionary_path !== undefined
	);

	const [entriesList, setEntriesList] = useState(() =>
		generateEntryOptions(entries)
	);
	const [entryPaths, setEntryPaths] = useState(() =>
		generatePathOptions(paths)
	);

	const [isAdvancedVisible, setAdvancedVisible] = useState(
		transformationData.advanced_mode
	);

	const [transformationStatus, setTransformationStatus] = useState(
		transformationData.transformation_status || "METADATA"
	);

	const { organisationId, dictionaryId } = useParams();

	const handleEntryChange = async (
		selectedOption: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selectedEntryId = parseInt(selectedOption.value, 10);
		const entryData = await fetchEntryData(
			dictionaryId,
			selectedEntryId,
			transformationId
		);
		setSelectedEntry(entryData);
	};

	let buttons = [
		{
			name: "Update",
			type: "submit",
			id: dictionaryId,
			value: "update",
			edit: true,
		},
		{
			name: "Reset",
			type: "submit",
			id: dictionaryId,
			value: "reset",
			edit: true,
		},
		{
			name: "Import",
			type: "submit",
			id: dictionaryId,
			value: "import",
			edit: true,
		},
		{
			name: allowTransform ? "Transform" : "Transform in progress...",
			type: "submit",
			id: dictionaryId,
			value: "transform",
			edit: allowTransform,
		},
		{
			name: "Download",
			type: "submit",
			id: dictionaryId,
			value: "get_file",
			edit: allowDownload,
		},
	];

	let ref = useRef(null);

	return (
		<div className="flex flex-col md:flex-row">
			<div className="w-full md:w-1/2 p-4">
				<Form ref={ref} method="post">
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

					<input
						type="hidden"
						name="exported_dictionary_path"
						value={transformationData.exported_dictionary_path || ""}
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
						existingControlledValues={
							transformationData.transformation.copyToOutElt || {}
						}
						existingXlat={
							transformationData.transformation.children[0]?.children
								?.find((el) => el.outElement === "partOfSpeech")
								?.textVals?.find((el) => el.outElement === "tag")?.xlat || {}
						}
						transformationStatus={transformationStatus}
						setTransformationStatus={setTransformationStatus}
						formRef={ref}
						taskInfo={taskInfo}
					/>
				</Form>
			</div>

			<EleTabs
				originalXml={selectedEntry.originalXml}
				transformedJson={selectedEntry.transformedJson}
				transformedXml={selectedEntry.transformedXml}
				transformedRdf={selectedEntry.transformedRdf}
				jsonSpec={transformationData.transformation}
			/>
		</div>
	);
}
