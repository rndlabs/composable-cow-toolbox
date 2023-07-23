<!-- WizardPage.svelte -->

<script lang="ts">
    export let title: string;
    export let showButtonLeft: boolean = false;
    export let showButtonRight: boolean = false;
    export let buttonTextLeft: string = "Button Left";
    export let buttonTextRight: string = "Button Right";
  
    // Custom event emitters for button clicks
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  
    function handleButtonClickLeft() {
      // Emit custom event for button click
      dispatch('button-click-left');
    }
  
    function handleButtonClickRight() {
      // Emit custom event for button click
      dispatch('button-click-right');
    }
  </script>
  
  <main>
    <div class="page-header">
      <h2>{title}</h2>
    </div>
    <div class="page-content">
      <slot />
  
      {#if showButtonLeft || showButtonRight}
        <div class="page-buttons">
          <div class="btn-left-container">
            {#if showButtonLeft}
              <button class="btn-left" on:click={handleButtonClickLeft}>{buttonTextLeft}</button>
            {/if}
          </div>
          <div class="btn-right-container">
            {#if showButtonRight}
              <button class="btn-right" on:click={handleButtonClickRight}>{buttonTextRight}</button>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </main>
  
  <style>
    /* Reset default styles and apply box-sizing */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  
    /* Style for the main container */
    main {
      width: 100%; /* Make the container fill the available width */
      min-width: 70%; /* Minimum width of 70% for desktop */
      max-width: 400px; /* Maximum width of 400px for mobile */
      height: 80vh; /* Use 80% of the viewport height for the container */
      overflow-y: auto; /* Enable vertical scrolling for the container */
      padding: 20px; /* Add some padding to the content inside the container */
      margin: auto; /* Center the container horizontally */
  
      /* Media query for mobile view */
      @media (max-width: 767px) {
        width: 100%; /* Full width for mobile */
      }
    }
  
    /* Style for the page header */
    .page-header {
      background-color: #007bff; /* Blue header background color */
      padding: 12px; /* Add padding to the header */
      text-align: center; /* Center align the title */
      color: #fff; /* White text color */
      font-size: 1.2rem; /* Larger font size for the title */
      font-weight: bold; /* Bold title */
      border-top-left-radius: 8px; /* Rounded top left corner */
      border-top-right-radius: 8px; /* Rounded top right corner */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a slight shadow */
    }
  
    /* Style for the page content */
    .page-content {
      padding: 20px; /* Add 20px padding to the content */
      border: 1px solid #ddd; /* Border for the content */
      border-radius: 0 0 8px 8px; /* Rounded corners for the bottom of the content */
    }
  
    /* Style for the page buttons container */
    .page-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 15px; /* Add some spacing above the buttons */
      padding-top: 15px; /* Add spacing between content and buttons */
      border-top: 1px solid #ddd; /* Top border for the buttons */
    }
  
    /* Style for the left button container */
    .btn-left-container {
      margin-right: auto;
    }
  
    /* Style for the left button */
    .btn-left {
      background-color: #007bff;
      color: #fff;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  
    /* Style for the right button container */
    .btn-right-container {
      margin-left: auto;
    }
  
    /* Style for the right button */
    .btn-right {
      background-color: #007bff;
      color: #fff;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
  