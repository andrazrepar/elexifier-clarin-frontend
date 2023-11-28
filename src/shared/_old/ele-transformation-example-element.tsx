import { EleCollapsibleElement } from "../elements/ele-collapsible";
import { EleInputField } from "../elements/ele-input-field";
import { EleDropdownField } from "../elements/ele-dropdown-field";
import { attributeDefaultValues } from "../dmlex-spec";
import React, { useState } from "react";
import { EleSearchableDropdownField } from "../elements/ele-searchable-dropdown-field";

export const EleTransformationExampleElement: React.FC<any> = ({
	id,
	handleExpand,
	label,
	isSubElementExpanded,
	className = "text-sm font-medium text-indigo-600", // default class
	...props
}) => {
	return (
		<EleCollapsibleElement
			id={id}
			isExpanded={!!isSubElementExpanded[id]}
			handleExpand={handleExpand}
			label={label}
			className={className}
		>
			<EleSearchableDropdownField
				label="Path"
				name={`${id}-inSelector-simple`}
				options={props.entryPaths}
				existingValue={props.existingValues?.inSelector}
				className={`flex items-center mt-2 mb-2 ${
					props.isAdvancedVisible ? "hidden" : ""
				}`}
			/>

			<div className={`${!props.isAdvancedVisible ? "hidden" : ""}`}>
				<EleInputField
					label="Path"
					name={`${id}-inSelector-advanced`}
					className="text-sm font-medium text-indigo-600"
					existingValue={props.existingValues?.inSelector}
				/>
				<EleDropdownField
					label="attribute"
					name={`${id}-attribute`}
					className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
					options={attributeDefaultValues}
					defaultValue={
						attributeDefaultValues.find((item) => item.label === "innerText")
							?.value
					}
				/>

				<EleInputField
					label="regex"
					name={`${id}-regex`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "text"
						)?.regex
					}
				/>

				<EleInputField
					label="regexGroup"
					name={`${id}-regexGroup`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "text"
						)?.regexGroup
					}
				/>

				<EleInputField
					label="inSelector (for sourceIdentity)" // TODO come up with something better
					name={`${id}-sourceIdentity-inSelector`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "sourceIdentity"
						)?.regex
					}
				/>

				<EleDropdownField
					label="attribute"
					name={`${id}-sourceIdentity-attribute`}
					className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
					options={attributeDefaultValues}
					defaultValue={
						attributeDefaultValues.find((item) => item.label === "innerText")
							?.value
					}
				/>

				<EleInputField
					label="regex"
					name={`${id}-sourceIdentity-regex`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "sourceIdentity"
						)?.regex
					}
				/>

				<EleInputField
					label="regexGroup"
					name={`${id}-sourceIdentity-regexGroup`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "sourceIdentity"
						)?.regexGroup
					}
				/>

				<EleInputField
					label="inSelector (for sourceElaboration)" // TODO come up with something better
					name={`${id}-sourceElaboration-inSelector`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "sourceElaboration"
						)?.regex
					}
				/>

				<EleDropdownField
					label="attribute"
					name={`${id}-sourceElaboration-attribute`}
					className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
					options={attributeDefaultValues}
					defaultValue={
						attributeDefaultValues.find((item) => item.label === "innerText")
							?.value
					}
				/>

				<EleInputField
					label="regex"
					name={`${id}-sourceElaboration-regex`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "sourceElaboration"
						)?.regex
					}
				/>

				<EleInputField
					label="regexGroup"
					name={`${id}-sourceElaboration-regexGroup`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "sourceElaboration"
						)?.regexGroup
					}
				/>

				<EleInputField
					label="soundFile"
					name={`${id}-soundFile`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "soundFile"
						)?.constant
					}
				/>
			</div>
			{props.children}
		</EleCollapsibleElement>
	);
};
