import {createFileRoute} from '@tanstack/react-router';
import {Workspace} from '@/components/career/workspace';
import {jobsQuery,pageHead} from '@/lib/career';
export const Route=createFileRoute('/profile')({head:()=>pageHead('My profile','Manage your skills, professional headline and career profile on Nextstep.'),loader:({context})=>context.queryClient.ensureQueryData(jobsQuery),component:()=> <Workspace view="profile"/>});
