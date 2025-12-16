import * as showdown from 'showdown';

interface MarkdownProps {
	text: string;
	className?: string;
	useSpan?: boolean;
};

const showdownConverter = new showdown.Converter();

export const Markdown = (props: MarkdownProps) => {
	if (!props.text) {
		return null;
	}

	return (
		<div>
			{
				props.useSpan ?
					<span className={props.className} dangerouslySetInnerHTML={{ __html: showdownConverter.makeHtml(props.text.trim()) }} />
					:
					<div className={props.className} dangerouslySetInnerHTML={{ __html: showdownConverter.makeHtml(props.text.trim()) }} />
			}
		</div>
	);
};