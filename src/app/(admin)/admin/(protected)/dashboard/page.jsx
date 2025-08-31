import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DashboardChart from '@/components/admin/DashboardChart';
import DashboardStats from '@/components/admin/DashboardStats';
import DashboardTable from '@/components/admin/DashboardTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getServerSession } from 'next-auth';

// Helper function to fetch data with authentication on the server
async function getDashboardStats() {
	const session = await getServerSession(authOptions);

	try {
		// Use fetch instead of axios for server-side calls
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard-stats`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
					'Content-Type': 'application/json',
				},
				// Add cache control for server-side rendering
				cache: 'no-store',
			}
		);

		if (!response.ok) {
			console.error(
				`API response not ok: ${response.status} ${response.statusText}`
			);
			const errorText = await response.text();
			console.error('Error response body:', errorText);
			return null;
		}

		const data = await response.json();

		// Check if the response has the expected structure
		if (data.success && data.data) {
			return data.data;
		} else {
			console.error('Unexpected API response structure:', data);
			return null;
		}
	} catch (error) {
		console.error('Failed to fetch dashboard stats:', error);
		return null;
	}
}

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session?.accessToken) {
		console.error('No access token available in session');
		return null;
	}

	const stats = await getDashboardStats();

	if (!stats) {
		return (
			<div className='flex flex-1 flex-col gap-4'>
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error Loading Dashboard</AlertTitle>
					<AlertDescription>
						Unable to load dashboard data. Please try refreshing the page or
						contact support if the problem persists.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='flex flex-1 flex-col gap-4'>
			{/* Stats Cards */}
			<DashboardStats stats={stats} />

			{/* Charts and Tables */}
			<div className='grid gap-4 lg:grid-cols-3'>
				{/* Chart takes 2 columns */}
				<div className='lg:col-span-2'>
					<DashboardChart />
				</div>

				{/* Quick Actions or Recent Activity */}
				<div className='flex flex-col gap-4'>
					{/* You can add quick action cards here */}
					<div className='grid gap-4'>
						{/* Placeholder for additional widgets */}
					</div>
				</div>
			</div>

			{/* Upcoming Bookings Table */}
			<DashboardTable upcomingBookings={stats.upcomingBookings} />
		</div>
	);
}
