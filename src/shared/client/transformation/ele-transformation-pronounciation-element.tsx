import { EleCollapsibleElement } from "../ele-collapsible";
import { EleInputField } from "../ele-input-field";
import { EleDropdownField } from "../ele-dropdown-field";
import { attributeDefaultValues } from "../../dmlex-spec";
import JsonResult from "../ele-json-result";

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
			{id === "entry-pronounciation" && (
				<JsonResult result={props.entry?.pronounciation} />
			)}{" "}
			{/* only show top level pronounciation (for entry) */}
			<EleInputField
				label="inSelector"
				name={`${id}-inSelector`}
				className="text-sm font-medium text-indigo-600"
				existingValue={props.existingValues?.inSelector}
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
			{props.children}
		</EleCollapsibleElement>
	);
};
