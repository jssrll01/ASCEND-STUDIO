show() { echo; echo "######## $1 ########"; cut -c1-170 "$1"; }
echo "== .env names only =="; sed 's/=.*/=/' .env
show src/Identity.jsx
show src/Splash.jsx
show src/useStage.js
show src/App.jsx
show src/config.js
show src/store.js
