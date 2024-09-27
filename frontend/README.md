# React + TypeScript + Vite + Zod + TailwindCSS + Tanstack Query

- Used Zod to valiate the login and signup data.
- Used React Query to fetch data from the Quart API.

# Lessons Learned
- wanted to set the first diary on homepage to be the first in the list 
    - wanted to use onSuccess but it was deprecated, 
    - solved by using useEffect with data as dependency

- made Title, Subtitle, Profile dropdown components to be reusable

- found it tricky to incorporate zod, react form and useMutation all in one
    - solved by writing useMutatiion outside onSubmit

- after deleting a diary, the diary list is not updated
    - found out about refetch method
    - didnt work as refetch was called onClick
    - moved refetch inside onSuccess