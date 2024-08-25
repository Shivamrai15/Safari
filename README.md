
# **Music Streaming Webapp**

For our music streaming app, we used Next.js and React.js with TailwindCSS for the frontend. The backend was built with Next.js, using Prisma ORM to work with MongoDB for data operations. Data fetching was handled using React Query and SWR to optimize performance and Zustand for managing app state. Stripe was integrated for handling payments.

## Features

* **Account Creation:** Users can create an account using their email ID or through Google or GitHub.
* **Ad-Free Listening:**
  * Subscribed users can play songs without ads.
  * Unsubscribed users can play songs without ads for 30 minutes.
* **Playlists:**
  * Subscribed users can create unlimited playlists.
  * Unsubscribed users can create up to 5 playlists.
  * Users can create public or private playlists based on their preference.
* **Artist Following:** Users can follow their favorite artists.
* **Song Liking:** Users can like songs to save them.
* **Playback Restrictions for Unsubscribed Users:**
  * Cannot seek songs.
  * Cannot play previously played songs.
* **Synced Lyrics:** Subscribed users can view synced lyrics while listening.
* **Queue Management:** Subscribed users can manage and organize their playback queue.
* **History Management:** User can manage their listening history.

## Listen with friends
I implemented a **Listen with Friends** feature that lets multiple subscribed users listen to music together in real time. To make this possible, I used Socket.io and created a custom backend hosted on an **AWS EC2** instance. Users can manage the queue, play, pause, and change songs in real time. ( For more details, visit the repository https://github.com/Shivamrai15/public-apis-and-socket-server-for-safari )


## Queue Working

![Untitled-2024-04-09-1926](https://github.com/Shivamrai15/Safari/assets/111892135/924720fe-69c0-4faf-8279-b9dea3aa34ba)

