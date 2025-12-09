
## 🚀 AUTO-SUBMIT TO APP STORE (Fastlane)

We have integrated **Fastlane**, the industry standard for iOS automation.

### Prerequisites

1. **Install Fastlane:**
   ```bash
   brew install fastlane
   ```
   *OR*
   ```bash
   sudo gem install fastlane
   ```

2. **Configure Appfile:**
   Edit `fastlane/Appfile` and add your:
   - `apple_id`: Your Apple ID email
   - `itc_team_id`: Your App Store Connect Team ID
   - `team_id`: Your Developer Portal Team ID

### One-Command Submission

Once configured, deploy to the App Store with:

```bash
fastlane ios release
```

This command will automatically:
1. Increment the build number
2. Build the signed `.ipa` file
3. Upload the binary to App Store Connect
4. Distribute for TestFlight (if configured)

### Troubleshooting Fastlane

If you get authentication errors, run:
```bash
fastlane spaceauth
```
This will generate a session cookie you can use for 2FA.
