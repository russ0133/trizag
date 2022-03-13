import React, { useState, Suspense, useEffect, useRef } from "react";
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
import { hydrate } from "react-dom";

const OnSelect = ({ setCurrentSelected, setGlobalSelected }) => {
  const selected = useSelect();
  if (selected.length == 0 || selected.length == 1) {
    setGlobalSelected(null);
    setCurrentSelected(null);
    return null;
  }
  setGlobalSelected(selected);
  selected.forEach((item) => {
    item.material.color.b = 15;
  });
  return null;
};

export default function App() {
  const [currentSelected, setCurrentSelected] = useState(null);
  const [selectedLists, setSelectedLists] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [globalSelected, setGlobalSelected] = useState(null);

  const btnStyling =
    "bg-slate-500 px-2 mx-1 text-xs rounded-full text-neutral-200 shadow-sm";

  useEffect(() => {
    const Cube = ({ x, y, z, color, ...props }) => {
      const [cls, setCls] = useState("blue");
      return (
        <mesh position={[x, y, z]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    };

    const generateRandomCubes = (max) => {
      for (let i = 0; i < max; i++) {
        let x = getRandomArbitrary(-8, 8);
        let y = getRandomArbitrary(-8, 8);
        let z = getRandomArbitrary(-8, 8);
        let cubeComponent = (
          <Cube key={uniqid()} x={x} y={y} z={z} color="black" />
        );
        /* setComponentList([...componentList, cubeoC]) */
        componentList.push(cubeComponent);
      }
    };
    generateRandomCubes(64);
    console.log("Mounted");
  }, []);

  const saveToList = () => {
    let insert = { id: uniqid(), content: globalSelected };
    setSelectedLists([...selectedLists, insert]);
    clearSelection();
  };
  const deleteFromList = (targetid) => {
    let found = selectedLists.find((list) => list.id === targetid);
    console.log(`Deleted list.`);
    let filtered = selectedLists.filter((param) => param !== found);
    setSelectedLists(filtered);
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
  function resetColors() {
    if (globalSelected != null) {
      globalSelected.forEach((item) => {
        item.material.color.b = 0;
      });
    }
  }
  function clearSelection() {
    if (window.getSelection) {
      console.log("selection cleared");
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      console.log("selection not cleared");
      document.selection.empty();
    }
  }
  const displaySelectedLists = () => {
    if (selectedLists.length == 0) return <div>No object lists yet.</div>;
    return selectedLists.map((item, index) => {
      return (
        <div
          className="bg-neutral-300 px-2 py-1 shadow-sm hover:bg-slate-400 rounded-md mb-1 text-sm"
          key={item.id}
          onMouseEnter={() => toggleHighlighted("on", item.content)}
          onMouseLeave={() => toggleHighlighted("off", item.content)}
        >
          List {index}: contains {item.content.length} objects.<br></br>
          <button
            className={btnStyling}
            onClick={() => changeScale("x", item.content)}
          >
            scaleX
          </button>
          <button
            className={btnStyling}
            onClick={() => changeScale("y", item.content)}
          >
            scaleY
          </button>
          <button
            className={btnStyling}
            onClick={() => changeScale("z", item.content)}
          >
            scaleZ
          </button>
          <button
            className={btnStyling}
            onClick={() => toggleVisible(item.content)}
          >
            visible
          </button>
          <button
            className={btnStyling + " bg-red-500"}
            onClick={() => {
              toggleHighlighted("off", item.content);
              deleteFromList(item.id);
            }}
          >
            destroy list
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
      <div className="lists mt-2 items-center text-center">
        <strong>Your saved object lists:</strong>
        {displaySelectedLists()}
      </div>
      <div
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
          camera={{ position: [-10, 10, 10], zoom: 25 }}
          className="flex-2 border-8 h-full"
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
          <Sky
            distance={450000} // Camera distance (default=450000)
            sunPosition={[0, 2, 0]} // Sun position normal (defaults to inclination and azimuth if not set)
            inclination={1} // Sun elevation angle from 0 to 1 (default=0)
          />
        </Canvas>
      </div>
    </div>
  );
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
