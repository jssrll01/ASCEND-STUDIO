show() { echo; echo "######## $1 ########"; cut -c1-170 "$1"; }
show supabase.sql
show src/Intro.jsx
show src/Title.jsx
show src/Shell.jsx
show src/pages/HomePage.jsx
show src/pages/ChatPage.jsx
show src/main.jsx
show vite.config.js
show index.html
echo; echo "######## styles.css 60-125 ########"; sed -n 60,125p src/styles.css | cut -c1-200
