# Deploy Stedi Functions with the CLI

In this tutorial we will show you how to deploy code to Stedi Functions from the command line. Here’s what we’ll cover.

- Deploying your JavaScript code using the Stedi CLI.
- Calling your uploaded function using the Stedi CLI.
- Storing your Stedi API key safely.
- Including third-party libraries.
- Testing your code locally.

The example code for this tutorial will make a call to an external web API. That’s not what this tutorial is about, so we won’t explain it in depth. Still, if you want to know how to do it, you’ll at least have an example. There are some other things we won’t cover here.

- What is Stedi Functions? See the [Stedi Functions user guide](https://www.stedi.com/docs/functions).
- How to use languages other than JavaScript. If you’re interested in that, [let us know](https://www.stedi.com/contact).

## Prerequisites

Here’s what you need.

- A [Stedi account](https://www.stedi.com/auth/sign-up).
- An [API key](https://www.stedi.com/app/settings/api-keys). 

In addition, you need to have the following tools available on your machine:

- [git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/)

## Step 1: Clone this repository and navigate to the project directory

```console
git clone https://github.com/Stedi-Demos/deploy-functions-with-the-cli.git
cd deploy-functions-with-the-cli
```

The directory has the following contents.

File           | Description
---------------|------------
`index.js`     | The JavaScript code we will upload to Stedi Functions.
`test.js`      | A script that allows you to test the function locally.
`event.json`   | Data we can use to the test the function.
`package.json` | Metadata about this project as an npm package.
`readme.md`    | The instructions you’re currently reading.

## Step 2: Run the function locally

The code in `index.js` calls the Wikipedia API and retrieves an article. In order to do that, it needs the Axios library. Axios is already listed in `package.json`, so you can install it with:

```console
npm ci
```

The input to the function contains the topic you wish to retrieve from Wikipedia. `event.json` contains an example. You can test the function locally by running `test.js`, which in turn calls `handler()` in `index.js`.

```console
node test.js
```

The output should be a Wikipedia article about EDI and starts something like this:

```
Electronic data interchange (EDI) is the concept of businesses electronically communicating information that was traditionally communicated on paper, such as purchase orders and invoices. Technical standards for EDI exist to facilitate parties transacting such instruments without having to make special arrangements.
```

## Step 3: Install the Stedi CLI

```console
npm install @stedi/cli@2 --save-dev
```

If all goes well, the following command should output usage information and the Stedi CLI version.

```console
npx stedi help
```

## Step 4: Create and configure an API key

You need to specify your [API key](https://www.stedi.com/app/settings/api-keys) when calling Stedi Functions using the CLI. You do this by setting the environment variable `STEDI_API_KEY`.

```
export STEDI_API_KEY=<your API key here>
```

You can test whether you successfully set your API key by running the following command:

```console
 npx stedi functions list-functions
 ```

Assuming you haven’t created any functions yet, the response should be:

```json
{
  "items": []
}
```



## Step 5: Create a bucket for your code

Before you can deploy your code to Stedi Functions, you will need to upload it to [Stedi Buckets](https://www.stedi.com/docs/buckets). You can use any bucket in your account. We recommend you create a separate bucket for deployments.

You can create a bucket using the CLI. Keep in mind that the name needs to be globally unique.

```console
npx stedi buckets create-bucket --bucket-name <YOUR_BUCKET_NAME_HERE>
```

If you have a hard time coming up with a name that no one else has thought of before, you can add a lowercase UUID.

```console
npx stedi buckets create-bucket --bucket-name <YOUR_BUCKET_NAME_HERE>-${$(uuidgen):l}
```

Make a note of the bucket name. You’ll need it later.

## Step 6: Build, package, and deploy


```console
npx esbuild index.js --bundle --minify --platform=node --outfile=build/index.js
```

This takes the code from `index.js` and all its dependencies and writes them to a single file. This also works if your project has multiple source files; they will be bundled automatically. It will only include files `index.js` depends on, so `test.js` will not be part of it.

```console
cd build
zip package index.js
cd ..
```

The ZIP file must have `index.js` at the root. That’s why you must run `zip` from within the `build` directory.

Next, put the package in the bucket you previously created.

```console
npx stedi buckets put-object --key package.zip --body file://build/package.zip --bucket-name <YOUR_BUCKET_NAME_HERE>
```

Now we create a function with the name `wikipedia`.

```console
npx stedi functions create-function --function-name wikipedia --package "s3://<YOUR_BUCKET_NAME_HERE>/package.zip"
```

If you ever want to update the code, just upload the new code to your bucket and run the following command.

```console
npx stedi functions update-function --function-name wikipedia --package "s3://<YOUR_BUCKET_NAME_HERE>/package.zip"
```

## Step 7: Invoke the Function

```console
npx stedi functions invoke-function --function-name wikipedia --payload file://event.json
```

The contents of `events.json` is sent to the function as its `event` parameter. The result of this command should be the same as when you ran the function locally: a Wikipedia article on EDI.

## That’s all

- Want to know more about Stedi Functions? [Check out the Stedi Functions user guide.](https://www.stedi.com/docs/functions)
- Want to know more about the Stedi CLI? [Check out the Stedi CLI documentation.](https://www.npmjs.com/package/@stedi/cli)
- Want to ask a question? [Contact us.](https://www.stedi.com/contact)
