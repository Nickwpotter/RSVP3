<script lang="ts">
	import { Check, Ship } from 'lucide-svelte';
	import Container from './Container.svelte';

	const featuresFree = {
		included: [
			'up to 2 events',
			'Free spreadsheet export',
			'Instant labels and envelope PDF ($15 One time purchase)',
		],
		excluded: []
	};

	const featuresPremium = {
		included: [
			'up to 15 events',
			'Spreadsheet export data',
			'Instant labels PDF export',
			'Instant envelopes PDF export'
		],
		excluded: []
	};

	const featuresEnterprise = {
		included: [
			'up to 100 events',
			'Spreadsheet export data',
			'Instant labels PDF export',
			'Instant envelopes PDF export',
			'Events API (Coming Soon)'
		],
		excluded: []
	};

	const priceIdFree = 'price_free';  // Replace with your actual Basic plan price ID
	const priceIdPremium = 'price_1PbAMyEiOdndJtQHcPlqX0D7';  // Replace with your actual Premium plan price ID
	// const priceIdPremium = 'price_1PcN0xEiOdndJtQHpM6h4oYC';  // Replace with your actual Premium plan price ID --- $0.99 test transaction

	const priceIdEnterprise = 'price_1PbDIbEiOdndJtQHhEuDdBGu'; // Replace with your actual Enterprise plan price ID

	async function handleCheckout(priceId: string, plan: string) {
		try {
			const response = await fetch('/stripe/checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ priceId, plan })
			});
			console.log(response);
			const result = await response.json();
			if (response.ok) {
				window.location.href = result.url;
			} else {
				console.error('Error:', result.error);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<Container>
	<div id="pricing" class="py-24 sm:py-32">
		<h2 class="text-center text-md text-base text-base-content/70 font-semibold leading-7">
			Pricing
		</h2>
		<div class="text-center mt-2 mb-10 sm:mb-20 text-2xl font-bold tracking-tight sm:text-4xl">
			Choose the right plan for you
		</div>
		<div class="flex flex-wrap justify-center gap-10 md:gap-16 w-fit mx-auto">
			
			<!-- Basic package -->
			<div class="card p-8 w-80 ring-2 ring-base-200 shadow-xl">
				<h3 class="text-xl font-extrabold mb-2 text-base-content text-opacity-80">Free Forever</h3>
				<div class="text-5xl font-extrabold leading-snug">
					$0.00 <span class="font-bold text-base">usd</span>
				</div>
				<ul class="space-y-2 mt-3 mb-20">
					{#each featuresFree.included as feature}
						<li class="flex items-center space-x-2">
							<Check strokeWidth={1} class="text-primary" />
							<div class="text-base-content text-opacity-80">{feature}</div>
						</li>
					{/each}
				</ul>
				<button class="btn mt-auto" on:click={() => handleCheckout(priceIdFree, 'free')}>
					<Ship /> Start Free Plan
				</button>
			</div>

			<!-- Premium package -->
			<div class="relative card p-8 w-80 ring-2 ring-primary shadow-xl">
				<div
					class="absolute top-5 right-5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary"
				>
					Most popular
				</div>

				<h3 class="text-xl font-extrabold mb-2 text-base-content text-opacity-80">Premium</h3>
				<div class="text-5xl font-extrabold leading-snug">
					$9.99 <span class="font-bold text-base">usd</span>
				</div>
				<ul class="space-y-2 mt-3 mb-20">
					{#each featuresPremium.included as feature}
						<li class="flex items-center space-x-2">
							<Check strokeWidth={1} class="text-primary" />
							<div class="text-base-content text-opacity-80">{feature}</div>
						</li>
					{/each}
				</ul>
				<button class="btn btn-primary mt-auto" on:click={() => handleCheckout(priceIdPremium, 'premium')}>
					<Ship /> Get Premium Plan
				</button>
			</div>

			<!-- Enterprise package -->
			<div class="card p-8 w-80 ring-2 ring-base-200 shadow-xl">
				<h3 class="text-xl font-extrabold mb-2 text-base-content text-opacity-80">Enterprise</h3>
				<div class="text-5xl font-extrabold leading-snug">
					$24.99 <span class="font-bold text-base">usd</span>
				</div>
				<ul class="space-y-2 mt-3 mb-20">
					{#each featuresEnterprise.included as feature}
						<li class="flex items-center space-x-2">
							<Check strokeWidth={1} class="text-primary" />
							<div class="text-base-content text-opacity-80">{feature}</div>
						</li>
					{/each}
				</ul>
				<button class="btn mt-auto" on:click={() => handleCheckout(priceIdEnterprise, 'enterprise')}>
					<Ship /> Get Enterprise Plan
				</button>
			</div>
		</div>
	</div>
</Container>
