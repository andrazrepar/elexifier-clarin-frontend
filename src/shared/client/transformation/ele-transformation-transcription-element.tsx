import { EleCollapsibleElement } from "../ele-collapsible";
import { EleInputField } from "../ele-input-field";
import { EleDropdownField } from "../ele-dropdown-field";
import { attributeDefaultValues } from "../../dmlex-spec";
import React, { useState } from "react";
import { EleSearchableDropdownField } from "../ele-searchable-dropdown-field";

export const EleTransformationTranscriptionElement: React.FC<any> = ({
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
					label="Attribute"
					name={`${id}-attribute`}
					className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
					options={attributeDefaultValues}
					defaultValue={
						attributeDefaultValues.find((item) => item.label === "innerText")
							?.value
					}
				/>

				<EleInputField
					label="Regex"
					name={`${id}-regex`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "text"
						)?.regex
					}
				/>

				<EleInputField
					label="RegexGroup"
					name={`${id}-regexGroup`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "text"
						)?.regexGroup
					}
				/>

				<EleInputField
					label="Scheme"
					name={`${id}-scheme`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "scheme"
						)?.regexGroup
					}
				/>
			</div>
		</EleCollapsibleElement>
	);
};
