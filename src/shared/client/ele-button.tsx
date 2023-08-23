import React, { ButtonHTMLAttributes, ForwardRefRenderFunction } from "react";

interface EleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	value: string;
	type?: "button" | "submit" | "reset";
	className?: string;
}

export const EleButton = React.forwardRef<HTMLButtonElement, EleButtonProps>(
	(
		{
			label,
			value,
			type = "button",
			className = "flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
			...props
		},
		ref // This is the ref parameter, which is typed to HTMLButtonElement
	) => {
		return (
			<button
				ref={ref} // The ref is applied here
				type={type}
				className={className}
				name="intent"
				value={value}
				onClick={props.onClick || undefined}
				disabled={props.disabled || false}
			>
				{label}
			</button>
		);
	}
);
