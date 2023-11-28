import { Switch } from "@headlessui/react";
import { useState, useEffect } from "react";

interface EleParamToggleProps {
	newStatus: boolean;
	setToggleStatus: (value: boolean) => void;
	elementId: string;
	handleExpand: (e: any, id: string) => void;
}

export const EleParamToggle: React.FC<EleParamToggleProps> = ({
	newStatus,
	setToggleStatus,
	elementId,
	handleExpand,
}) => {
	const [enabled, setEnabled] = useState(newStatus);

	useEffect(() => {
		setEnabled(newStatus);
	}, [newStatus]);

	const handleSwitchChange = (newValue: boolean) => {
		if (newValue) {
			setEnabled(newValue);
			setToggleStatus(newValue);
			handleExpand(undefined, elementId);
		}
	};

	return (
		<Switch.Group>
			<div className="flex items-center">
				<Switch
					checked={enabled}
					onChange={handleSwitchChange}
					className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
						enabled ? "bg-indigo-600" : "bg-gray-200"
					}`}
				>
					<span
						aria-hidden="true"
						className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
							enabled ? "translate-x-5" : "translate-x-0"
						}`}
					/>
				</Switch>
			</div>
		</Switch.Group>
	);
};
