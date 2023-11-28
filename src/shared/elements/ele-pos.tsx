import { EleCollapsibleElement } from "./ele-collapsible";
import { EleDropdownField } from "./ele-dropdown-field";

const UD_TAGS = [
	{ label: "ADJ", value: "ADJ" },
	{ label: "ADV", value: "ADV" },
	{ label: "INTJ", value: "INTJ" },
	{ label: "NOUN", value: "NOUN" },
	{ label: "PROPN", value: "PROPN" },
	{ label: "VERB", value: "VERB" },
	{ label: "ADP", value: "ADP" },
	{ label: "AUX", value: "AUX" },
	{ label: "CCONJ", value: "CCONJ" },
	{ label: "DET", value: "DET" },
	{ label: "NUM", value: "NUM" },
	{ label: "PART", value: "PART" },
	{ label: "PRON", value: "PRON" },
	{ label: "SCONJ", value: "SCONJ" },
	{ label: "PUNCT", value: "PUNCT" },
	{ label: "SYM", value: "SYM" },
	{ label: "X", value: "X" },
];

const custom_tags = ["substantief", "adjectief", "werkwoord", "bijwoord"];

export const ElePosMapping: React.FC<any> = ({
	id,
	handleExpand,
	label,
	isSubElementExpanded,
	className = "text-xl font-semibold text-indigo-600 mb-3", // default class
	xlat,
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
			{Object.entries(xlat).map(([key, value], index) => {
				const defaultValue = UD_TAGS.find(
					(tag) => tag.value === value.toUpperCase()
				) || {
					label: "",
					value: "",
				};

				return (
					<EleDropdownField
						key={index}
						name={`ud-mapping-${key}`}
						label={key}
						defaultValue={defaultValue.label}
						options={[{ label: "", value: "" }, ...UD_TAGS]}
					/>
				);
			})}
		</EleCollapsibleElement>
	);
};
