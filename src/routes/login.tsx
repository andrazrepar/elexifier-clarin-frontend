import { EleInputField } from "../shared/client/ele-input-field";
import { EleButton } from "../shared/client/ele-button";
import {
	Form,
	Link,
	redirect,
	useFetcher,
	useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { z, ZodError } from "zod";
import { setToken } from "../shared/auth";
import eleApiService from "../shared/ele-api-service";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export async function action({ request }) {
	const formData = await request.formData();
	const token = formData.get("token");
	const userEmail = formData.get("userEmail");

	console.log(token, userEmail);

	setToken(token);

	return redirect("/app/organisation");
}

export function Login() {
	const fetcher = useFetcher();
	const [errors, setErrors] = useState(null);
	const navigate = useNavigate();

	const onLoginFormSubmit = async (e) => {
		e.preventDefault();

		try {
			const { email, password } = e.target.elements;

			const parsedValues = loginSchema.parse({
				email: email?.value,
				password: password?.value,
			});

			const loginResult = await eleApiService.login({
				email: parsedValues.email,
				password: parsedValues.password,
			});

			const resolvedLoginResult = await loginResult.json();

			if (loginResult.status === 401) {
				return setErrors({
					email: ["Wrong email or password"],
					password: ["Wrong email or password"],
				});
			}

			const formData = new FormData();

			formData.append("token", resolvedLoginResult.token);
			formData.append("userEmail", parsedValues.email!);
			formData.append("intent", "onSuccessfulLogin");
			fetcher.submit(formData, { method: "post", action: "/login" });

			setErrors(null);
		} catch (error) {
			if (error instanceof ZodError) {
				const _errors = error.flatten().fieldErrors;
				setErrors(_errors);
			} else {
				setErrors({ generic: "Something went wrong" });
			}
		}
	};

	return (
		<div className="flex min-h-full flex-col justify-center lg:px-8">
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-xl font-semibold text-gray-900">Login</h1>
						<p className="mt-2 text-sm text-gray-700">
							Log in to your account...
						</p>
					</div>
				</div>

				<div className="overflow-hidden bg-white shadow sm:rounded-md mt-4 p-4">
					<Form onSubmit={onLoginFormSubmit}>
						<EleInputField
							id="email"
							name="email"
							label="Email:*"
							type="email"
							className="mb-4"
							errors={errors?.email}
						/>
						<EleInputField
							id="password"
							name="password"
							label="Password:*"
							type="password"
							className="mb-4"
							errors={errors?.password}
						/>
						<EleButton type="submit" label="Login" value="login-form" />
					</Form>
				</div>

				<div className="mt-4 text-center">
					<p className="text-sm text-gray-700">
						Don't have an account yet?{" "}
						<Link to="/register" className="text-sky-500 hover:text-sky-700">
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
