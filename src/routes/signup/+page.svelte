<script lang="ts">
import { enhance } from '$app/forms';
let { form } = $props();
let loading = $state(false);
</script>

<svelte:head><title>Sign Up — MarketPulse</title></svelte:head>

<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <div class="auth-logo">◈ MarketPulse</div>
      <h1>Create Account</h1>
      <p>Start trading with $100,000 demo cash</p>
    </div>

    {#if form?.error}
      <div class="alert error">{form.error}</div>
    {/if}

    <form method="POST" use:enhance={() => {
      loading = true;
      return async ({ update }) => {
        loading = false;
        await update();
      };
    }}>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" placeholder="trader_joe" required minlength="3" autocomplete="username" />
      </div>

      <div class="form-group">
        <label for="displayName">Display Name</label>
        <input type="text" id="displayName" name="displayName" placeholder="Joe Trader" autocomplete="name" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required autocomplete="email" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Min 6 characters" required minlength="6" autocomplete="new-password" />
      </div>

      <button type="submit" class="btn-primary" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>

    <div class="auth-footer">
      Already have an account? <a href="/login">Sign In</a>
    </div>

    <div class="demo-notice">
      <span class="demo-badge">DEMO</span>
      You'll receive $100,000 in simulated cash to trade.
    </div>
  </div>
</div>

<style>
  .auth-container { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); padding: 20px; }
  .auth-card { background: #0f1424; border: 1px solid #1f2937; border-radius: 16px; padding: 40px; width: 100%; max-width: 420px; }
  .auth-header { text-align: center; margin-bottom: 32px; }
  .auth-logo { font-size: 20px; font-weight: 800; letter-spacing: .04em; margin-bottom: 16px; }
  .auth-header h1 { font-size: 24px; font-weight: 700; margin: 0 0 8px; }
  .auth-header p { color: #9ca3af; font-size: 14px; margin: 0; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 13px; font-weight: 600; color: #9ca3af; margin-bottom: 6px; }
  .form-group input { width: 100%; background: #111827; border: 1px solid #1f2937; color: #e5e7eb; padding: 10px 14px; border-radius: 8px; font-size: 14px; outline: none; transition: border-color .15s; box-sizing: border-box; }
  .form-group input:focus { border-color: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.2); }
  .btn-primary { width: 100%; background: #22c55e; color: #052e16; border: none; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .btn-primary:hover { background: #16a34a; }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
  .alert.error { background: #450a0a; border: 1px solid #ef4444; color: #fca5a5; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .auth-footer { text-align: center; margin-top: 20px; font-size: 13px; color: #9ca3af; }
  .auth-footer a { color: #60a5fa; text-decoration: none; font-weight: 600; }
  .auth-footer a:hover { text-decoration: underline; }
  .demo-notice { text-align: center; margin-top: 24px; padding: 10px; background: #111827; border-radius: 8px; font-size: 12px; color: #6b7280; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .demo-badge { background: #f59e0b; color: #111; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; }
</style>
