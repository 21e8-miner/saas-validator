# 🔐 How to Configure Apple Keys for Auto-Upload

To enable the "Cloud Build" to actually upload your app to the App Store, you need to give it permission via API Keys.

## Phase 1: Get Keys from Apple

1.  **Log in to App Store Connect:**
    👉 [https://appstoreconnect.apple.com/access/integrations/api](https://appstoreconnect.apple.com/access/integrations/api)

2.  **Generate a Key:**
    - Click the **(+)** button next to "Team Keys".
    - **Name:** `GitHub Actions Automation`
    - **Access:** Select `App Manager`.
    - Click **Generate**.

3.  **Harvest the Data:**
    You will see a row in the table. You need 3 things:
    
    - **A) Issuer ID:** Found at the top of the page (e.g., `57246542-96fe-1a63-e053-0824d011072a`).
    - **B) Key ID:** Found in the "Key ID" column (e.g., `2X9R4HXF9H`).
    - **C) The Key Itself:** Click "Download API Key" (the down arrow).
      - *Warning:* You can only download this ONCE. Save it!
      - Open this `.p8` file in TextEdit/Notepad. You will need the full text contents later.

---

## Phase 2: Add Keys to GitHub

1.  **Go to GitHub Secrets:**
    👉 [https://github.com/21e8-miner/saas-validator/settings/secrets/actions](https://github.com/21e8-miner/saas-validator/settings/secrets/actions)

2.  **Add 3 New Secrets:**
    Click the green "**New repository secret**" button for each one:

    | Secret Name | Copied Value |
    | :--- | :--- |
    | `APP_STORE_CONNECT_ISSUER_ID` | Paste the **Issuer ID** (A) |
    | `APP_STORE_CONNECT_API_KEY_ID` | Paste the **Key ID** (B) |
    | `APP_STORE_CONNECT_API_KEY_CONTENT` | Paste the **FULL TEXT** of the .p8 file (C) |

---

## Phase 3: Launch! 🚀

1.  Go to your GitHub [Actions Tab](https://github.com/21e8-miner/saas-validator/actions).
2.  Select **"Cloud Build & Ship to App Store"**.
3.  Click **"Run workflow"**.

The build will now detect your keys, sign the app, and upload it to App Store Connect automatically!
