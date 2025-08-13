git commit -am "Do something"
git pull
git push || (echo "Need to merge" && exit)
git checkout website && git merge main && git push && git checkout main