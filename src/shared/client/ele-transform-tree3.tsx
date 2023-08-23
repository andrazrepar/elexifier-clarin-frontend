import React, { useState } from "react";

import { EleTransformationHeadwordElement } from "./transformation/ele-transformation-headword-element";
import { EleTransformationHomographNumberElement } from "./transformation/ele-transformation-homograph-number-element";
import { EleTransformationPartOfSpeechElement } from "./transformation/ele-transformation-part-of-speech-element";
import { EleTransformationLabelElement } from "./transformation/ele-transformation-label-element";
import { EleTransformationPronounciationElement } from "./transformation/ele-transformation-pronounciation-element";
import { EleTransformationTranscriptionElement } from "./transformation/ele-transformation-transcription-element";
import { EleTransformationInflectedFormElement } from "./transformation/ele-transformation-inflected-form-element";
import { EleTransformationSenseElement } from "./transformation/ele-transformation-sense-element";
import { EleTransformationDefinitionElement } from "./transformation/ele-transformation-definition-element";
import { EleTransformationExampleElement } from "./transformation/ele-transformation-example-element";
import { EleDictionaryMetaData } from "./ele-dictionary-metadata";
import { ElePosMapping } from "../ele-pos";
import { EleTransformationParameters } from "./ele-transformation-parameters";

export function TransformTree3(props: any) {
	// Assuming we have two separate states, one for parents and one for children.
	const [isParentExpanded, setIsParentExpanded] = useState<{
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

	return (
		<div className="my-4 bg-white px-5 py-3">
			<div className="dictionary-metadata bg-white shadow rounded p-5 mb-5">
				<EleDictionaryMetaData
					id="dictionary-metadata"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="Dictionary Metadata"
					dictionaryMetadata={props.dictionaryMetadata}
				/>
			</div>
			<div className="transformation-parameters bg-white shadow rounded p-5 mb-5">
				<EleTransformationParameters
					id="transformation-parameters"
					isSubElementExpanded={isParentExpanded}
					handleExpand={toggleParentElement}
					label="Transformation Parameters"
					transformationParameters={props.transformationParameters}
					transformation={props.transformation}
					entry={props.entry}
				/>
			</div>

			<div className="dictionary-pos-mapping bg-white shadow rounded p-5 mb-5">
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
