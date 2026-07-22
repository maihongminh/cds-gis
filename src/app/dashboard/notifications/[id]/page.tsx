'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NotificationRedirectPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  React.useEffect(() => {
    if (id) {
      router.replace(`/dashboard/notifications?id=${id}`);
    }
  }, [id, router]);

  return (
    <div className="flex items-center justify-center py-20 text-xs text-muted-foreground animate-pulse">
      Đang tải chi tiết thông báo...
    </div>
  );
}
