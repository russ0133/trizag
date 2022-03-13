import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Select,
  useSelect,
  Sky,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import "./App.css";
import uniqid from "uniqid";

const OnSelect = ({ setCurrentSelected, setGlobalSelected }) => {
  const selected = useSelect();
  if (selected.length == 0 || selected.length == 1) {
    setGlobalSelected(null);
    setCurrentSelected(null);
    return null;
  }
  setGlobalSelected(selected);
  console.log(selected);
  selected.forEach((item) => {
    item.material.color.b = 15;
  });
  return null;
};

export default function App() {
  const [currentSelected, setCurrentSelected] = useState(null);
  const [selectedLists, setSelectedLists] = useState([]);
  const [color, setColor] = useState("black");
  const [componentList, setComponentList] = useState([]);
  const [globalSelected, setGlobalSelected] = useState([]);

  const btnStyling =
    "bg-slate-500 px-2 mx-1 text-xs rounded-full text-neutral-200 shadow-sm";

  useEffect(() => {
    generateRandomCubes(24);
    console.log("Mounted");
  }, []);

  const Cube = ({ x, y, z, color, ...props }) => {
    return (
      <mesh position={[x, y, z]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  };

  const generateRandomCubes = (max) => {
    for (let i = 0; i < max; i++) {
      let x = getRandomArbitrary(-5, 5);
      let y = getRandomArbitrary(-5, 5);
      let z = getRandomArbitrary(-5, 5);
      let cubeComponent = (
        <Cube key={uniqid()} x={x} y={y} z={z} color={color} />
      );
      componentList.push(cubeComponent);
    }
  };

  const saveToList = () => {
    setSelectedLists([...selectedLists, globalSelected]);
  };

  const displaySelectedObjects = () => {
    if (currentSelected == null)
      return (
        <div className="mt-1">
          Select a list of objects by holding <strong>(shift+lclick)</strong> to
          start creating lists.
        </div>
      );

    return (
      <div className="mt-1">
        <div className="mr-1 inline">
          You have selected <strong>{currentSelected.length} objects</strong>.
          Do you want to save them in a list for later editing?
        </div>
        <button
          className={btnStyling}
          onClick={() => {
            saveToList();
          }}
        >
          SAVE
        </button>
      </div>
    );
  };
  const changeScale = (type, list) => {
    switch (type) {
      case "x":
        let x = window.prompt("Insert a scale for X");
        list.forEach((item) => (item.scale.x = x));
        break;
      case "y":
        let y = window.prompt("Insert a scale for Y");
        list.forEach((item) => (item.scale.y = y));
        break;
      case "z":
        let z = window.prompt("Insert a scale for Z");
        list.forEach((item) => (item.scale.z = z));
        break;
    }
  };
  const toggleVisible = (list) => {
    list.forEach((item) => (item.visible = !item.visible));
  };
  const toggleHighlighted = (toggle, list) => {
    if (toggle == "on") list.forEach((item) => (item.material.color.r = 15));
    else list.forEach((item) => (item.material.color.r = 0));
  };
  const resetColors = () => {
    if (globalSelected != null) {
      globalSelected.forEach((item) => {
        item.material.color.b = 0;
      });
    }
  };
  const displaySelectedLists = () => {
    if (selectedLists.length == 0) return <div>No object lists yet.</div>;
    return selectedLists.map((item, index) => {
      return (
        <div
          className="bg-neutral-300 px-2 py-1 shadow-sm hover:bg-slate-400 rounded-md mb-1"
          key={index}
          onMouseEnter={() => toggleHighlighted("on", item)}
          onMouseLeave={() => toggleHighlighted("off", item)}
        >
          List ID {index} contains {item.length} objects.<br></br>
          <button className={btnStyling} onClick={() => changeScale("x", item)}>
            scaleX
          </button>
          <button className={btnStyling} onClick={() => changeScale("y", item)}>
            scaleY
          </button>
          <button className={btnStyling} onClick={() => changeScale("z", item)}>
            scaleZ
          </button>
          <button className={btnStyling} onClick={() => toggleVisible(item)}>
            visible
          </button>
        </div>
      );
    });
  };
  return (
    <div
      id="wrapper"
      className="flex flex-col items-center h-screen bg-neutral-200 "
    >
      <div>{displaySelectedObjects()}</div>
      <div className="lists mt-2 items-center text-center text-sm">
        <strong>Your saved object lists:</strong>
        {displaySelectedLists()}
      </div>
      <div
        id="canvas"
        onMouseDown={resetColors}
        onMouseUp={() => {
          resetColors();
          setCurrentSelected(globalSelected);
        }}
        className="flex flex-row h-5/6 w-1/2 m-2 gap-2 shadow-lg"
      >
        <Canvas
          colorManagement
          dpr={[1, 2]}
          orthographic
          camera={{ position: [-10, 10, 10], zoom: 50 }}
          className="flex-2 border-8"
        >
          <ambientLight intensity={0.1} />
          <Suspense fallback={null}>
            <Select box multiple filter={(items) => items}>
              <OnSelect
                currentSelected={currentSelected}
                setCurrentSelected={setCurrentSelected}
                globalSelected={globalSelected}
                setGlobalSelected={setGlobalSelected}
              />
              {componentList}
            </Select>
            <Environment preset="city" />
          </Suspense>
          <OrbitControls
            makeDefault
            rotateSpeed={2}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.5}
          />
          <Sky />
        </Canvas>
      </div>
    </div>
  );
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
