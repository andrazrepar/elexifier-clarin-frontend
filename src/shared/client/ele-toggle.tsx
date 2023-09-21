import { Switch } from "@headlessui/react";
import { useState } from "react";

function classNames(...classes: (string | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}

interface EleToggleProps {
	enabled: boolean;
	setEnabled: (value: boolean) => void;
}

export default function EleToggle({
	enabled: initialEnabled,
	setEnabled,
}: EleToggleProps): JSX.Element {
	const [enabled, setLocalEnabled] = useState(initialEnabled);

	const handleSwitchChange = (newValue: boolean) => {
		if (
			newValue ||
			window.confirm(
				"If you go back to simple, you may lose some settings. Continue?"
			)
		) {
			setEnabled(newValue);
			setLocalEnabled(newValue);
		}
	};
	return (
		<Switch.Group>
			<div className="flex items-center">
				<Switch.Label className="mr-4">Advanced</Switch.Label>
				<Switch
					checked={enabled}
					onChange={handleSwitchChange}
					className={classNames(
						enabled ? "bg-indigo-600" : "bg-gray-200",
						"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
					)}
				>
					<span className="sr-only">Use setting</span>
					<span
						aria-hidden="true"
						className={classNames(
							enabled ? "translate-x-5" : "translate-x-0",
							"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
						)}
					/>
				</Switch>
			</div>
		</Switch.Group>
	);
}
