<!-- RotatingCow.svelte -->
<script>
	export let rotationDuration = 1000; // in milliseconds
	export let rotations = 1;

	// Calculate the duration for one full rotation
	let fullRotationDuration = rotationDuration / rotations;
</script>

<div class="container" style="animation-duration: {rotationDuration}ms; z-index: 9999;">
	<span class="cow">🐮</span>
</div>

<style>
	.container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		perspective: 1000px;
		animation: fadeInOutAndRotate cubic-bezier(0.42, 0, 0.58, 1) infinite;
		opacity: 0; /* Start with opacity set to 0 for fade-in effect */
		animation-fill-mode: forwards; /* Ensure the last keyframe persists after animation */
	}

	.cow {
		font-size: 10rem; /* Adjust the size based on your preference */
	}

	@keyframes fadeInOutAndRotate {
		0% {
			transform: translateZ(-50px) scale(0.1) rotate(0deg);
			opacity: 0; /* Start with opacity set to 0 for fade-in effect */
		}
		5%,
		45% {
			opacity: 1; /* Fade in at 5% and maintain opacity until 45% */
		}
		50% {
			transform: translateZ(-200px) scale(1.5) rotate(180deg);
		}
		55%,
		95% {
			opacity: 1; /* Fade out gradually from 55% to 95% */
		}
		100% {
			transform: translateZ(-50px) scale(0.1) rotate(360deg); /* Return to the starting position */
			opacity: 0; /* Ensure opacity is 0 at the end of the animation */
		}
	}
</style>
