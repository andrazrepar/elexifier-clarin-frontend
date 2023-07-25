import { ButtonHTMLAttributes, FC } from "react";
import { useActionData } from "react-router-dom";

interface EleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	value: string;
	type?: "button" | "submit" | "reset";
	className?: string;
}

export const EleButton: FC<EleButtonProps> = ({
	label,
	value,
	type = "button",
	className = "flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
	...props
}) => {
	const actionData = useActionData();

	return (
		<div>
			<button
				type={type}
				className={className}
				name="intent"
				value={value}
				onClick={props.onClick || undefined}
				disabled={props.disabled || false}
			>
				{label}
			</button>
		</div>
	);
};
