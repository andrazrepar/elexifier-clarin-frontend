export const getToken = () => {
	const tokenString = sessionStorage.getItem("token") as string;
	const userToken = JSON.parse(tokenString);
	return userToken;
};

export const setToken = (token: string) => {
	sessionStorage.setItem("token", JSON.stringify(token));
};

export const removeToken = () => {
	sessionStorage.removeItem("token");
};
