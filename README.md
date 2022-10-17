# Trizag

👀 Displays random list of 3D boxes and allows users to use the mouse to separate objects into groups and then manipulate parameters from groups separately through the interface. Built with React-three-fiber as proof of concept.

#### 🚀 Deployed [here](https://russ0133.github.io/trizag/) on GitHub Pages.

## API Reference
#### -> generateRandomCubes(max: number)
Generates 'max' random cubes into the canvas on startup.

#### -> saveToList()
Pushes the selected cubes into React state.

#### -> deleteFromList(targetid: number)
Destroys the list with targetid.

#### -> displaySelectedObjects()
Returns JSX for saving the selected cubes into a list.

## Run Locally

Clone the project

```bash
  git clone https://github.com/russ0133/trizag.git
```

Go to the project directory

```bash
  cd trizag
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Tech Stack

**Client:** React, TailwindCSS, ThreeJS, @react-three/fiber, @react-three/drei


## Authors

- [@russ0133](https://www.github.com/russ0133)

