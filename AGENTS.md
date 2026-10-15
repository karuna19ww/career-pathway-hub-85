<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Portal architecture
- Public career content uses TanStack routes and a shared shell, with loader-fed jobs queries for SSR and navigation consistency.
- Account-specific writes use the generated browser client with owner-scoped database policies; recruiter permissions derive from job ownership, not editable account roles.
- Session state is subscribed once in the shared provider so navigation and caches reflect identity changes.
