<script context="module" lang="ts">
    export const load = async ({ session }) => {
      if (!session.user) {
        return {
          status: 302,
          redirect: '/login'
        };
      }
      return {
        props: {
          user: session.user
        }
      };
    };
    console.log(load);
  </script>
  
  <script lang="ts">
    export let user;
  </script>
  
  <main>
    <h1>Welcome, {user}</h1>
    <p>This is a protected page.</p>
  </main>
  