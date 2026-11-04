# Google Form local preview

Approved approach: embed the published Google Form in the existing branded diagnostic dialog. Google owns validation, submission, and confirmation. Preserve the form while the dialog is closed and reopen it without discarding entries. Load Google only when a visitor opens the dialog. Provide a direct responder link if embedding is unavailable. Keep the popup usable at phone widths.

1. Replace the obsolete custom form and Apps Script submission handler with the published embed.
2. Add responsive iframe styling and a direct-link fallback. Remove unused Apps Script files and deployment configuration.
3. Test lazy loading, embed URL, dialog dismissal, mobile dimensions, and existing CTA navigation. Visually inspect the real embed locally without submitting a response.
