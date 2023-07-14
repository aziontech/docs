import { useEffect, useState } from 'preact/hooks';
import './ThemeToggleButton.css';

interface Props {
	labels: {
		useLight: string;
		useDark: string;
	};
	isInsideHeader?: boolean;
}

interface Icon {
  [key: string]: JSX.Element;
}

const icons: Icon = {
	light: 	
		<svg
			key="light"
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				fillRule="evenodd"
				d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
				clipRule="evenodd"
			/>
		</svg>,
	dark: 	
		<svg
			key="dark"
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
		</svg>
}

const ThemeToggle = ({ labels, isInsideHeader }: Props) => {
	const [theme, setTheme] = useState(() => {
		if (import.meta.env.SSR) {
			return undefined;
		}
		return document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
	});

  const [themeMode, setThemeMode] = useState({
		icon: icons['dark'],
		checked: 'dark',
		label: labels.useDark
	});

	useEffect(() => {
		const root = document.documentElement;
		if (theme === 'light') {
			setThemeMode({
				icon: icons['light'],
				checked: 'light',
				label: labels.useLight
			})
			root.classList.remove('theme-dark');
		} else {
			root.classList.add('theme-dark');
			setThemeMode({
				icon: icons['dark'],
				checked: 'dark',
				label: labels.useDark
			})
		}
	}, [theme]);

	return (
		<div className={`theme-toggle ${isInsideHeader ? 'hide-toggle-on-smaller-screens' : ''}`}>
					<label key={themeMode.label} title={`Switch between dark and light mode (currently ${themeMode.label})`} className={themeMode.checked ? 'checked' : ''}>
						{themeMode.icon}
						<input
							type="checkbox"
							name="theme-toggle"
							checked={true}
							value={themeMode.checked === 'light' ? 'light' : 'dark'}
							aria-label={themeMode.label}
							onChange={() => {
								const matchesDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

								if ((matchesDarkTheme && themeMode.checked === 'light') || (!matchesDarkTheme && themeMode.checked === 'dark')) {
									localStorage.removeItem('theme');
								} else {
									localStorage.setItem('theme', themeMode.checked === 'light' ? 'light' : 'dark');
								}
								setTheme(themeMode.checked === 'light' ? 'dark' : 'light');
							}}
						/>
					</label>
		</div>
	);
};

export default ThemeToggle;
