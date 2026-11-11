echo "== stack =="; grep -E '"(react|react-dom|react-router-dom|vite|@supabase/supabase-js|tailwindcss|framer-motion|@vitejs[^"]*)"' package.json
echo; echo "== files =="; find src -type f | sort
echo; echo "== biggest files =="; wc -l $(find src -type f \( -name '*.js' -o -name '*.jsx' \)) | sort -n | tail -12
echo; echo "== env names used =="; grep -rhoE "import\.meta\.env\.[A-Z_]+" src | sort -u
echo; echo "== env files =="; ls -a | grep -i '^\.env'; git ls-files | grep -iE '^\.env' || echo "no env files tracked"
echo; echo "== database =="; grep -niE "create table|create or replace function|enable row level|create policy" supabase.sql | cut -c1-120
echo; echo "== keyboard bug suspects: components defined inside other components =="
grep -rnE "^[[:space:]]+(const|function)[[:space:]]+[A-Z][A-Za-z]+[[:space:]]*(=|\()" src | cut -c1-130 | head -40
echo; echo "== random or changing keys =="; grep -rnE "key=\{(Math\.random|Date\.now|crypto)" src | cut -c1-130
echo; echo "== identity / start / fullscreen / opacity =="
grep -rniE "identity|click to start|tap to start|press to start|requestFullscreen|fullscreen|backdrop-filter|opacity" src | cut -c1-140 | head -40
