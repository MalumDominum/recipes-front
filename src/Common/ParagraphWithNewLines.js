export default function ParagraphWithNewLines({ text, className }) {
	return (
		<div className={className + "-container"}>
			{text.split("\\n").map((str, index) => (
				<p key={index}>{str}</p>
			))}
		</div>
	);
}
