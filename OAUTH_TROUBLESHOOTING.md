# OAuth 401 Error Troubleshooting Guide

The 401 Unauthorized error during token exchange means Supabase can't complete the OAuth flow. Follow these steps:

## Step 1: Verify Supabase Redirect URLs

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `nxqjtksrygxzmrbvpivk`
3. Navigate to: **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, make sure you have EXACTLY:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/`
   - (The callback route is now required for OAuth to work properly)

5. Under **Site URL**, set it to:
   - `http://localhost:3000`

6. Click **Save**

**Important**: The OAuth callback now uses `/auth/callback` route. Make sure this URL is in your allowed redirect URLs list.

## Step 2: Verify Google OAuth Configuration in Supabase

1. In Supabase Dashboard, go to: **Authentication** → **Providers**
2. Click the **Google** tab
3. Verify:
   - ✅ **Enabled** is checked
   - ✅ **Client ID (for OAuth)** is filled in (from Google Cloud Console)
   - ✅ **Client Secret (for OAuth)** is filled in (from Google Cloud Console)
4. Click **Save** if you made any changes

## Step 3: Verify Google Cloud Console Configuration

### 3a. Check OAuth Client ID Redirect URIs (CRITICAL)

1. Go to: https://console.cloud.google.com
2. Navigate to: **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID and click on it
4. Under **Authorized redirect URIs**, you MUST have EXACTLY:
   - `https://nxqjtksrygxzmrbvpivk.supabase.co/auth/v1/callback`
   - (This is the Supabase callback URL, NOT your app URL like `http://localhost:3000`)
5. Click **Save**

**Important**: Do NOT add `http://localhost:3000/auth/callback` here. Google redirects to Supabase first, then Supabase redirects to your app.

### 3b. Verify OAuth Consent Screen

1. Navigate to: **APIs & Services** → **OAuth consent screen**
2. Verify:
   - **Publishing status** is set to **"Testing"** (if app is not verified)
   - **Authorized domains** includes: `nxqjtksrygxzmrbvpivk.supabase.co`
   - **Test users** (if in Testing mode): Add your email addresses that will test the app
3. If required, fill in:
   - Application home page (can be your app URL: `http://localhost:3000`)
   - Privacy policy link (optional for testing)
   - Terms of service link (optional for testing)

## Step 4: Clear Browser Cache and Try Again

1. Clear your browser cache and cookies for localhost:3000
2. Or use an incognito/private window
3. Restart your dev server: `npm run dev`
4. Try logging in again

## Step 5: Check Browser Console

After clicking "Login with Google", check the console for:
- Any CORS errors
- Any network errors
- The exact error message from the 401

## Common Issues:

1. **Redirect URL mismatch**: The URL in your code must match EXACTLY what's in Supabase
2. **Google OAuth not enabled**: Make sure Google provider is enabled in Supabase
3. **Wrong Google redirect URI**: Must be the Supabase callback URL, not your app URL
4. **Site URL mismatch**: Site URL in Supabase must match your app URL

