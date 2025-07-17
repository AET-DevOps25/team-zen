import {
  CalendarIcon,
  MailIcon,
  ShieldCheckIcon,
  UserIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks';

const Profile = () => {
  const { user, userName, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                  />
                  <AvatarFallback className="text-lg">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">
                {user.fullName || 'User'}
              </CardTitle>
              <CardDescription>
                {user.primaryEmailAddress?.emailAddress}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Username</p>
                  <p className="text-sm text-gray-600">
                    {user.username || userName || 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Member since
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.createdAt
                      ? formatDate(user.createdAt)
                      : 'Not available'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Account status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {user.firstName || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {user.lastName || 'Not provided'}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center space-x-2">
                  <MailIcon className="h-4 w-4 text-gray-400" />
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm flex-1">
                    {user.primaryEmailAddress?.emailAddress}
                  </div>
                  {user.primaryEmailAddress?.verification.status ===
                    'verified' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Recent activity and account statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Last Sign In
                  </h4>
                  <p className="text-sm text-blue-700">
                    {user.lastSignInAt
                      ? formatDate(user.lastSignInAt)
                      : 'Never'}
                  </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-teal-900 mb-1">
                    Profile Updated
                  </h4>
                  <p className="text-sm text-teal-700">
                    {user.updatedAt ? formatDate(user.updatedAt) : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
