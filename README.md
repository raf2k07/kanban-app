# A Simple Kanban App

A basic kanban board built with React using `dnd-kit` and `redux-toolkit`.

## Fixes

There are minor fixes that have been made past the deadline because I was simply annoyed with them. In order to view the submission in its original state please check out the 'submission' branch.

## Setup

The project has been set up with yarn so a simple

```
yarn install
```

followed by a

```
yarn dev
```

should suffice to run the project.

This project has been built with Vite. If you wish to build the project and run it in production mode, after a `yarn install`, simply run

```
yarn build
```

and subsequently

```
yarn preview
```

## ✅ Completed Features

### Core Features

- Dynamic Columns
- CRUD Columns
- CRUD Tasks/Items
- Sortable Tasks/Items
- Task Details Modal
- CRUD Comments
- Data Persistency (w/ `redux-persist`)

### Optional Features

- Responsive Design (save for a minor pitfall)
- Keyboard Navigation to move tasks (Press `Tab` till the desired card is selected, hit `Enter` or `Space` to begin dragging and navigate to the desired spot with arrow keys)

## ❌ Features Missed

- Threaded Comment System

## 🐛 Known Issues

- Users can do everything outside of moving cards on mobile - A custom implementation of the `MouseSensor` class for `dnd-kit` had to be used, which meant that the touch-supported built-in class could not be used.
- There is a strange issue with the built-in collision detection on `dnd-kit` wherein high resolution screens mess with it. If you are unable to move cards to empty containers, consider resizing the browser window (this really isn't ideal but I ran out of time before I could write a custom implementation of the collision detection) (FIXED)
- Adding a card to the end of a populated container _sometimes_ gets placed in the second last slot (FIXED)
