# WARNING

- Do not run `npm run clean`, as it will return back to the boilerplate template

# How to install modules:

```bash
npm install
```

# How to run:

1. ```bash
   npm run build:dll
   ```

2. ```bash
   npm run start:dev
   ```

3. Open http://localhost:3000

4. For deploying 

   ```bash
   npm run build
   gcloud config set project ngelabs
   gcloud app deploy
   ```

# Google Cloud

1. Check google app versions

   ```bash
   gcloud app versions list
   ```

2. Delete a google app version

   ```bash
   gcloud app versions delete [version]
   ```

# TODOs:

- Change list projects and list articles to list menu and provide search field
- Add follow button to the personal account to be able to post an article
- Add limit paginate when querying database
- Add a more secure article update and delete in the firebase database rules
- Add delete product

# Updated:

- Added basic search products
- Use immutable variable of newProduct in myproduct
- Use username for storage folder name of products
- All usertypes can add an article
- Changed Nge-Labs logo
- Changed 3 words mantra
- Changed user type to Lab, Industry, Student, and Personal
- Added projects menu, labs can add, delete, and modify a project
- Tested using Ubuntu 20.04 as a windows subsystem, the code must be saved inside the WSL directory that is /home/{user} in which using Linux filesystem

# Troubleshooting

- If error of TenserPlugin Out of Memory during `npm run build`. Run this code in the terminal:

   ```bash
   export "NODE_OPTIONS=--max_old_space_size=2000"
   ```

   WSL2 Ubuntu 20.04 memory needs to be increased to 5GB. Follow this [tutorial](https://itnext.io/wsl2-tips-limit-cpu-memory-when-using-docker-c022535faf6f).
