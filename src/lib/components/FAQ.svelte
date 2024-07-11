<script lang="ts">
	import type { Faq } from '$lib/types';
	import Container from './Container.svelte';

	const faqs: Array<Faq> = [
		{
			question: 'What is Just Ship?',
			answer: 'Just Ship is a comprehensive event management solution designed to simplify RSVPs, address collection, and event planning.'
		},
		{
			question: 'How do I get started?',
			answer: 'Getting started is easy! Simply sign up, choose your plan, and start creating your custom guest registration portals.'
		},
		{
			question: 'How can I support Just Ship?',
			answer: 'You can support Just Ship by subscribing to one of our plans, providing feedback, and sharing our service with others.'
		},
		{
			question: 'Can I cancel anytime?',
			answer: 'Yes, you can cancel your subscription at any time. Your service will continue until the end of your current billing period.'
		},
		{
			question: 'Can I upgrade at any time?',
			answer: 'Yes, you can upgrade your plan at any time to access more features and higher limits.'
		},
		{
			question: 'What happens to my data if I cancel?',
			answer: 'Your data will remain secure and accessible for a period after cancellation, allowing you to export any important information.'
		},
		{
			question: 'Do you offer customer support?',
			answer: 'Yes, we offer premium customer support to assist you with any questions or issues you may encounter.'
		},
		{
			question: 'Is there a free trial available?',
			answer: 'Yes, we offer a 7-day free trial for our Basic plan, allowing you to explore our features before committing.'
		}
	];
</script>

<Container>
	<div id="faq" class="max-w-2xl mx-auto py-24 sm:py-32">
		<div class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-center">FAQ</div>
		<div class="mt-2 sm:mt-4 text-md sm:text-lg leading-6 sm:leading-8 text-center">
			Still have questions? We've got you covered!
		</div>
		<div class="mt-5 md:mt-8 lg:mt-10">
			<div class="join join-vertical w-full">
				{#each faqs as faq}
					<div class="collapse collapse-arrow join-item border">
						<input type="radio" name="accordion" />
						<div class="collapse-title text-xl font-medium">
							{faq.question}
						</div>
						<div class="collapse-content">
							<p>{@html faq.answer}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</Container>
