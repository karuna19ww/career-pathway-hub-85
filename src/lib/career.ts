import {queryOptions} from '@tanstack/react-query';
import {listJobs} from './jobs.functions';
import type {Database} from '@/integrations/supabase/types';
export type Job=Database['public']['Tables']['jobs']['Row'];
export const jobsQuery=queryOptions({queryKey:['jobs'],queryFn:()=>listJobs()});
export const categories=['All opportunities','Design','Engineering','Marketing','Data','Business'];
export function filterJobs(jobs:Job[],query:string,location:string,category:string,type:string){return jobs.filter(j=>(`${j.title} ${j.company}`.toLowerCase().includes(query.toLowerCase()))&&j.location.toLowerCase().includes(location.toLowerCase())&&(category==='All opportunities'||j.category===category)&&(!type||j.type===type));}
export function pageHead(title:string,description:string){return {meta:[{title:`${title} · Nextstep`},{name:'description',content:description},{property:'og:title',content:`${title} · Nextstep`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};}
