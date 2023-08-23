import { EleCollapsibleElement } from "../ele-collapsible";
import { EleInputField } from "../ele-input-field";
import { EleDropdownField } from "../ele-dropdown-field";
import { attributeDefaultValues } from "../../dmlex-spec";
import JsonResult from "../ele-json-result";
import React, { useState } from "react";

export const EleTransformationSenseElement: React.FC<any> = ({
	id,
	handleExpand,
	label,
	isSubElementExpanded,
	className = "text-sm font-medium text-indigo-600", // default class
	...props
}) => {
	const [isAdvancedVisible, setAdvancedVisible] = useState(false);
	return (
		<EleCollapsibleElement
			id={id}
			isExpanded={!!isSubElementExpanded[id]}
			handleExpand={handleExpand}
			label={label}
			className={className}
		>
			{/*<JsonResult result={props.entry?.senses} />*/}
			<EleInputField
				label="Path"
				name={`${id}-inSelector`}
				className="text-sm font-medium text-indigo-600"
				existingValue={props.existingValues?.inSelector}
			/>

			<EleCollapsibleElement
				id={`${id}-advanced`}
				isExpanded={isAdvancedVisible}
				className="mb-4"
				handleExpand={(event) => {
					event.stopPropagation();
					setAdvancedVisible(!isAdvancedVisible);
				}}
				label="Advanced"
			>
				<EleInputField
					label="Indicator Path" // TODO come up with something better
					name={`${id}-indicator-inSelector`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "indicator"
						)?.inSelector
					}
				/>

				<EleDropdownField
					label="Attribute"
					name={`${id}-indicator-attribute`}
					className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
					options={attributeDefaultValues}
					defaultValue={
						attributeDefaultValues.find((item) => item.name === "innerText")
							?.value
					}
				/>

				<EleInputField
					label="Regex"
					name={`${id}-indicator-regex`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "indicator"
						)?.regex
					}
				/>

				<EleInputField
					label="RegexGroup"
					name={`${id}-indicator-regexGroup`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "indicator"
						)?.regexGroup
					}
				/>
			</EleCollapsibleElement>
			{props.children}
		</EleCollapsibleElement>
	);
};
