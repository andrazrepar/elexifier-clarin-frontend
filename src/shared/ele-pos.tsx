import { EleCollapsibleElement } from "./client/ele-collapsible";
import { EleDropdownField } from "./client/ele-dropdown-field";

const UD_TAGS2 = {
	ADJ: "ADJ",
	ADV: "ADV",
	INTJ: "INTJ",
	NOUN: "NOUN",
	PROPN: "PROPN",
	VERB: "VERB",
	ADP: "ADP",
	AUX: "AUX",
	CCONJ: "CCONJ",
	DET: "DET",
	NUM: "NUM",
	PART: "PART",
	PRON: "PRON",
	SCONJ: "SCONJ",
	PUNCT: "PUNCT",
	SYM: "SYM",
	X: "X",
};

const UD_TAGS = [
	{ name: "ADJ", value: "ADJ" },
	{ name: "ADV", value: "ADV" },
	{ name: "INTJ", value: "INTJ" },
	{ name: "NOUN", value: "NOUN" },
	{ name: "PROPN", value: "PROPN" },
	{ name: "VERB", value: "VERB" },
	{ name: "ADP", value: "ADP" },
	{ name: "AUX", value: "AUX" },
	{ name: "CCONJ", value: "CCONJ" },
	{ name: "DET", value: "DET" },
	{ name: "NUM", value: "NUM" },
	{ name: "PART", value: "PART" },
	{ name: "PRON", value: "PRON" },
	{ name: "SCONJ", value: "SCONJ" },
	{ name: "PUNCT", value: "PUNCT" },
	{ name: "SYM", value: "SYM" },
	{ name: "X", value: "X" },
];

const custom_tags = ["substantief", "adjectief", "werkwoord", "bijwoord"];

export const ElePosMapping: React.FC<any> = ({
	id,
	handleExpand,
	label,
	isSubElementExpanded,
	className = "text-xl font-semibold text-indigo-600 mb-3", // default class
	...props
}) => {
	console.log("xlat1", props.xlat);
	return (
		<EleCollapsibleElement
			id={id}
			isExpanded={!!isSubElementExpanded[id]}
			handleExpand={handleExpand}
			label={label}
			className={className}
		>
			{custom_tags.map((tag, index) => (
				<EleDropdownField
					key={index}
					name={`ud-mapping-${tag}`}
					label={tag}
					options={[{ name: "", value: "" }, ...UD_TAGS]}
					defaultValue={
						props.xlat &&
						UD_TAGS.find(
							(option) =>
								option.value ===
								(props.xlat[tag] ? props.xlat[tag].toUpperCase() : "")
						)?.value
					}
				/>
			))}
		</EleCollapsibleElement>
	);
};
