export default function ParagraphWithNewLines({ text, className }) {
	return (
		<div className={className + "-container"}>
			{text.split("\\n").map((str) => (
				<p className={className}>{str}</p>
			))}
		</div>
	);
}
