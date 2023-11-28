import React, { useState, useEffect } from "react";
import { EleDictionaryMetaData } from "./ele-dictionary-metadata";
import { ElePosMapping } from "./ele-pos";
import { EleTransformationParameters } from "./ele-transformation-parameters";
import { EleControlledValues } from "./ele-controlled-values";
import { EleParamToggle } from "./ele-param-toggle";

export function TransformTree3(props: any) {
	// Assuming we have two separate states, one for parents and one for children.
	const [isParentExpanded, setIsParentExpanded] = useState<{
		[id: string]: boolean;
	}>({});

	const toggleParentElement = (e: React.MouseEvent, id: string) => {
		e?.stopPropagation();

		// Set all other parents to collapsed, and toggle the clicked parent.
		setIsParentExpanded((prevState) => ({
			...Object.keys(prevState).reduce(
				(acc, curr) => ({ ...acc, [curr]: false }),
				{}
			),
			[id]: !prevState[id],
		}));
	};

	const [controlledValues, setControlledValues] = useState({
		definitionTypeTags:
			props.existingControlledValues?.definitionTypeTags || [],
		inflectedFormTags: props.existingControlledValues?.inflectedFormTags || [],
		labelTags: props.existingControlledValues?.labelTags || [],
		labelTypeTags: props.existingControlledValues?.labelTypeTags || [],
		partOfSpeechTags: props.existingControlledValues?.partOfSpeechTags || [],
		sourceIdentityTags:
			props.existingControlledValues?.sourceIdentityTags || [],
		transcriptionSchemeTags:
			props.existingControlledValues?.transcriptionSchemeTags || [],
	});

	const [xlat, setXlat] = useState(() => {
		// Initialize xlat with a copy of props.existingXlat
		let initialXlat = { ...props.existingXlat };

		// Add missing keys from partOfSpeechTags with empty string values
		if (props.existingControlledValues?.partOfSpeechTags) {
			props.existingControlledValues.partOfSpeechTags.forEach(
				(tagObj: { tag: string }) => {
					if (!(tagObj.tag in initialXlat)) {
						initialXlat[tagObj.tag] = "";
					}
				}
			);
		}

		return initialXlat;
	});

	//console.log(props.transformationStatus);

	const [toggleStatus, setToggleStatus] = useState({
		METADATA: props.transformationStatus === "METADATA",
		PARAMETERS: props.transformationStatus === "PARAMETERS",
		CONTROLLED_VALUES: props.transformationStatus === "CONTROLLED_VALUES",
		POS_MAPPING: props.transformationStatus === "POS_MAPPING",
	});

	console.log("status", toggleStatus.PARAMETERS);

	return (
		<div className="my-4 bg-white px-5 py-3">
			<div className="dictionary-metadata bg-white shadow rounded p-5 mb-5">
				<div className="flex justify-between items-start">
					<div
						className={`${
							toggleStatus.METADATA ? "" : "opacity-50 pointer-events-none"
						}`}
					>
						<EleDictionaryMetaData
							id="dictionary-metadata"
							isSubElementExpanded={isParentExpanded}
							handleExpand={toggleParentElement}
							label="Dictionary Metadata"
							dictionaryMetadata={props.dictionaryMetadata}
							newStatus={toggleStatus.METADATA}
							setToggleStatus={(newStatus) =>
								setToggleStatus((prevStatus) => ({
									...prevStatus,
									METADATA: newStatus,
									PARAMETERS: !newStatus,
									CONTROLLED_VALUES: !newStatus,
									POS_MAPPING: !newStatus,
								}))
							}
						/>
					</div>
					<EleParamToggle
						elementId="dictionary-metadata"
						handleExpand={toggleParentElement}
						newStatus={toggleStatus.METADATA}
						setToggleStatus={(newStatus) =>
							setToggleStatus((prevStatus) => ({
								...prevStatus,
								METADATA: newStatus,
								PARAMETERS: !newStatus,
								CONTROLLED_VALUES: !newStatus,
								POS_MAPPING: !newStatus,
							}))
						}
					/>
				</div>
			</div>
			<div className="dictionary-metadata bg-white shadow rounded p-5 mb-5">
				<div className="flex justify-between items-start">
					<div
						className={`${
							toggleStatus.PARAMETERS ? "" : "opacity-50 pointer-events-none"
						}`}
					>
						<EleTransformationParameters
							id="transformation-parameters"
							isSubElementExpanded={isParentExpanded}
							handleExpand={toggleParentElement}
							label="Transformation Parameters"
							transformationParameters={props.transformationParameters}
							flatTransformation={props.flatTransformation}
							entry={props.entry}
							entryPaths={props.entryPaths}
							isAdvancedVisible={props.isAdvancedVisible}
						/>
					</div>
					<EleParamToggle
						elementId="transformation-parameters"
						handleExpand={toggleParentElement}
						newStatus={toggleStatus.PARAMETERS}
						setToggleStatus={(newStatus) =>
							setToggleStatus((prevStatus) => ({
								...prevStatus,
								METADATA: !newStatus,
								PARAMETERS: newStatus,
								CONTROLLED_VALUES: !newStatus,
								POS_MAPPING: !newStatus,
							}))
						}
					/>
				</div>
			</div>
			<div className="dictionary-metadata bg-white shadow rounded p-5 mb-5">
				<div className="flex justify-between items-start">
					<div
						className={`${
							toggleStatus.CONTROLLED_VALUES
								? ""
								: "opacity-50 pointer-events-none"
						}`}
					>
						<EleControlledValues
							id="controlled-values"
							isSubElementExpanded={isParentExpanded}
							handleExpand={toggleParentElement}
							label="Controlled Values"
							flatTransformation={props.flatTransformation}
							controlledValues={controlledValues}
							setControlledValues={setControlledValues}
							exportedDictionary={props.exportedDictionary}
							formRef={props.formRef}
							taskInfo={props.taskInfo}
						/>
					</div>
					<EleParamToggle
						elementId="controlled-values"
						handleExpand={toggleParentElement}
						newStatus={toggleStatus.CONTROLLED_VALUES}
						setToggleStatus={(newStatus) =>
							setToggleStatus((prevStatus) => ({
								...prevStatus,
								METADATA: !newStatus,
								PARAMETERS: !newStatus,
								CONTROLLED_VALUES: newStatus,
								POS_MAPPING: !newStatus,
							}))
						}
					/>
				</div>
			</div>
			<div className="dictionary-metadata bg-white shadow rounded p-5 mb-5">
				<div className="flex justify-between items-start">
					<div
						className={`${
							toggleStatus.POS_MAPPING ? "" : "opacity-50 pointer-events-none"
						}`}
					>
						<ElePosMapping
							id="dictionary-pos-mapping"
							isSubElementExpanded={isParentExpanded}
							handleExpand={toggleParentElement}
							label="POS Mapping"
							xlat={xlat}
						/>
					</div>
					<EleParamToggle
						elementId="dictionary-pos-mapping"
						handleExpand={toggleParentElement}
						newStatus={toggleStatus.POS_MAPPING}
						setToggleStatus={(newStatus) =>
							setToggleStatus((prevStatus) => ({
								...prevStatus,
								METADATA: !newStatus,
								PARAMETERS: !newStatus,
								CONTROLLED_VALUES: !newStatus,
								POS_MAPPING: newStatus,
							}))
						}
					/>
				</div>
			</div>
		</div>
	);
}
