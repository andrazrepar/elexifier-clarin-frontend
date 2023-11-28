import { EleCollapsibleElement } from "./ele-collapsible";
import { useState } from "react";
import eleApiService from "../ele-api-service";
import { EleButton } from "./ele-button";
import { EleInputField } from "./ele-input-field";
import { EleCheckbox } from "./ele-checkbox";

const controlled_values = ["substantief", "adjectief", "werkwoord", "bijwoord"];

export const EleControlledValues: React.FC<any> = ({
	id,
	handleExpand,
	label,
	isSubElementExpanded,
	className = "text-xl font-semibold text-indigo-600 mb-3", // default class
	controlledValues,
	setControlledValues,
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

		if ((e.target as HTMLInputElement).type !== "checkbox") {
			// Toggle only the clicked child, do not collapse other children.
			setIsChildExpanded((prevState) => ({
				...prevState,
				[id]: !prevState[id],
			}));
		}
	};

	console.log("EleControlledValues", controlledValues);

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log("handleCheckboxChange", id);
	};

	return (
		<EleCollapsibleElement
			id={id}
			isExpanded={!!isSubElementExpanded[id]}
			handleExpand={handleExpand}
			label={label}
			className={className}
			reloadIcon={true}
			formRef={props.formRef}
			taskInfo={props.taskInfo}
		>
			<EleCollapsibleElement
				id={`${id}-definitionTypeTag`}
				isExpanded={isParentExpanded[`${id}-definitionTypeTag`]} // use specific id for parent
				handleExpand={toggleParentElement}
				label="definitionTypeTags"
			>
				<div className="flex flex-col">
					{controlledValues.definitionTypeTags.map(
						(item: { tag: string; description?: string }, index: number) => (
							<EleCollapsibleElement
								key={index}
								id={`${id}-definitionTypeTags-${index}`}
								isExpanded={
									isChildExpanded[`${id}-definitionTypeTags-${index}`]
								} // use specific id for child
								handleExpand={toggleChildElement}
								label={item.tag}
								className={props.className}
							>
								<div className="flex flex-col">
									<EleInputField
										label="Description"
										name={`${id}-definitionTypeTags-${index}-description`}
										className="text-sm font-medium text-indigo-600"
										existingValue={
											props.flatTransformation[`${id}-${index}-inSelector`]
										}
									/>

									<EleInputField
										label="SameAs"
										name={`${id}-definitionTypeTags-${index}-sameAs`}
										className="text-sm font-medium text-indigo-600"
										existingValue={
											props.flatTransformation[`${id}-${index}-namespaces`]
										}
									/>
									<input
										type="hidden"
										name={`${id}-definitionTypeTags-${index}-tag`}
										value={item.tag}
									/>
								</div>
							</EleCollapsibleElement>
						)
					)}
				</div>
			</EleCollapsibleElement>
			<EleCollapsibleElement
				id={`${id}-inflectedFormTag`}
				isExpanded={isParentExpanded[`${id}-inflectedFormTag`]} // use specific id for parent
				handleExpand={toggleParentElement}
				label="inflectedFormTags"
			>
				<div className="flex flex-col">
					{controlledValues.inflectedFormTags.map(
						(item: { tag: string; description?: string }, index: number) => (
							<EleCollapsibleElement
								key={index}
								id={`${id}-inflectedFormTags-${index}`}
								isExpanded={isChildExpanded[`${id}-inflectedFormTags-${index}`]} // use specific id for child
								handleExpand={toggleChildElement}
								label={item.tag}
								className={props.className}
							>
								{" "}
								<div className="flex flex-col">
									<EleCheckbox
										id={`${id}-inflectedFormTags-${index}-forHeadwords`}
										label="forHeadwords"
										isChecked={
											!!controlledValues.inflectedFormTags[index].forHeadwords
										}
										onChange={props.handleCheckboxChange}
									/>

									<EleCheckbox
										id={`${id}-inflectedFormTags-${index}-forTranslations`}
										label="forTranslations"
										isChecked={
											!!controlledValues.inflectedFormTags[index].forHeadwords
										}
										onChange={props.handleCheckboxChange}
									/>
									<div className="flex items-center">
										<label className="text-sm text-gray-600 mr-2">
											forLanguage:
										</label>
										<EleCheckbox
											id={`${id}-inflectedFormTags-${index}-forLanguage-headwordTranslation`}
											label="headwordTranslation"
											isChecked={false}
											onChange={props.handleCheckboxChange}
											className="text-sm font-medium text-indigo-600 ml-4"
										/>
									</div>

									<div className="flex items-center">
										<label className="text-sm text-gray-600 mr-2">
											forPartOfSpeech:
										</label>
										<EleCheckbox
											id={`${id}-inflectedFormTags-${index}-forPartOfSpeech-entry`}
											label="entry"
											isChecked={false}
											onChange={props.handleCheckboxChange}
											className="text-sm font-medium text-indigo-600 ml-4"
										/>
										<EleCheckbox
											id={`${id}-inflectedFormTags-${index}-forPartOfSpeech-headwordTranslation`}
											label="headwordTranslation"
											isChecked={false}
											onChange={props.handleCheckboxChange}
											className="text-sm font-medium text-indigo-600 ml-4"
										/>
									</div>

									<EleInputField
										label="Description"
										name={`${id}-inflectedFormTags-${index}-description`}
										className="text-sm font-medium text-indigo-600"
										existingValue={
											controlledValues.inflectedFormTags[index].description
										}
									/>

									<EleInputField
										label="SameAs"
										name={`${id}-inflectedFormTags-${index}-sameAs`}
										className="text-sm font-medium text-indigo-600"
										existingValue={
											controlledValues.inflectedFormTags[index].sameAs
										}
									/>
									<input
										type="hidden"
										name={`${id}-inflectedFormTags-${index}-tag`}
										value={item.tag}
									/>
								</div>
							</EleCollapsibleElement>
						)
					)}
				</div>
			</EleCollapsibleElement>
			<EleCollapsibleElement
				id={`${id}-labelTag`}
				isExpanded={isParentExpanded[`${id}-labelTag`]} // use specific id for parent
				handleExpand={toggleParentElement}
				label="labelTags"
			>
				<div className="flex flex-col">
					{controlledValues.labelTags.map(
						(item: { tag: string; description?: string }, index: number) => (
							<EleCollapsibleElement
								key={index}
								id={`${id}-labelTags-${index}`}
								isExpanded={isChildExpanded[`${id}-labelTags-${index}`]} // use specific id for child
								handleExpand={toggleChildElement}
								label={item.tag}
								className={props.className}
							>
								<div className="flex flex-col">
									<EleCheckbox
										id={`${id}-labelTags-${index}-forHeadwords`}
										label="forHeadwords"
										isChecked={!!controlledValues.labelTags[index].forHeadwords}
										onChange={handleCheckboxChange}
									/>

									<EleCheckbox
										id={`${id}-labelTags-${index}-forTranslations`}
										label="forTranslations"
										isChecked={
											!!controlledValues.labelTags[index].forTranslations
										}
										onChange={props.handleCheckboxChange}
									/>
									<EleCheckbox
										id={`${id}-labelTags-${index}-forCollocates`}
										label="forCollocates"
										isChecked={
											!!controlledValues.labelTags[index].forCollocates
										}
										onChange={props.handleCheckboxChange}
									/>
									<div className="flex items-center">
										<label className="text-sm text-gray-600 mr-2">
											forLanguage:
										</label>
										<EleCheckbox
											id={`${id}-labelTags-${index}-forLanguage-headwordTranslation`}
											label="headwordTranslation"
											isChecked={false}
											onChange={props.handleCheckboxChange}
											className="text-sm font-medium text-indigo-600 ml-4"
										/>
									</div>

									<div className="flex items-center">
										<label className="text-sm text-gray-600 mr-2">
											forPartOfSpeech:
										</label>
										<EleCheckbox
											id={`${id}-labelTags-${index}-forPartOfSpeech-entry`}
											label="entry"
											isChecked={false}
											onChange={props.handleCheckboxChange}
											className="text-sm font-medium text-indigo-600 ml-4"
										/>
										<EleCheckbox
											id={`${id}-labelTags-${index}-forPartOfSpeech-headwordTranslation`}
											label="headwordTranslation"
											isChecked={false}
											onChange={props.handleCheckboxChange}
											className="text-sm font-medium text-indigo-600 ml-4"
										/>
									</div>
								</div>

								<EleInputField
									label="Description"
									name={`${id}-labelTags-${index}-description`}
									className="text-sm font-medium text-indigo-600"
									existingValue={controlledValues.labelTags[index].description}
								/>

								<EleInputField
									label="SameAs"
									name={`${id}-labelTags-${index}-sameAs`}
									className="text-sm font-medium text-indigo-600"
									existingValue={controlledValues.labelTags[index].sameAs}
								/>
								<input
									type="hidden"
									name={`${id}-labelTags-${index}-tag`}
									value={item.tag}
								/>
							</EleCollapsibleElement>
						)
					)}
				</div>
			</EleCollapsibleElement>
			<EleCollapsibleElement
				id={`${id}-labelTypeTag`}
				isExpanded={isParentExpanded[`${id}-labelTypeTag`]} // use specific id for parent
				handleExpand={toggleParentElement}
				label="labelTypeTags"
			>
				<div className="flex flex-col">
					{controlled_values.map((tag: string, index: number) => (
						<EleCollapsibleElement
							key={index}
							id={`${id}-labelTypeTags-${index}`}
							isExpanded={isChildExpanded[`${id}-labelTypeTags-${index}`]} // use specific id for child
							handleExpand={toggleChildElement}
							label={tag}
							className={props.className}
						>
							<EleInputField
								label="Description"
								name={`${id}-labelTypeTags-${index}-description`}
								className="text-sm font-medium text-indigo-600"
								existingValue={
									controlledValues.labelTypeTags[index].description
								}
							/>

							<EleInputField
								label="SameAs"
								name={`${id}-labelTypeTags-${index}-sameAs`}
								className="text-sm font-medium text-indigo-600"
								existingValue={controlledValues.labelTypeTags[index].sameAs}
							/>
							<input
								type="hidden"
								name={`${id}-labelTypeTags-${index}-tag`}
								value={tag}
							/>
						</EleCollapsibleElement>
					))}
				</div>
			</EleCollapsibleElement>
			<EleCollapsibleElement
				id={`${id}-partOfSpeechTag`}
				isExpanded={isParentExpanded[`${id}-partOfSpeechTag`]} // use specific id for parent
				handleExpand={toggleParentElement}
				label="partOfSpeechTags"
			>
				<div className="flex flex-col">
					{controlledValues.partOfSpeechTags.map(
						(item: { tag: string; description?: string }, index: number) => (
							<EleCollapsibleElement
								key={index}
								id={`${id}-partOfSpeechTags-${index}`}
								isExpanded={isChildExpanded[`${id}-partOfSpeechTags-${index}`]} // use specific id for child
								handleExpand={toggleChildElement}
								label={item.tag}
								className={props.className}
							>
								<div className="flex flex-col">
									<EleCheckbox
										id={`${id}-partOfSpeechTags-${index}-forHeadwords`}
										label="forHeadwords"
										isChecked={
											!!controlledValues.partOfSpeechTags[index].forHeadwords
										}
										onChange={props.handleCheckboxChange}
									/>

									<EleCheckbox
										id={`${id}-partOfSpeechTags-${index}-forTranslations`}
										label="forTranslations"
										isChecked={
											!!controlledValues.partOfSpeechTags[index].forTranslations
										}
										onChange={props.handleCheckboxChange}
									/>
									<EleCheckbox
										partOfSpeechTag
										label="forEtymology"
										isChecked={
											!!controlledValues.partOfSpeechTags[index].forEtymology
										}
										onChange={props.handleCheckboxChange}
									/>
									<div className="flex items-center">
										<label className="text-sm text-gray-600 mr-2">
											forLanguage:
										</label>
										<EleCheckbox
											id={`${id}-partOfSpeechTags-${index}-forLanguage-headwordTranslation`}
											label="headwordTranslation"
											isChecked={false}
											onChange={props.handleCheckboxChange}
											className="text-sm font-medium text-indigo-600 ml-4"
										/>

										<EleCheckbox
											id={`${id}-partOfSpeechTags-${index}-forLanguage-etymon`}
											label="etymon"
											isChecked={false}
											onChange={props.handleCheckboxChange}
											className="text-sm font-medium text-indigo-600 ml-4"
										/>
									</div>

									<EleInputField
										label="Description"
										name={`${id}-partOfSpeechTags-${index}-description`}
										className="text-sm font-medium text-indigo-600"
										existingValue={
											controlledValues.partOfSpeechTags[index].description
										}
									/>

									<EleInputField
										label="SameAs"
										name={`${id}-partOfSpeechTags-${index}-sameAs`}
										className="text-sm font-medium text-indigo-600"
										existingValue={
											controlledValues.partOfSpeechTags[index].sameAs
										}
									/>
									<input
										type="hidden"
										name={`${id}-partOfSpeechTags-${index}-tag`}
										value={item.tag}
									/>
								</div>
							</EleCollapsibleElement>
						)
					)}
				</div>
			</EleCollapsibleElement>
			<EleCollapsibleElement
				id={`${id}-sourceIdentityTag`}
				isExpanded={isParentExpanded[`${id}-sourceIdentityTag`]} // use specific id for parent
				handleExpand={toggleParentElement}
				label="sourceIdentityTags"
			>
				<div className="flex flex-col">
					{controlledValues.sourceIdentityTags.map(
						(item: { tag: string; description?: string }, index: number) => (
							<EleCollapsibleElement
								key={index}
								id={`${id}-sourceIdentityTags-${index}`}
								isExpanded={
									isChildExpanded[`${id}-sourceIdentityTags-${index}`]
								} // use specific id for child
								handleExpand={toggleChildElement}
								label={item.tag}
								className={props.className}
							>
								<EleInputField
									label="Description"
									name={`${id}-sourceIdentityTags-${index}-description`}
									className="text-sm font-medium text-indigo-600"
									existingValue={
										controlledValues.sourceIdentityTags[index].description
									}
								/>

								<EleInputField
									label="SameAs"
									name={`${id}-sourceIdentityTags-${index}-sameAs`}
									className="text-sm font-medium text-indigo-600"
									existingValue={
										controlledValues.sourceIdentityTags[index].sameAs
									}
								/>

								<input
									type="hidden"
									name={`${id}-sourceIdentityTags-${index}-tag`}
									value={item.tag}
								/>
							</EleCollapsibleElement>
						)
					)}
				</div>
			</EleCollapsibleElement>
			<EleCollapsibleElement
				id={`${id}-transcriptionSchemeTag`}
				isExpanded={isParentExpanded[`${id}-transcriptionSchemeTag`]} // use specific id for parent
				handleExpand={toggleParentElement}
				label="transcriptionSchemeTags"
			>
				<div className="flex flex-col">
					{controlledValues.transcriptionSchemeTags.map(
						(item: { tag: string; description?: string }, index: number) => (
							<EleCollapsibleElement
								key={index}
								id={`${id}-transcriptionSchemeTags-${index}`}
								isExpanded={
									isChildExpanded[`${id}-transcriptionSchemeTags-${index}`]
								} // use specific id for child
								handleExpand={toggleChildElement}
								label={item.tag}
								className={props.className}
							>
								{" "}
								<div className="flex flex-col">
									<EleCheckbox
										id={`${id}-transcriptionSchemeTags-${index}-forHeadwords`}
										label="forHeadwords"
										isChecked={
											!!controlledValues.transcriptionSchemeTags[index]
												.forHeadwords
										}
										onChange={props.handleCheckboxChange}
									/>

									<EleCheckbox
										id={`${id}-transcriptionSchemeTags-${index}-forTranslations`}
										label="forTranslations"
										isChecked={
											!!controlledValues.transcriptionSchemeTags[index]
												.forHeadwords
										}
										onChange={props.handleCheckboxChange}
									/>

									<div className="flex items-center">
										<label className="text-sm text-gray-600 mr-2">
											forLanguage:
										</label>
										<EleCheckbox
											id={`${id}-transcriptionSchemeTags-${index}-forLanguage-headwordTranslation`}
											label="headwordTranslation"
											isChecked={false}
											onChange={props.handleCheckboxChange}
											className="text-sm font-medium text-indigo-600 ml-4"
										/>
									</div>

									<EleInputField
										label="Description"
										name={`${id}-transcriptionSchemeTags-${index}-description`}
										className="text-sm font-medium text-indigo-600"
										existingValue={
											controlledValues.transcriptionSchemeTags[index]
												.description
										}
									/>

									<EleInputField
										label="SameAs"
										name={`${id}-transcriptionSchemeTags-${index}-sameAs`}
										className="text-sm font-medium text-indigo-600"
										existingValue={
											controlledValues.transcriptionSchemeTags[index].sameAs
										}
									/>
									<input
										type="hidden"
										name={`${id}-transcriptionSchemeTags-${index}-tag`}
										value={item.tag}
									/>
								</div>
							</EleCollapsibleElement>
						)
					)}
				</div>
			</EleCollapsibleElement>
		</EleCollapsibleElement>
	);
};
