import React, { useState } from "react";

import { EleTransformationHeadwordElement } from "./ele-transformation-headword-element";
import { EleTransformationHomographNumberElement } from "./ele-transformation-homograph-number-element";
import { EleTransformationPartOfSpeechElement } from "./ele-transformation-part-of-speech-element";
import { EleTransformationLabelElement } from "./ele-transformation-label-element";
import { EleTransformationPronounciationElement } from "./ele-transformation-pronounciation-element";
import { EleTransformationTranscriptionElement } from "./ele-transformation-transcription-element";
import { EleTransformationInflectedFormElement } from "./ele-transformation-inflected-form-element";
import { EleTransformationSenseElement } from "./ele-transformation-sense-element";
import { EleTransformationDefinitionElement } from "./ele-transformation-definition-element";
import { EleTransformationExampleElement } from "./ele-transformation-example-element";
import { EleDictionaryMetaData } from "../elements/ele-dictionary-metadata";
import { ElePosMapping } from "../elements/ele-pos";

export function TransformTree3(props: any) {
	// Assuming we have two separate states, one for parents and one for children.
	const [isParentExpanded, setIsParentExpanded] = useState<{
		[id: string]: boolean;
	}>({});
	const [isChildExpanded, setIsChildExpanded] = useState<{
		[id: string]: boolean;
	}>({});

	const toggleParentElement = (e: React.MouseEvent, id: string) => {
		e.stopPropagation();

		// Set all other parents to collapsed, and toggle the clicked parent.
		setIsParentExpanded((prevState) => ({
			...Object.keys(prevState).reduce(
				(acc, curr) => ({ ...acc, [curr]: false }),
				{}
			),
			[id]: !prevState[id],
		}));
	};

	const toggleChildElement = (e: React.MouseEvent, id: string) => {
		e.stopPropagation();

		// Toggle only the clicked child, do not collapse other children.
		setIsChildExpanded((prevState) => ({ ...prevState, [id]: !prevState[id] }));
	};
	console.log(props.transformation.children);
	return (
		<div className="my-4 bg-white px-5 py-3">
			<div className="transformation-parameters bg-white shadow rounded p-5 mb-5">
				<h2 className="text-xl font-semibold text-indigo-600 mb-3">
					Transformation Parameters
				</h2>
				<EleTransformationHeadwordElement
					id="entry-headword"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="headword"
					entry={props.entry}
					existingValues={props.transformation.children
						?.find((el: any) => el.outElement === "entry")
						?.textVals.find((el: any) => el.outElement === "headword")}
				/>

				<EleTransformationHomographNumberElement
					id="entry-homographNumber"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="homographNumber"
					entry={props.entry}
					existingValues={props.transformation.children
						?.find((el: any) => el.outElement === "entry")
						?.textVals.find((el: any) => el.outElement === "homographNumber")}
				/>

				<EleTransformationPartOfSpeechElement
					id="entry-partOfSpeech"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="partOfSpeech"
					entry={props.entry}
					existingValues={props.transformation.children
						?.find((el: any) => el.outElement === "entry")
						?.children?.find((el: any) => el.outElement === "partOfSpeech")}
				/>

				<EleTransformationLabelElement
					id="entry-label"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="label"
					entry={props.entry}
					existingValues={props.transformation.children
						?.find((el: any) => el.outElement === "entry")
						?.children?.find((el: any) => el.outElement === "label")}
				/>

				<EleTransformationPronounciationElement
					id="entry-pronounciation"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="pronounciation"
					entry={props.entry}
					existingValues={props.transformation.children
						?.find((el: any) => el.outElement === "entry")
						?.children?.find((el: any) => el.outElement === "pronunciation")}
				>
					<EleTransformationLabelElement
						id="entry-pronounciation-label"
						isSubElementExpanded={isChildExpanded}
						handleExpand={toggleChildElement}
						label="label"
						existingValues={props.transformation.children
							?.find((el: any) => el.outElement === "entry")
							?.children?.find((el: any) => el.outElement === "pronunciation")
							?.children?.find((el: any) => el.outElement === "label")}
					/>

					<EleTransformationTranscriptionElement
						id="entry-pronounciation-transcription"
						isSubElementExpanded={isChildExpanded}
						handleExpand={toggleChildElement}
						label="transcription"
						existingValues={props.transformation.children
							?.find((el: any) => el.outElement === "entry")
							?.children?.find((el: any) => el.outElement === "pronunciation")
							?.children?.find((el: any) => el.outElement === "transcription")}
					/>
				</EleTransformationPronounciationElement>

				<EleTransformationInflectedFormElement
					id="entry-inflectedForm"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="inflectedForm"
					entry={props.entry}
					existingValues={props.transformation.children
						?.find((el: any) => el.outElement === "entry")
						?.children?.find((el: any) => el.outElement === "inflectedForm")}
				>
					<EleTransformationLabelElement
						id="entry-inflectedForm-label"
						isSubElementExpanded={isChildExpanded}
						handleExpand={toggleChildElement}
						label="label"
						existingValues={props.transformation.children
							?.find((el: any) => el.outElement === "entry")
							?.children?.find((el: any) => el.outElement === "inflectedForm")
							?.children?.find((el: any) => el.outElement === "label")}
					/>
					<EleTransformationPronounciationElement
						id="entry-inflectedForm-pronounciation"
						isSubElementExpanded={isChildExpanded}
						handleExpand={toggleChildElement}
						label="pronounciation"
						existingValues={props.transformation.children
							?.find((el: any) => el.outElement === "entry")
							?.children?.find((el: any) => el.outElement === "inflectedForm")
							?.children?.find((el: any) => el.outElement === "pronunciation")}
					>
						<EleTransformationLabelElement
							id="entry-inflectedForm-pronounciation-label"
							isSubElementExpanded={isChildExpanded}
							handleExpand={toggleChildElement}
							label="label"
							existingValues={props.transformation.children
								?.find((el: any) => el.outElement === "entry")
								?.children?.find((el: any) => el.outElement === "inflectedForm")
								?.children?.find((el: any) => el.outElement === "pronunciation")
								?.children?.find((el: any) => el.outElement === "label")}
						/>

						<EleTransformationTranscriptionElement
							id="entry-inflectedForm-pronounciation-transcription"
							isSubElementExpanded={isChildExpanded}
							handleExpand={toggleChildElement}
							label="transcription"
							existingValues={props.transformation.children
								?.find((el: any) => el.outElement === "entry")
								?.children?.find((el: any) => el.outElement === "inflectedForm")
								?.children?.find((el: any) => el.outElement === "pronunciation")
								?.children?.find((el: any) => el.outElement === "label")}
						/>
					</EleTransformationPronounciationElement>
				</EleTransformationInflectedFormElement>

				<EleTransformationSenseElement
					id="entry-sense"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="sense"
					entry={props.entry}
					existingValues={props.transformation.children
						?.find((el: any) => el.outElement === "entry")
						?.children?.find((el: any) => el.outElement === "sense")}
				>
					<EleTransformationLabelElement
						id="entry-sense-label"
						isSubElementExpanded={isChildExpanded}
						handleExpand={toggleChildElement}
						label="label"
						existingValues={props.transformation.children
							?.find((el: any) => el.outElement === "entry")
							?.children?.find((el: any) => el.outElement === "sense")
							?.children?.find((el: any) => el.outElement === "label")}
					/>

					<EleTransformationDefinitionElement
						id="entry-sense-definition"
						isSubElementExpanded={isChildExpanded}
						handleExpand={toggleChildElement}
						label="definition"
						existingValues={props.transformation.children
							?.find((el: any) => el.outElement === "entry")
							?.children?.find((el: any) => el.outElement === "sense")
							?.children?.find((el: any) => el.outElement === "definition")}
					/>

					<EleTransformationExampleElement
						id="entry-sense-example"
						isSubElementExpanded={isChildExpanded}
						handleExpand={toggleChildElement}
						label="example"
						existingValues={props.transformation.children
							?.find((el: any) => el.outElement === "entry")
							?.children?.find((el: any) => el.outElement === "sense")
							?.children?.find((el: any) => el.outElement === "example")}
					>
						<EleTransformationLabelElement
							id="entry-sense-example-label"
							isSubElementExpanded={isChildExpanded}
							handleExpand={toggleChildElement}
							label="label"
							existingValues={props.transformation.children
								?.find((el: any) => el.outElement === "entry")
								?.children?.find((el: any) => el.outElement === "sense")
								?.children?.find((el: any) => el.outElement === "example")
								?.children?.find((el: any) => el.outElement === "label")}
						/>
					</EleTransformationExampleElement>
				</EleTransformationSenseElement>
			</div>

			<div className="dictionary-metadata bg-white shadow rounded p-5">
				<EleDictionaryMetaData
					id="dictionary-metadata"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="Dictionary Metadata"
					dictionaryMetadata={props.dictionaryMetadata}
				/>
			</div>
			<div className="dictionary-pos-mapping bg-white shadow rounded p-5">
				<ElePosMapping
					id="dictionary-pos-mapping"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="Dictionary POS Mapping"
					xlat={
						props.transformation.children
							?.find((el: any) => el.outElement === "entry")
							?.children?.find((el: any) => el.outElement === "partOfSpeech")
							?.textVals[0].xlat
					}
				/>
			</div>
		</div>
	);
}
