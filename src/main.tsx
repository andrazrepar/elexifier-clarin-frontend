import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
	createBrowserRouter,
	RouterProvider,
	BrowserRouter,
} from "react-router-dom";

import { App, loader as appLoader } from "./routes/app";
import ErrorPage from "./routes/error-page";
import Index from "./routes/index";
import Dictionaries, {
	loader as dictionariesLoader,
	action as dictionariesAction,
} from "./routes/dictionaries";

import OrganisationSettings from "./routes/settings";
import OrganisationMembers from "./routes/members";
import {
	TransformDictionary,
	action as transformAction,
	loader as transformLoader,
} from "./routes/transform";
import { Login, action as loginAction } from "./routes/login";

import { action as logoutAction } from "./routes/logout";
import RegisterPage from "./routes/register";
import {
	Organisations,
	loader as organisationsLoader,
} from "./routes/organisations";
import { CreateOrganisation } from "./routes/create-organisation";

import { UserTasks, loader as tasksLoader } from "./routes/tasks";

import { ViewDictionary, loader as dictionaryLoader } from "./routes/view";

import { LinkDictionary, loader as linkingLoader } from "./routes/link";

import {
	DownloadDictionary,
	loader as downloadLoader,
} from "./routes/download";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Index />,
			},
			{
				path: "login",
				element: <Login />,
				errorElement: <ErrorPage />,
				action: loginAction,
			},
			{
				path: "register",
				element: <RegisterPage />,
				errorElement: <ErrorPage />,
			},
			{
				path: "logout",
				errorElement: <ErrorPage />,
				action: logoutAction,
			},
			{
				path: "/app",
				element: <App />,
				loader: appLoader,
				id: "app",
				children: [
					{
						path: "organisation/:organisationId/dictionaries",
						element: <Dictionaries />,
						errorElement: <ErrorPage />,
						loader: dictionariesLoader,
						action: dictionariesAction,
					},
					{
						path: "organisation/:organisationId/dictionaries/:dictionaryId/transform",
						element: <TransformDictionary />,
						errorElement: <ErrorPage />,
						loader: transformLoader,
						action: transformAction,
					},
					{
						path: "organisation/:organisationId/dictionaries/:dictionaryId/view",
						element: <ViewDictionary />,
						errorElement: <ErrorPage />,
						loader: dictionaryLoader,
					},
					{
						path: "organisation/:organisationId/dictionaries/:dictionaryId/link",
						element: <LinkDictionary />,
						errorElement: <ErrorPage />,
						loader: linkingLoader,
					},
					{
						path: "organisation/:organisationId/dictionaries/:dictionaryId/download",
						element: <DownloadDictionary />,
						errorElement: <ErrorPage />,
						loader: downloadLoader,
					},
					{
						path: "organisation/:organisationId/members",
						element: <OrganisationMembers />,
						errorElement: <ErrorPage />,
					},
					{
						path: "organisation/:organisationId/settings",
						element: <OrganisationSettings />,
						errorElement: <ErrorPage />,
					},
					{
						path: "organisation",
						element: <Organisations />,
						loader: organisationsLoader,
						id: "organisation",
						errorElement: <ErrorPage />,
					},
					{
						path: "organisation/create",
						element: <CreateOrganisation />,
						errorElement: <ErrorPage />,
					},
					{
						path: "tasks",
						element: <UserTasks />,
						loader: tasksLoader,
						errorElement: <ErrorPage />,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
