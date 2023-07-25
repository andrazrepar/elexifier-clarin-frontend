import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface EleCollapsibleElementProps {
	id: string;
	isExpanded: boolean;
	handleExpand: (e: React.MouseEvent, id: string) => void;
	label: string;
	children: React.ReactNode;
	className?: string;
}

export const EleCollapsibleElement: React.FC<EleCollapsibleElementProps> = ({
	id,
	isExpanded,
	handleExpand,
	label,
	children,
	className = "text-sm font-medium text-indigo-600", // default class
}) => (
	<div
		className={`cursor-pointer pb-2 flex flex-col justify-start items-start ${className}`}
		onClick={(e) => handleExpand(e, id)}
	>
		<div className={`flex items-center`}>
			<div>{label}</div>
			{isExpanded ? (
				<ChevronDownIcon className="h-5 w-5 text-gray-600 ml-2" />
			) : (
				<ChevronDownIcon className="h-5 w-5 text-gray-600 transform rotate-180 ml-2" />
			)}
		</div>
		<div className={`pl-4 mt-2 mb-2 ${isExpanded ? "block" : "hidden"}`}>
			{children}
		</div>
	</div>
);
