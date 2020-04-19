<img src="https://venice.brooklynrail.org/assets/img/brooklyn-rail-logo-2019-outline-red.svg" alt="Brooklyn Logo"/>

---

# The Brooklyn Rail
https://brooklynrail.org

[![Netlify Status](https://api.netlify.com/api/v1/badges/db6c835f-87e3-47c4-8f4d-53b4af3c6be8/deploy-status)](https://app.netlify.com/sites/brooklynrail/deploys)

---

## Install

This is a new version of https://brooklynrail.org that runs on [Hugo](https://gohugo.io/) and is hosted on Netlify.

**Preview URL:** https://brooklynrail.netlify.app/


### Install Hugo 0.66.0

[Read the HUGO quickstart guide »](https://gohugo.io/getting-started/quick-start/)

**[For OSX](https://gohugo.io/getting-started/installing/#install-hugo-with-brew):**
`brew install hugo`
_see https://gohugo.io/getting-started/installing/ for other OSs_

Quickly check your Hugo version at your terminal command line by running:
```
hugo version
```

**Note:** brooklynrail.org currently uses Hugo version `0.69.0`, and is configured in the [netlify.toml](netlify.toml) file.

If Hugo has released a new version, but brooklynrail.org hasn't upgraded to that version, you may get errors when building locally. It’s possible to use Homebrew to download a previous version of Hugo. To do that follow these instructions: [Using Legecy Versions of the Hugo Static Site Generator](https://www.fernandomc.com/posts/brew-install-legacy-hugo-site-generator/)


#### Setup

Once the prerequisites are installed, [clone the repository](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) to your local machine. Then navigate to the project folder in your terminal and run:

```
npm install
```

This will install all of the Node dependencies needed to run your Hugo environment. This may take a little while!

#### Local Development

Running the local development server is as simple as running:

```
npm start
```

**NPM will run the following scripts:**

- `gulp build && gulp watch` — builds and compresses all of the SCSS and JS files, and copies jquery and uswds js from `node_modules` and puts them in the `/dist/` folder.
- `hugo serve` — builds all of the pages in hugo and creates a local server at `http://localhost:1313/`


When Hugo is done building, you should see a success message like:
```
Web Server is available at //localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

You can view your local site in the browser at `http://localhost:1313/`.

Local development is powered by BrowserSync, to allow rapid development through:

- A local development server at `http://localhost:1313/`.
- Automatic CSS & JS updates without reloading the page
- Automatic page reloads when content is changed


---

## Importing content

The repository already contains a subset of the articles under `content/`, but if you want modify [the import script](import.js) to bring in more data:

1. Install Node.js.
1. Start the database from [the main site](https://github.com/brooklynrail/brooklynrail) directory.

   ```sh
   docker-compose up db
   ```

1. From this directory, run the import.

   ```sh
   npm install
   node import.js
   ```

You should see directories and files written under `content/`.
