import { useEffect, useState } from 'react';

export default function Toast({ text }: { text: string }) {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setVisible(false), 2500);
		return () => clearTimeout(timer);
	}, []);

	if (!visible) return null;

	return <div className="toast">{text}</div>;
}
