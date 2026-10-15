import {describe,it,expect} from 'vitest';
import {filterJobs,type Job} from '../lib/career';
const jobs:Job[]=[{id:'1',owner_id:null,title:'Designer',company:'Sample',location:'Remote',category:'Design',type:'Internship',salary:'Competitive',description:'Role',requirements:'Skills',created_at:'2026-10-15'},{id:'2',owner_id:null,title:'Engineer',company:'Sample',location:'Seattle',category:'Engineering',type:'Full-time',salary:'Competitive',description:'Role',requirements:'Skills',created_at:'2026-10-15'}];
describe('career discovery',()=>{
 it('filters internships independently of full-time jobs',()=>expect(filterJobs(jobs,'','','All opportunities','Internship').map(j=>j.id)).toEqual(['1']));
 it('filters remote opportunities',()=>expect(filterJobs(jobs,'','Remote','All opportunities','').map(j=>j.id)).toEqual(['1']));
 it('matches job titles case-insensitively',()=>expect(filterJobs(jobs,'ENGINEER','','All opportunities','').map(j=>j.id)).toEqual(['2']));
 it('filters by career discipline',()=>expect(filterJobs(jobs,'','','Engineering','').map(j=>j.id)).toEqual(['2']));
});