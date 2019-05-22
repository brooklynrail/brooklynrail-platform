# Hugo test

To use:

1. [Install Hugo.](https://gohugo.io/getting-started/quick-start/#step-1-install-hugo)
1. Start the server.

   ```sh
   hugo server
   ```

## Importing content

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
