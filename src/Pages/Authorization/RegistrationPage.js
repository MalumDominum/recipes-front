import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useValueSaver from "~/CustomHooks/useValueSaver";
import useToken from "~/CustomHooks/useToken";
import sendRequest from "~/Common/sendRequest";
import { UrlContext } from "~/App";
import Header from "~/Common/Header";
import Heading from "~/Common/Title";
import "~/index.css";
import "./Authorization.css";

const initialState = {
	email: "",
	firstName: "",
	lastName: "",
	password: "",
};

const RegistrationForm = () => {
	const navigate = useNavigate();
	const [fields, setValue] = useValueSaver(initialState);
	const [token, setToken] = useToken();
	const apiRequestUrl = useContext(UrlContext) + "users/register";

	useEffect(() => {
		if (token) navigate("/", { replace: true });
	}, [token]);

	const onSubmitHandle = async (event) => {
		event.preventDefault();

		await sendRequest(
			{
				email: fields.email,
				password: fields.password,
				firstName: fields.firstName,
				lastName: fields.lastName,
			},
			apiRequestUrl,
			"POST"
		)
			.then(setToken)
			.catch(console.error);
	};

	const passwordRegExp = "^(?=.*[a-z])(?=.*[A-Z])(?!=.*s).*$",
		passwordMinLength = 6,
		passwordMaxLenght = 32,
		passwordTitle = `Пожалуйста, введите хотя бы 1 символ верхнего регистра, 1 символ нижнего регистра и 1 цифру. 
						   Пароль также должен содержать от ${passwordMinLength} до ${passwordMaxLenght} символов
						   и не должен содержать пробелы`;
	return (
		<form className="form-container" onSubmit={onSubmitHandle}>
			<div className="container">
				<input value={fields.email} onChange={setValue} name="email" type="email" placeholder="Введите почту" required />
				<input
					value={fields.password}
					onChange={setValue}
					name="password"
					type="password"
					placeholder="Введите пароль"
					pattern={passwordRegExp}
					title={passwordTitle}
					minlength={passwordMinLength}
					maxlength={passwordMaxLenght}
				/>
			</div>
			<div className="container">
				<input
					value={fields.firstName}
					onChange={setValue}
					name="firstName"
					type="text"
					placeholder="Введите имя"
					minlength="2"
					maxlength="32"
					required
				/>
				<input
					value={fields.lastName}
					onChange={setValue}
					name="lastName"
					type="text"
					placeholder="Введите фамилию"
					minlength="2"
					maxlength="32"
					required
				/>
			</div>
			<button className="sign-up-button">Зарегистрироваться</button>
			<Link to="/sign-in" className="link">
				Уже имеете аккаунт?
			</Link>
		</form>
	);
};

const RegistrationPage = () => {
	return (
		<>
			<Header />
			<Heading>Регистрация</Heading>
			<RegistrationForm />
		</>
	);
};

export default RegistrationPage;
