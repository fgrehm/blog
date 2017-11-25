# Blog

https://gohugo.io/hosting-and-deployment/hosting-on-github/#build-and-deployment

rm -rf public
git worktree add -B gh-pages public upstream/gh-pages
hugo
cd public && git add --all && git commit -m "Publishing to gh-pages" && cd ..
git push upstream gh-pages


https://gohugo.io/content-management/syntax-highlighting/#generate-syntax-highlighter-css
