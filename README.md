<p align="center">
    <a href="https://safari-music.vercel.app/">
        <img src="./public/assets/meta.avif" alt="Logo">
    </a>
    <h1 align="center">Safari</h1>
    <p align="center">
        The open-source music streaming application.
        <br />
        <a href="https://safari-music.vercel.app/">Website</a>
        ·
        <a href="https://github.com/Shivamrai15/Safari/issues">Issues</a>
        ·
        <a href="./docs/README.md">Services</a>
    </p>
</p>

## About the Project

This project is built to let you enjoy your favorite music with a sleek interface and awesome real-time features. Whether you're discovering new tracks or listening with friends, this app is all about making your music experience fun and seamless.

## Build With

- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/?ref=cal.com)
- [Tailwind CSS](https://tailwindcss.com/?ref=cal.com)
- [Prisma.io](https://prisma.io/?ref=cal.com)
- [MongoDB](https://www.mongodb.com/)
- [Shadcn](https://ui.shadcn.com/)
- [NextAuth](https://authjs.dev/)
- [Qdrant](https://qdrant.tech/)
- [Stripe](https://stripe.com/in)
- [Socket.io](https://socket.io/)
- [Imagekit.io](https://imagekit.io/)
- [Cloudinary](https://cloudinary.com/)
- [Gemini](https://ai.google.dev/gemini-api/docs/embeddings)
- [FFmpeg](https://www.ffmpeg.org/)


## Features

- **Ad-Free Listening**: 
  - Subscribed users can enjoy songs without ads.
  - Unsubscribed users get 30 minutes of ad-free listening.
- **Playlists**: 
  - Subscribed users can create unlimited playlists.
  - Unsubscribed users can create up to 5 playlists.
  - Option to make playlists public or private.
- **Artist Following**: Follow your favorite artists to keep up with their latest releases.
- **Song Liking**: Like songs to save them and create your personal collection.
- **Playback Restrictions for Unsubscribed Users**:
  - Cannot seek to different parts of the song.
  - Cannot replay previously played songs.
- **Synced Lyrics**: Enjoy synced lyrics in real time while listening (for subscribed users).
- **Queue Management**: Organize and manage your playback queue (for subscribed users).
- **History Management**: Easily manage and review your listening history.
- **Listen with Friends**: 
  - Multiple subscribed users can listen together in real time.
  - Manage the queue, play, pause, and change songs together using Socket.io with a custom backend.




## Environment Variables

Below is a table listing the environment variables used in the application along with their default (empty) values. Make sure to update these with your actual configuration details.

| Environment Variable                   | Value |
| -------------------------------------- | ----- |
| `DATABASE_URL`                         | ""    |
| `AUTH_SECRET`                          | ""    |
| `VERIFICATION_SECRET`                  | ""    |
| `FORGET_PASSWORD_SECRET`               | ""    |
| `NEXT_PUBLIC_CRYPTO_SECRET_KEY`        | ""    |
| `EMAIL_USERNAME`                       | ""    |
| `EMAIL_CREDENTIALS`                    | ""    |
| `ORIGIN`                               | ""    |
| `GOOGLE_CLIENT_ID`                     | ""    |
| `GOOGLE_CLIENT_SECRET`                 | ""    |
| `GITHUB_CLIENT_ID`                     | ""    |
| `GITHUB_CLIENT_SECRET`                 | ""    |
| `NEXT_PUBLIC_ORIGIN`                   | ""    |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`   | ""    |
| `STRIPE_WEBHOOK_SECRET`                | ""    |
| `STRIPE_SECRET_KEY`                    | ""    |
| `UPSTASH_REDIS_REST_URL`               | ""    |
| `UPSTASH_REDIS_REST_TOKEN`             | ""    |
| `QDRANT_SECRET`                        | ""    |
| `QDRANT_URL`                           | ""    |
| `GEMINI_API_KEY`                       | ""    |
| `NEXT_PUBLIC_SOCKET_API`               | ""    |
