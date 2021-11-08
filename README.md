# github-information-api
An API to get every users last commit date and projects info and dayli commits e.g.

## Todo
* [x] Figure out a way to get this data
* [x] implement it in a rest api
* [x] bring from hakcy dacky way to nice looking
* [x] add caching
* [ ] Add function to get the commits for specific day
* [x] Add function to get the commits for a year grouped in days
* [x] Add function to calc the avg commits per day
* [x] Add function to get the latest commit for an exact project | To display maybe on working on page
* [ ] Write a documentation for this api
* [ ] Think of a way to make the readme public available to maybe embed this in other websites with markdown previewer
* [ ] Rewrite certain functions to use the public GitHub API
* [ ] Bring this thing up and going


## API Docs
*   https://api.github.com/users/Jodu555/repos
*   https://api.github.com/users/Jodu555
*   https://api.github.com/users/Jodu555/events
*   https://api.github.com/repos/Jodu555/ez-uploader.de/languages


## Thoughts
*         /api/:username/projects
*         /api/:username/lastCommit
*         /api/:username/languageDevision
*         /api/:username/dayCommits
*         /api/:username/avarageCommits
