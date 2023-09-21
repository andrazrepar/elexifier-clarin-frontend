import { ChevronRightIcon } from "@heroicons/react/20/solid";

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
			<ChevronRightIcon
				className={`h-5 w-5 text-gray-600 ml-2 ${
					isExpanded ? "rotate-90" : ""
				}`}
			/>
			<div>{label}</div>
		</div>
		<div
			className={`pl-8 pr-4 mt-2 mb-2 w-full ${
				isExpanded ? "block ml-4" : "hidden"
			}`}
		>
			{children}
		</div>
	</div>
);
