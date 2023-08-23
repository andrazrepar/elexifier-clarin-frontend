import { EleCollapsibleElement } from "../ele-collapsible";
import { EleInputField } from "../ele-input-field";
import { EleDropdownField } from "../ele-dropdown-field";
import { attributeDefaultValues } from "../../dmlex-spec";
import JsonResult from "../ele-json-result";
import React, { useState } from "react";

export const EleTransformationPronounciationElement: React.FC<any> = ({
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
			{/*{id === "entry-pronounciation" && (
				<JsonResult result={props.entry?.pronounciation} />
			)}{" "}*/}
			{/* only show top level pronounciation (for entry) */}
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
					label="Sound File"
					name={`${id}-soundFile`}
					className="text-sm font-medium text-indigo-600"
					existingValue={
						props.existingValues?.textVals?.find(
							(el: any) => el.outElement === "soundFile"
						)?.constant
					}
				/>
			</EleCollapsibleElement>
			{props.children}
		</EleCollapsibleElement>
	);
};
