# Kanban Sample

Sample NextJS app that offers a kanban board and saves data locally.


## How to run

Simply running `npm install` and then `npm run dev` (NodeJS v16+) should be enough to get the app running. It will be available at `localhost:3000`.

## About the Project

This is a standard NextJS app with TypeScript. I've chosen it because it provides a quick way to setup an application with great defaults. I've used SASS for styling, more as a way of displaying my familiarity with it, but for a project of this size I don't think it'd be necessary. Open Props is used to provide a standardized visual style.

For fetching data, I've used [SWR](https://swr.vercel.app/) because, being Hooks-based, it plays nice with React, as well as providing caching and revalidation out of the box.

## Project Structure

Components are organized following the [Atomic Design](https://www.blueacornici.com/blog/5-major-elements-of-atomic-design/) principles, and are split into Atoms, Molecules, Organisms and Templates. Each component only holds code that is specific to it, and data fetching/handling is reserved for the Template level.

Styles are organized in a similar way, with the exception of the `app.scss` file, which contains/imports global styles and variables.

Data-related files are organized in the `includes` folder, with types and data-fetching hooks separated by data type (in this case, just Characters).
