import { EleCollapsibleElement } from "./ele-collapsible";
import { useState, useEffect } from "react";
import { EleTMD } from "../transformation/ele-tmd";

import { EleLabel } from "../transformation/ele-label";
import { ElePartOfSpeech } from "../transformation/ele-partofspeech";
import { ElePronunciation } from "../transformation/ele-pronunciation";
import { EleInflectedForm } from "../transformation/ele-inflectedform";
import { EleSense } from "../transformation/ele-sense";

import {
	findEMDs,
	countExistingEMDs,
} from "../transformation/transformation-methods";

export const TMDClassName = "text-sm font-normal text-indigo-600";
export const EMDClassName = "text-sm font-semibold text-indigo-600";

export const EleTransformationParameters: React.FC<any> = ({
	id,
	handleExpand,
	label,
	isSubElementExpanded,
	className = "text-xl font-semibold text-indigo-600 mb-3", // default class
	...props
}) => {
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
		setIsChildExpanded((prevState) => ({
			...prevState,
			[id]: !prevState[id],
		}));
	};

	const [entryLabelCount, setEntryLabelCount] = useState(
		countExistingEMDs(props.flatTransformation, ["entry0-label"])
	);

	const [partOfSpeechCount, setPartOfSpeechCount] = useState(
		countExistingEMDs(props.flatTransformation, ["entry0-partOfSpeech"])
	);

	const [entryPronunciationCount, setEntryPronunciationCount] = useState(
		countExistingEMDs(props.flatTransformation, ["entry0-pronunciation"])
	);

	const [entryInflectedFormCount, setEntryInflectedFormCount] = useState(
		countExistingEMDs(props.flatTransformation, ["entry0-inflectedForm"])
	);

	const [senseCount, setSenseCount] = useState(
		countExistingEMDs(props.flatTransformation, ["entry0-sense"])
	);

	console.log("FLAT TRANSFORMATION", props.flatTransformation);

	return (
		<EleCollapsibleElement
			id={id}
			isExpanded={!!isSubElementExpanded[id]}
			handleExpand={handleExpand}
			label={label}
			className={className}
		>
			<EleTMD
				id={`entry0-headword`}
				outElement="headword"
				className={TMDClassName}
				isExpanded={isParentExpanded}
				handleExpand={toggleParentElement}
				flatTransformation={props.flatTransformation}
			/>
			<EleTMD
				id={`entry0-homographNumber`}
				outElement="homographNumber"
				className={TMDClassName}
				isExpanded={isParentExpanded}
				handleExpand={toggleParentElement}
				flatTransformation={props.flatTransformation}
			/>
			<EleLabel
				id={`entry0`}
				outElement="label"
				className={EMDClassName}
				isExpanded={isParentExpanded}
				handleExpand={toggleParentElement}
				flatTransformation={props.flatTransformation}
				count={entryLabelCount}
				setCount={setEntryLabelCount}
			/>
			<ElePartOfSpeech
				id={`entry0`}
				outElement="partOfSpeech"
				className={EMDClassName}
				isExpanded={isParentExpanded}
				handleExpand={toggleParentElement}
				flatTransformation={props.flatTransformation}
				count={partOfSpeechCount}
				setCount={setPartOfSpeechCount}
			/>

			<ElePronunciation
				id={`entry0`}
				outElement="pronunciation"
				className={EMDClassName}
				isExpanded={isParentExpanded}
				handleExpand={toggleParentElement}
				flatTransformation={props.flatTransformation}
				count={entryPronunciationCount}
				setCount={setEntryPronunciationCount}
			/>
			<EleInflectedForm
				id={`entry0`}
				outElement="inflectedForm"
				className={EMDClassName}
				isExpanded={isParentExpanded}
				handleExpand={toggleParentElement}
				flatTransformation={props.flatTransformation}
				count={entryInflectedFormCount}
				setCount={setEntryInflectedFormCount}
			/>

			<EleSense
				id={`entry0`}
				outElement="sense"
				className={EMDClassName}
				isExpanded={isParentExpanded}
				handleExpand={toggleParentElement}
				flatTransformation={props.flatTransformation}
				count={senseCount}
				setCount={setSenseCount}
			/>
		</EleCollapsibleElement>
	);
};
