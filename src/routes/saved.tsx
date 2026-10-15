import {createFileRoute} from '@tanstack/react-router';
import {Workspace} from '@/components/career/workspace';
import {jobsQuery,pageHead} from '@/lib/career';
export const Route=createFileRoute('/saved')({head:()=>pageHead('Saved jobs','Manage your career journey on Nextstep.'),loader:({context})=>context.queryClient.ensureQueryData(jobsQuery),component:()=> <Workspace view="saved"/>});
