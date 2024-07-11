<script>
	import { Ship } from 'lucide-svelte';
	import Container from './Container.svelte';
</script>

<Container>
	<div class="flex flex-col md:flex-row py-8 sm:py-20">
		<div>
			<div class="text-center text-3xl sm:text-7xl sm:text-left font-bold sm:mt-8">
				Lots of people use us <br /> <span class="text-rose-500">everyday</span> <br /> for
				<span class="decoration-primary">their</span>
			</div>
			<div class="text-center sm:text-left text-3xl sm:text-7xl font-bold mt-5 pt-2">
				<div class="inline-block overflow-hidden ">
					<div class="dynamic-text svelte-1ruztm0">
						<div class="font-bold text-transparent bg-clip-text retroFill">wedding invites</div>
						<div class="font-bold text-transparent bg-clip-text retroFill">birthday RSVPs</div>
						<div class="font-bold text-transparent bg-clip-text retroFill">family reunions</div>
						<div class="font-bold text-transparent bg-clip-text retroFill">wedding RSVPs</div>
						<div class="font-bold text-transparent bg-clip-text retroFill">company party</div>
						<div class="font-bold text-transparent bg-clip-text retroFill">mailing lists</div>
						<div class="font-bold text-transparent bg-clip-text retroFill">holiday cards</div>
						<div class="font-bold text-transparent bg-clip-text retroFill">mailing lists</div>
						<div class="font-bold text-transparent bg-clip-text retroFill">baby announcements</div>
					</div>
				</div>
			</div>
			<p class="mt-2 sm:mt-4 mb-6 sm:mb-8 text-md text-center sm:text-left sm:text-lg">
				Manage RSVPs, collect addresses, and plan events seamlessly. <br class="hidden sm:block" />
				Our all-in-one solution simplifies your event management needs.
			</p>
			<div class="flex items-center justify-center sm:justify-start">
				<a href="/#pricing" class="btn btn-primary text-lg w-full max-w-sm h-14">
					<Ship class="mr-2" /> Get Started Now
				</a>
			</div>
		</div>
		<div class="bg-gray-100 md:ml-5 p-10 flex-1 text-xl rounded-xl mt-8 text-center md:min-w-48">
			<img src="images/demo-video.png" alt="Demo Video" class="rounded-xl mb-4" />
			<p>
				Watch our quick demo to see how our platform can make your event planning effortless and efficient.
			</p>
		</div>
	</div>
</Container>

<style>
	@keyframes scrollText {
		0%, 100% { transform: translateY(0); }
		10% { transform: translateY(-100%); }
		20% { transform: translateY(-200%); }
		30% { transform: translateY(-300%); }
		40% { transform: translateY(-400%); }
		50% { transform: translateY(-500%); }
		60% { transform: translateY(-600%); }
		70% { transform: translateY(-700%); }
		80% { transform: translateY(-800%); }
		90% { transform: translateY(-900%); }

	}

	.dynamic-text {
		height: 1em;
		display: flex;
		flex-direction: column;
		animation: scrollText 30s infinite;
	}

	.retroFill {
		background: linear-gradient(to right, #ff7e5f, #feb47b);
		-webkit-background-clip: text;
	}
</style>
