import React, { useState, useEffect } from "react";
import { TransformTree } from "../shared/client/ele-transform-tree";
import { createDmlexSpec, attributeDefaultValues } from "../shared/dmlex-spec";
import { Form, redirect, useLoaderData, useLocation, useFetcher } from "react-router-dom";
import { TransformTree2 } from "../shared/client/ele-transform-tree2";
import { EleButton } from "../shared/client/ele-button";
import beautify from "xml-beautifier";
import { EleInputField } from "../shared/client/ele-input-field";
import { useParams } from "react-router-dom";
import eleApiService from "../shared/ele-api-service";
import { TransformTree3 } from "../shared/client/ele-transform-tree3";
import EleTabs from "../shared/client/ele-tabs";


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
	transformationId: Number;
	transformationData: object;
};

export async function action({ request, params }) {
	const formData = await request.formData();

    let namespaces = null; // or some array of namespaces
    let dictSelector = formData.get("dictionary-lexicographic-resource");
    let entrySelector = formData.get("dictionary-entry");
    let lemmaSelector = formData.get("dictionary-lemma");
    let transformationId = formData.get("transformation-id");
    const dictionaryId = params.dictionaryId;
    const dictionaryName = formData.get("dictionary-name");
    const organisationId = params.organisationId;

    console.log(formData.get("intent"))

    const intent = formData.get("intent");

    switch (intent) {
        case "update":
    
            const fieldsToUpdate = Object.fromEntries(formData);
            console.log("fieldsToUpdate", fieldsToUpdate);

            // remove empty fields
            Object.keys(fieldsToUpdate).forEach((key) => {
                if (fieldsToUpdate[key] === "") {
                    delete fieldsToUpdate[key];
                }
            });

            

            // Call createDmlexSpec
            let result = createDmlexSpec({
                fieldsToUpdate,
                formData,
                namespaces,
                dictSelector,
                entrySelector,
            });

            console.log("result", result);

            //let fieldId = "entry-partOfSpeech-inSelector";
            //let value = findNestedValue(result, fieldId);
            //console.log("test", value); // This will log the value of the "inSelector" field in the "partOfSpeech" child of "entry"

            const newResult = removeNullInSelector(result);
            console.log("newResult", newResult);

            const transformationResponse = await eleApiService.getTransformation(
                transformationId
            );
            const transformation = await transformationResponse.json();

            console.log("transformation", transformation);

            if (transformationResponse.status === 404) {
                throw new Error(`Transformation not found: ${transformation.error}`);
            }

            
            const updatedTranformationResponse = await eleApiService.updateTransformation(
                transformationId,
                entrySelector,
                lemmaSelector,
                dictSelector,
                transformation.name,
                result
            );
            const updatedTransformation = await updatedTranformationResponse.json();

            console.log(updatedTransformation);
            

            //return redirect(`/app/organisation/${organisationId}/dictionaries/${dictionaryId}/transform/`);
            return window.location.reload();

        case "reset":

            console.log("No default transformation found");
            const newTransformationName = generateDefaultTransformationName(
                dictionaryName
            );
            const newTransformationResponse = await eleApiService.createTransformation(
                entrySelector,
                lemmaSelector,
                dictSelector,
                newTransformationName,
                dictionaryId
            );
            if (newTransformationResponse.status === 400) {
                throw new Error("Transformation is not valid");
            }

            const newTransformation = await newTransformationResponse.json();
            
            transformationId = newTransformation.id;
            //return redirect(`/app/organisation/${organisationId}/dictionaries/${dictionaryId}/transform/`);
            return window.location.reload();

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

    console.log("LOADER")

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
	const dictionaryLexicographicResource = "/Woordenboek";

	const entriesResponse = await eleApiService.listEntries(dictionaryId, limit);
	const entries = await entriesResponse.json();

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
			dictionaryId
		);
		if (newTransformationResponse.status === 400) {
			throw new Error("Transformation is not valid");
		}

		const newTransformation = await newTransformationResponse.json();
		
		transformationId = newTransformation.id;
	} else {
		console.log("Default transformation found");
		transformationId = dictionary.default_transformation_id;
	}

	//console.log("transformationId", transformationId);

	const transformationDataResponse = await eleApiService.getTransformation(
		transformationId
	);

	const transformationData = await transformationDataResponse.json();

	if (entries.length === 0) {
		throw new Error("No entries found");
	}

	//console.log(entries);
	const firstEntryId = entries.entries[0].id;

	const firstEntryResponse = await eleApiService.getEntry(
		dictionaryId,
		firstEntryId
	);

	const firstEntry = await firstEntryResponse.json();

	//console.log(firstEntry);

	const transformationResponse = await eleApiService.applyTransformation(
		transformationId,
		firstEntryId
	);
	const transformedFirstEntry = await transformationResponse.json();

	//console.log(transformedFirstEntry);

	if (transformationResponse.status === 404) {
		throw new Error(`Transformation failed: ${transformedFirstEntry.error}`);
	}

	const transformedFirstEntryData = transformedFirstEntry.data[0].entrys[0];

	return {
		entries,
		firstEntry,
		transformedFirstEntryData,
		dictionaryEntry,
		dictionaryLemma,
		dictionaryLexicographicResource,
        dictionaryName,
		transformationId,
		transformationData,
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
		transformationId,
		transformationData,
	} = useLoaderData() as TransformLoaderData;

    const [selectedEntry, setSelectedEntry] = useState(transformedFirstEntryData);
    const [transformation, setTransformation] = useState(transformationData.transformation);

    const fetcher = useFetcher();
    
    useEffect(() => {
        
        fetcher.load(`/app/organisation/${organisationId}/dictionaries/${dictionaryId}/transform/`);

        setSelectedEntry(transformedFirstEntryData);
        setTransformation(transformationData.transformation);
        // reload page
        console.log("here", transformation)
        
    }, []);

    

	const { organisationId, dictionaryId } = useParams();



	
	//console.log("data2", transformedFirstEntryData);

	const prettyXml = beautify(firstEntry.text);

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
						value={transformationId.toString()}
					/>

                    <input
						type="hidden"
						name="dictionary-name"
						value={dictionaryName.toString()}
					/>

					<div className="flex justify-between items-center mb-4">
						<EleInputField name="search" placeholder="Search entries ..." />

						{/* Other buttons */}

						<EleButton label="Update" type="submit" value="update" />
                        <EleButton label="Reset" type="submit" value="reset" />
					</div>
					<TransformTree3
						entry={selectedEntry}
						transformation={transformation}
					/>
				</Form>
			</div>

			<EleTabs
				originalXml={prettyXml}
				transformedResult={selectedEntry}
                jsonSpec={transformation}
			/>
		</div>
	);
}
