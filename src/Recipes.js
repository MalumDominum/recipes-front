import React from "react";
import "./Recipes.css";
import "./index.css";

const Heading = (props) => {
	return (
		<div className="heading-container">
			<div className="img waves-background"></div>
			<h1 id="main-heading" data-text={props.children}>
				{props.children}
			</h1>
		</div>
	);
};

const CheckboxFilterSection = (props) => {
	return (
		<div className="section-container">
			<button className="collapse-button container">
				<div>
					{props.heading}
					<span className="count">{props.count}</span>
				</div>
				<div className="img"></div>
			</button>
			<input type="search" placeholder="Поиск..." />
			<div className="filter-items">{props.children}</div>
		</div>
	);
};

const CheckboxItem = (props) => {
	return (
		<div className="item-container">
			<input type="checkbox" />
			<span>{props.content}</span>
			<span className="count">({props.count})</span>
		</div>
	);
};

const Recipes = () => {
	return (
		<>
			<Heading>Рецепты</Heading>
			<div className="page-content">
				<div className="filter-container">
					<div className="section-container">
						<button className="collapse-button container">
							Название блюда
							<div className="img"></div>
						</button>
						<input type="search" placeholder="Поиск..." />
					</div>
					<div className="section-container">
						<button className="collapse-button container">
							Время приготовления
							<div className="img"></div>
						</button>
						<div className="range-container">
							<input type="text" maxLength="3" />
							<span>—</span>
							<input type="text" maxLength="3" />
							<span>Минут</span>
						</div>
						<div className="slider-wrapper">
							<div className="slider">
								<div className="full-range">
									<div className="range-segment"></div>
								</div>
								<button className="slider-range left" />
								<button className="slider-range right" />
							</div>
						</div>
					</div>
					<CheckboxFilterSection heading="Категория" count="37">
						<CheckboxItem content="Основные блюда" count="112" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
						<CheckboxItem content="Выпечка и десерты" count="96" />
					</CheckboxFilterSection>
				</div>
			</div>
		</>
	);
};

export default Recipes;
