import { EleInputField } from "./ele-input-field";
import { EleDropdownField } from "./ele-dropdown-field";
import { attributeDefaultValues } from "../dmlex-spec";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

interface EleCollapsibleElementProps {
	isExpanded: boolean;
	handleExpand;
	label: string;
	className?: string;
}

const EleCollapsibleElement: React.FC<EleCollapsibleElementProps> = ({
	isExpanded,
	handleExpand,
	label,
	className = "text-sm font-medium text-indigo-600", // default class
}) => (
	<div
		className={`cursor-pointer pb-2 flex justify-start items-center ${className}`}
		onClick={() => handleExpand(!isExpanded)}
	>
		{isExpanded ? (
			<ChevronDownIcon className="h-5 w-5 text-gray-600 mr-2" />
		) : (
			<ChevronDownIcon className="h-5 w-5 text-gray-600 transform rotate-180 mr-2" />
		)}
		<div className="flex items-center">
			<div>{label}</div>
		</div>
	</div>
);

const advancedContent = (
	id,
	attribute,
	regex,
	regexGroup,
	xlat,
	markers,
	className
) => (
	<>
		{attribute && (
			<EleDropdownField
				label="attribute"
				name={`${id}-attribute`}
				className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				options={attributeDefaultValues}
				defaultValue={attributeDefaultValues.innerText}
			/>
		)}
		{regex && (
			<EleInputField label="regex" name={`${id}-regex`} className={className} />
		)}
		{regexGroup && (
			<EleInputField
				label="regexGroup"
				name={`${id}-regexGroup`}
				className={className}
			/>
		)}
		{xlat && (
			<EleInputField label="xlat" name={`${id}-xlat`} className={className} />
		)}
		{markers && (
			<EleInputField
				label="markers"
				name={`${id}-markers`}
				className={className}
			/>
		)}
	</>
);

export interface EleTextValElementProps {
	id: string;
	isSubElementExpanded: object;
	handleExpand: (id: string) => void;
	outElement: string;
	inSelector?: boolean;
	className?: string;
	attribute?: boolean;
	namespaces?: boolean;
	regex?: boolean;
	regexGroup?: boolean;
	xlat?: boolean;
	markers?: boolean;
}

export const EleTextValElement: React.FC<EleTextValElementProps> = ({
	id,
	isSubElementExpanded,
	handleExpand,
	inSelector = true,
	namespaces,
	attribute,
	regex,
	regexGroup,
	xlat,
	outElement,
	markers,
	className = "text-sm font-medium text-indigo-600", // default class
}) => {
	const isExpanded = isSubElementExpanded[id];
	const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);

	return (
		<div>
			{inSelector ? (
				<>
					<EleCollapsibleElement
						isExpanded={isExpanded}
						handleExpand={() => handleExpand(id)}
						label={outElement}
						className={className}
					/>
					<div className={`pl-4 mt-2 mb-2 ${isExpanded ? "block" : "hidden"}`}>
						<EleInputField
							label="inSelector"
							name={`${id}-inSelector`}
							className={className}
						/>

						{namespaces && (
							<EleInputField
								label="namespaces"
								name={`${id}-namespaces`}
								className={className}
							/>
						)}
						<EleCollapsibleElement
							isExpanded={isAdvancedExpanded}
							handleExpand={setIsAdvancedExpanded}
							label="Advanced"
							className="text-xs font-medium text-gray-800 bg-gray-100 p-1 rounded"
						/>
						<div
							className={`pl-4 mt-2 mb-2 ${
								isAdvancedExpanded ? "block" : "hidden"
							}`}
						>
							{advancedContent(
								id,
								attribute,
								regex,
								regexGroup,
								xlat,
								markers,
								className
							)}
						</div>
					</div>
				</>
			) : (
				<>
					<EleCollapsibleElement
						isExpanded={isAdvancedExpanded}
						handleExpand={setIsAdvancedExpanded}
						label="Advanced"
						className="text-xs font-medium text-gray-800 bg-gray-100 p-1 rounded"
					/>
					<div
						className={`pl-4 mt-2 mb-2 ${
							isAdvancedExpanded ? "block" : "hidden"
						}`}
					>
						{advancedContent(
							id,
							attribute,
							regex,
							regexGroup,
							xlat,
							markers,
							className
						)}
					</div>
				</>
			)}
		</div>
	);
};
