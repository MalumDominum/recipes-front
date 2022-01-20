import React from "react";
import "~/index.css";
import "./Title.css";

const Title = (props) => {
	return (
		<div className="title-container">
			<div className="img waves-background"></div>
			<h1
				id="main-title"
				className={props.children ? (props.children.length > 12 ? "small" : null) : null}
				data-text={props.children}
			>
				{props.children}
			</h1>
		</div>
	);
};

export default Title;
