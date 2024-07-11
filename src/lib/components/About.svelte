<script>
	import Container from './Container.svelte';
</script>

<Container>
	<div class="hero lg:min-h-[45vh]" id="about">
		<div class="flex flex-col lg:flex-row gap-x-24 p-edge pt-12 lg:p-8">
			<div class="flex-1 text-center lg:text-left max-w-xl self-center pb-6 lg:py-12">
				<div class="text-base stdphone:text-lg md:text-lg lg:text-xl xl:text-2xl py-2 md:py-3 max-w-md">
					Hi, I am Nick
				</div>
				<div class="text-base stdphone:text-lg md:text-lg lg:text-xl xl:text-2xl py-2 md:py-3 max-w-md">
					I love building things and solving problems! My goal is to create something people truly want. If you have an idea on how I could make it better, I am all ears!
				</div>
				<div class="text-base stdphone:text-lg md:text-lg lg:text-xl xl:text-2xl py-2 md:py-3 max-w-md">
					Current solutions for managing RSVPs and address collections were not user-friendly and didn't include all the features needed to get the job done. I built this service to simplify the process of sending wedding announcements, RSVPs for birthdays, and even company parties.
				</div>
				<div class="text-base stdphone:text-lg md:text-lg lg:text-xl xl:text-2xl py-2 md:py-3 max-w-md">
					I love creating solutions that people find useful and enjoyable. If you encounter any issues with my RSVP app, please reach out. I am committed to ensuring you have the best experience possible!
				</div>
				<div class="text-base stdphone:text-lg md:text-lg lg:text-xl xl:text-2xl py-2 md:py-3 max-w-md">
					- Nick Potter<br />(801)-726-9049
				</div>
			</div>
			<div class="self-center lg:self-start lg:py-12">
				<div class="w-[252px] h-[240px] stdphone:w-[294px] stdphone:h-[280px] lg:w-[420px] lg:h-[400px] self-center">
					<div class="scale-[0.6] stdphone:scale-[0.7] lg:transform-none w-[420px] h-[400px]">
						<div class="pt-6 w-full" aria-hidden="true">
							<img src="images/nick_kylee.JPG" alt="Nick Potter" class="w-full h-full object-cover"/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</Container>
