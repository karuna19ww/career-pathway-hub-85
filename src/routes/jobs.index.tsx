import {createFileRoute} from '@tanstack/react-router';
import {jobsQuery,pageHead} from '@/lib/career';
import {JobBoard} from '@/components/career/jobs';
export const Route=createFileRoute('/jobs/')({validateSearch:(s:{q?:string;location?:string;type?:string}):{q?:string;location?:string;type?:string}=>({q:String(s['q']??''),location:String(s['location']??''),type:String(s['type']??'')}),head:()=>pageHead('Find jobs','Explore jobs and internships with filters for location, discipline and employment type.'),loader:({context})=>context.queryClient.ensureQueryData(jobsQuery),component:Jobs});
function Jobs(){const {type,q,location}=Route.useSearch();return <JobBoard initialType={type??''} initialQuery={q??''} initialLocation={location??''}/>;}
