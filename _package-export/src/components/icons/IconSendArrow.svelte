<script lang="ts">
  let { size = 24, state = "idle" }: { size?: number; state?: "idle" | "sending" | "sent" | "failed" } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  <style>
    .send-arrow-icon, .send-check-icon, .send-error-icon {
      transition: opacity 0.15s ease, transform 0.15s ease;
    }
  </style>
  <g class="send-arrow-icon" style="opacity: {state === 'idle' ? 1 : state === 'sending' ? 0.5 : 0}; transform: {state === 'idle' ? 'scale(1)' : 'scale(0.8)'}; transform-origin: center">
    <path d="M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g class="send-check-icon" style="opacity: {state === 'sent' ? 1 : 0}; transform: {state === 'sent' ? 'scale(1)' : 'scale(0.8)'}; transform-origin: center">
    <path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 10L11 14.25L9.25 12.25" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g class="send-error-icon" style="opacity: {state === 'failed' ? 1 : 0}; transform: {state === 'failed' ? 'scale(1)' : 'scale(0.8)'}; transform-origin: center">
    <path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 8V12" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="12" cy="15" r="0.5" fill="#ef4444" stroke="#ef4444" stroke-width="1"/>
  </g>
</svg>
