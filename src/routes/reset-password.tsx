import {createFileRoute} from '@tanstack/react-router';
import {useState,useEffect} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {Button} from '@/components/ui/button';
import {pageHead} from '@/lib/career';
export const Route=createFileRoute('/reset-password')({head:()=>pageHead('Reset password','Set a new password for your Nextstep account.'),component:Reset});
function Reset(){const [valid,setValid]=useState(false);const [message,setMessage]=useState('');useEffect(()=>{setValid(window.location.hash.includes('type=recovery'));const {data}=supabase.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')setValid(true);});return()=>data.subscription.unsubscribe();},[]);return <section className="auth-page"><div className="auth-panel"><h1>Set a new password.</h1>{valid?<form className="form-stack" onSubmit={async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const {error}=await supabase.auth.updateUser({password:String(f.get('password'))});setMessage(error?.message??'Your password has been updated.');}}><label>New password<input type="password" name="password" minLength={8} required/></label><Button type="submit">Update password</Button><p role="status">{message}</p></form>:<p>Open the password reset link from your email to continue.</p>}</div></section>;}
