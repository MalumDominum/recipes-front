export default function ParagraphWithNewLines({ text, className }) {
	return (
		<div className={className + "-container"}>
			{text.split("\\n").map((str, index) => (
				<p className={className} key={index}>
					{str}
				</p>
			))}
		</div>
	);
}
