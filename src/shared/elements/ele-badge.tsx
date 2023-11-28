import { z } from "zod";
import React from "react";

const AiBadgeSchema = z.object({
	color: z.enum([
		"primary",
		"secondary",
		"gray",
		"red",
		"yellow",
		"green",
		"blue",
		"primary",
		"purple",
		"pink",
	]),
	text: z.string().or(React.ReactElement),
	className: z.string().optional(),
});

export const EleBadge = ({ text }: z.infer<typeof AiBadgeSchema>) => {
	return (
		<span
			className={`inline-flex items-center rounded-full bg-sky-100 px-3 py-0.5 text-sm font-medium text-sky-800 mx-4`}
		>
			{text}
		</span>
	);
};
