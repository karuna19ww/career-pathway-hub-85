import {createContext,useContext,useState,useEffect,type ReactNode} from 'react';
import type {User} from '@supabase/supabase-js';
import {supabase} from '@/integrations/supabase/client';
import {useQueryClient} from '@tanstack/react-query';
import {useRouter} from '@tanstack/react-router';
const Context=createContext<{user:User|null;ready:boolean}>({user:null,ready:false});
export function SessionProvider({children}:{children:ReactNode}){const [user,setUser]=useState<User|null>(null);const [ready,setReady]=useState(false);const qc=useQueryClient();const router=useRouter();useEffect(()=>{supabase.auth.getUser().then(({data})=>{setUser(data.user);setReady(true);});const {data}=supabase.auth.onAuthStateChange((event,session)=>{setUser(session?.user??null);setReady(true);if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)){router.invalidate();if(event!=='SIGNED_OUT')qc.invalidateQueries();}});return()=>data.subscription.unsubscribe();},[qc,router]);return <Context.Provider value={{user,ready}}>{children}</Context.Provider>;}
export const useSession=()=>useContext(Context);
