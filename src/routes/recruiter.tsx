import {createFileRoute} from '@tanstack/react-router';
import {Workspace} from '@/components/career/workspace';
import {jobsQuery,pageHead} from '@/lib/career';
export const Route=createFileRoute('/recruiter')({head:()=>pageHead('Recruiter studio','Post career opportunities, review applicants and manage hiring on Nextstep.'),loader:({context})=>context.queryClient.ensureQueryData(jobsQuery),component:()=> <Workspace view="recruiter"/>});
