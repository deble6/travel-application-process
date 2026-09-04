import LoginPage from './LoginPage';
import type { SessionUser } from './types';

type LoginForm = {
	message?: string;
	username?: string;
	role?: string;
};

type Props = {
	user?: SessionUser | null;
	form?: LoginForm | null;
};

export default function App({ form }: Props) {
	return <LoginPage form={form} />;
}
