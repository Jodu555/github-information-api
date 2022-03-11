# github-information-api

An API to get every users last commit date and projects info and dayli commits e.g.

# Website Preview

======
![This is the current Website!](https://images.jodu555.de/37ea532654e9243383fab095cfa9c1e3.png 'This is the current Website!')

## Todo

- [x] Figure out a way to get this data
- [x] implement it in a rest api
- [x] bring from hakcy dacky way to nice looking
- [x] add caching
- [ ] Add function to get the commits for specific day
- [x] Add function to get the commits for a year grouped in days
- [x] Add function to calc the avg commits per day
- [x] Add function to get the latest commit for an exact project | To display maybe on working on page
- [x] Write a documentation for this api
- [ ] Think of a way to make the readme public available to maybe embed this in other websites with markdown previewer
- [ ] Rewrite certain functions to use the public GitHub API
- [x] Show an dynamic unit for the latest api call / Format the time nicely
- [x] Bring this thing up and going
- [ ] Maybe add to the website a counter which runs up to seen when the latest request came

## API Docs

- https://api.github.com/users/Jodu555/repos
- https://api.github.com/users/Jodu555
- https://api.github.com/users/Jodu555/events
- https://api.github.com/repos/Jodu555/ez-uploader.de/languages

## Thoughts

-         /api/:username/projects
-         /api/:username/lastCommit
-         /api/:username/languageDevision
-         /api/:username/dayCommits
-         /api/:username/avarageCommits
