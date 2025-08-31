import AuthSessionProvider from '@/components/layouts/AuthSessionProvider';
import QueryProvider from '@/components/layouts/QueryProvider';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Cisco ACI Rack Management Portal',
	description: 'Book and manage your Cisco ACI lab racks.',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en' className='h-full bg-gray-50'>
			<body className={`${inter.className} h-full`}>
				<AuthSessionProvider>
					<QueryProvider>{children}</QueryProvider>
				</AuthSessionProvider>
			</body>
		</html>
	);
}
