<script lang="ts">
  // Import the types for the PageData
  import type { PageData } from './$types';

  // Declare the data variable with the correct type
  export let data: PageData;

  // Define the maximum events allowed for each plan
  const maxEventsPerPlan = {
    free: 2,
    premium: 15,
    enterprise: 100
  };

  // Calculate remaining events
  // const maxEvents = maxEventsPerPlan[data.subscription.plan] || 0;
  // const remainingEvents = maxEvents - data.subscription.eventsUsed;
</script>

<div>
  <h1>User Profile</h1>
  <!-- <p><strong>Id:</strong> {data.user.id}</p>
  <p><strong>Email:</strong> {data.user.email}</p> -->
  <p><strong>Subscription Plan:</strong> {data.subscription.plan || "N/A"}</p>
  {#if data.subscription.plan}
    <p><strong>Events Used:</strong> {data.subscription.eventsUsed}</p>
    <!-- <p><strong>Remaining Events:</strong> {remainingEvents}</p> -->
    <!-- <p><strong>Subscription Start Date:</strong> {new Date(data.subscription.startDate).toLocaleDateString()}</p> -->
    <!-- <p><strong>Subscription End Date:</strong> {data.subscription.endDate ? new Date(data.subscription.endDate).toLocaleDateString() : "Inactive"}</p> -->
  {/if}
</div>
