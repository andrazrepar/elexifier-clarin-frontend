import { EleCollapsibleElement } from "../elements/ele-collapsible";
import { EleInputField } from "../elements/ele-input-field";
import { EleDropdownField } from "../elements/ele-dropdown-field";
import { attributeDefaultValues } from "../dmlex-spec";
import JsonResult from "../elements/ele-json-result";
import React, { useState } from "react";
import { EleSearchableDropdownField } from "../elements/ele-searchable-dropdown-field";

export const EleTransformationPronounciationElement: React.FC<any> = ({
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
				<EleInputField
					label="Sound File"
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
