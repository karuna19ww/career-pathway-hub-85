import {createFileRoute,Link} from '@tanstack/react-router';
import {useSuspenseQuery} from '@tanstack/react-query';
import {jobsQuery,pageHead} from '@/lib/career';
import {CompanyMark,JobCard} from '@/components/career/jobs';
import {ArrowLeft,MapPin} from 'lucide-react';
export const Route=createFileRoute('/companies/$company')({head:({params})=>pageHead(params.company,`Discover careers and open roles at ${params.company}.`),loader:({context})=>context.queryClient.ensureQueryData(jobsQuery),component:Company});
function Company(){const {company}=Route.useParams();const {data:jobs}=useSuspenseQuery(jobsQuery);const roles=jobs.filter(j=>j.company===company);return <section className="container page-section"><Link to="/companies" className="text-link"><ArrowLeft size={16}/>All companies</Link><div className="company-profile-heading"><CompanyMark company={company}/><div><span className="eyebrow">COMPANY PROFILE</span><h1>{company}</h1><p><MapPin size={16}/>{roles[0]?.location??'Location not specified'}</p></div></div><div className="company-about"><h2>Work that makes a difference.</h2><p>{roles[0]?.description??'This company has no current openings.'}</p></div><div className="section-heading"><h2>Open opportunities <span className="count-pill">{roles.length}</span></h2></div><div className="job-grid">{roles.map(j=><JobCard key={j.id} job={j}/>)}</div></section>;}
