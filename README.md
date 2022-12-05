<img src="https://venice.brooklynrail.org/assets/img/brooklyn-rail-logo-2019-outline-red.svg" alt="Brooklyn Logo"/>



[![Netlify Status](https://api.netlify.com/api/v1/badges/db6c835f-87e3-47c4-8f4d-53b4af3c6be8/deploy-status)](https://app.netlify.com/sites/brooklynrail/deploys)

---


## Platform Overview

[**The Brooklyn Rail**](https://brooklynrail.org) is made up a few separate platforms seamed that are loosely seamed together.

- **brooklynrail.org** – The main Rail site is largely an old Code Ignighter application. It's database contains all of the issues, articles, and images from the last 20 years of this publication. As an applicaiton, it is in rough shape and we're in the process of moving off of it to a new, more sustainable platform. [**Repo**](https://github.com/brooklynrail/brooklynrail)
- **brooklynrail.org/events** – The events site is a new platform for the Rail and is being explored as the future foundation for the whole Brooklyn Rail archive. The platform is built on HUGO and running on Netlify. [**Repo**](https://github.com/brooklynrail/brooklynrail-platform)


## Development

Here's how to get set up:

1. Install HUGO `brew install hugo` ([For OSX](https://gohugo.io/getting-started/installing/#install-hugo-with-brew)) _or see https://gohugo.io/getting-started/installing/ for other OSs_
  - Note: brooklynrail.org currently uses Hugo version `0.69.0`, and is configured in the [netlify.toml](netlify.toml) file.
1. Clone the [repo](https://github.com/brooklynrail/brooklynrail-platform)
1. Install NPM and the dependencies -- `npm install`
1. Install the Netlify CLI -- `npm install netlify-cli -g`
1. Run `npm start` to get the site running


**NPM will run the following scripts:**

- `hugo serve` — builds all of the pages in hugo and creates a local server at `http://localhost:1313/`. Hugo will also build and compresses all of the SCSS and JS files.

When Hugo is done building, you should see a success message like:

```
Web Server is available at //localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

You can view your local site in the browser at `http://localhost:1313/`.

### Tips

- Quickly check your HUGO version in your terminal by running `hugo version` in the command line.
- If HUGO has released a new version, but brooklynrail.org hasn't upgraded to that version, you may get errors when building locally. It’s possible to use Homebrew to download a previous version of Hugo. To do that follow these instructions: [Using Legecy Versions of the Hugo Static Site Generator](https://www.fernandomc.com/posts/brew-install-legacy-hugo-site-generator/)


### Testing Netlify Functions locally
1. install the Netlify CLI
2. run `netlify dev`


### Netlify CLI

[Netlify's command line interface](https://docs.netlify.com/cli/get-started/#installation) (CLI) lets you deploy sites or configure continuous deployment straight from the command line.

To install Netlify CLI, make sure you have Node.js version 8 or higher, then run this command from any directory in your terminal:

```
npm install netlify-cli -g
```

[Learn more »](https://docs.netlify.com/cli/get-started/#installation)

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
