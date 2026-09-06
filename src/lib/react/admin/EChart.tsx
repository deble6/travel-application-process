import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

type Props = {
	option: EChartsOption;
	testId: string;
};

export default function EChart({ option, testId }: Props) {
	const nodeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const node = nodeRef.current;
		if (!node) return;

		const chart = echarts.init(node);
		chart.setOption(option);

		const onResize = () => chart.resize();
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
			chart.dispose();
		};
	}, [option]);

	return <div className="echart" data-testid={testId} ref={nodeRef} />;
}
