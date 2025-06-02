# 🎵 Music Raze

**Music Raze** is a modern, full-stack music streaming web application built with Next.js, Tailwind CSS, Prisma, and the Spotify Web API. It offers a sleek and responsive interface for users to explore and enjoy their favorite tracks.

---

## 🚀 Features

- 🎧 **Spotify Integration**: Seamless connection with the Spotify API to fetch and play music.
- 🖥️ **Responsive Design**: Optimized for desktops, tablets, and mobile devices.
- 🌐 **Next.js Framework**: Utilizes the latest features of Next.js for server-side rendering and routing.
- 🎨 **Tailwind CSS**: Rapid UI development with utility-first CSS.
- 🗄️ **Prisma ORM**: Efficient and type-safe database interactions.
- 🔐 **Authentication**: Secure user authentication and session management.

---

## 🛠️ Technologies Used

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)

---

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vipinAlways/Music-raze.git
   cd Music-raze
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add your Spotify API credentials:

   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Run the development server**:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```
Music-raze/
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets
├── src/                # Source code
│   ├── app/            # Next.js app directory
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utility functions and libraries
│   └── styles/         # Global styles
├── .eslintrc.json      # ESLint configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project metadata and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

Developed by [Vipin Tiwari](https://github.com/vipinAlways), a passionate frontend developer from India on a journey to become a full-stack developer.
