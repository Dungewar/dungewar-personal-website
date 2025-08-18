echo "Commiting..."
git commit -am "Do something"
echo "Pulling from remote..."
git pull
echo "Pushing local changes..."
git push || (echo "Need to merge" && exit)
echo "Merging onto website branch..."
git checkout website && (git merge main || (echo "Website has changes that aren't on main" && exit))
git push && git checkout main
echo "Done!"