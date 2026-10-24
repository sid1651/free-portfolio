# Aranya Residences concept site

A responsive real estate concept website built with Next.js. It has a single landing page and a separate contact page. The Aranya name, copy and generated property imagery are illustrative; replace them with verified project details before launch.

## Run locally

```bash
npm install
npm run dev
```

The development script uses webpack with polling so local network previews update consistently on this machine. It runs at `http://localhost:3000` by default.

## Receive enquiries

The form posts to `/api/contact` and uses the email adapter already in this project. Configure these server environment variables for real delivery:

- `CONTACT_TO_EMAIL`: the inbox that receives enquiries
- `EMAIL_URL`: email service endpoint
- `EMAIL_PRIVATE_KEY`: email service credential

Until all three are configured, the API returns an error and the form does not claim an enquiry was sent. No contact details are saved locally. The inbox address, phone number, location, prices and legal project details have deliberately been left unset in the demo.
