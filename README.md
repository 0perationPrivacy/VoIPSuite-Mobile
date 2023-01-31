# VoIP Suite - Mobile
Android &amp; iOS App open source code written in React Native and compiled for both Andoid & iOS
- Compiled binaries are in the **Release** section
- Report any issues under the **Issues** section using the correct tags
- Report Security Vulnerabilites/Bugs to security@OperationPrivacy.com
- Donate at [OperationPrivacy.com/donate](https://www.OperationPrivacy.com/donate)
- To contribute your coding skills to this Open Source project, reach out using contribute@OperationPrivacy.com

---

> This repository is only for the *Endpoint Application* to be used with an account on a [self hosted setup](https://github.com/0perationPrivacy/VoIP) or the [public instance](https://voip.operationprivacy.com/).

## Features:
- Native Applications *(not wrappers or web applications)*
- Using a built-in notification system for Android *(Not using Google's Firebase Cloud Messaging)*. Notifications work on de-Googled devices like GraphenOS.
- Option to select a server URL at login for self hosted server setup
- VoIP SMS / MMS
- No VoIP Calling yet
- Unlimited Profiles setup
- Assign a separate VoIP provider phone number on each profile
- Custom email notifications on received sms's (SMTP)
- Security:
  - Multifactor authentication using TOTP (not yet implemented on mobile, will have to disable on the account to log into the mobile app)
  - MFA using Hardware Keys (pending implementation in mobile)
  - Link obfuscation by setting a custom directory URI
  - Built in brute force protection in the server
- Under active development

