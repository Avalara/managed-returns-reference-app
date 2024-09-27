filename=./src/graphql/auth/index.js
filter=MjA5MDgyNzY1MDo0QkEzRkU5MkM4NjZFNDEx

sed -i "" "s/$filter/\${encodedCredentials}/g" "$filename" || echo skipping $filename -- --all
