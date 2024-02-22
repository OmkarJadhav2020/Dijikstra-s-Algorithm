const gridContainer = document.getElementById("mapGrid");

//defining rows and columns in grid
const rows = 20;
const cols = 20;
gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

//creating grid
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.dataset.row = i;
    gridItem.dataset.col = j;
    gridItem.dataset.avail = 1;
    gridItem.dataset.val = i * cols + j + 1;
    gridContainer.appendChild(gridItem);
  }
}
function refresh() {
  adjacencyMatrix = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const index = i * cols + j + 1;
      const gridItem = document.querySelector(`[data-val="${index}"]`);
      if (gridItem.classList.contains("green")) {
        gridItem.style.backgroundColor = "white";
        gridItem.dataset.avail = "1";
        gridItem.classList.remove("green");
      }
    }
  }
}

//Adding functionaly to select and deselect particular grid element
gridContainer.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("grid-item")) {
    const computedStyle = window.getComputedStyle(target);
    const currentColor = computedStyle.backgroundColor;
    const isWhite =
      currentColor === "rgb(255, 255, 255)" || currentColor === "white";
    target.style.backgroundColor = isWhite ? "#2563eb" : "white";
    target.dataset.avail = target.dataset.avail === "1" ? "0" : "1";
  }
});
gridContainer.addEventListener("mouseover", (event) => {
  const target = event.target;
  if (target.classList.contains("grid-item")) {
    target.style.backgroundColor = "#2563eb";
    target.dataset.avail = '0';
  }
});


//button to create matrix
const button = document.getElementById("findIT");
let adjacencyMatrix = [];

//function for adding edge
function addEdge(source, target) {
  if (!adjacencyMatrix[source]) {
    adjacencyMatrix[source] = [];
  }
  adjacencyMatrix[source].push(target);
}

//Creating Adjacencny Matrix
button.addEventListener("click", (event) => {
  adjacencyMatrix = new Array();
  // Loop through each grid cell
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const gridItem = document.querySelector(
        `[data-row="${i}"][data-col="${j}"]`
      );
      const index = i * cols + j + 1; // Calculate the index of the current cell

      // Check if the cell is available
      if (gridItem.dataset.avail === "1") {
        // Check adjacent cells (down and right)
        const downIndex = (i + 1) * cols + j + 1;
        const rightIndex = i * cols + (j + 2);

        // Check if adjacent cells are available before adding edges
        if (i < rows - 1) {
          const gridItemDown = document.querySelector(
            `[data-val="${downIndex}"]`
          );
          if (gridItemDown.dataset.avail === "1") {
            addEdge(index, downIndex);
            addEdge(downIndex, index);
          }
        }

        if (j < cols - 1) {
          const gridItemRight = document.querySelector(
            `[data-val="${rightIndex}"]`
          );
          if (gridItemRight.dataset.avail === "1") {
            addEdge(index, rightIndex);
            addEdge(rightIndex, index);
          }
        }
      }
    }
  }
  console.log(adjacencyMatrix);
  Dijikstra();
});

//Create INF ARRAY;
const INF = Number.MAX_SAFE_INTEGER;
let dist = new Array(rows * cols + 1).fill(INF);
class PriorityQueue {
  constructor(comparator = (a, b) => a - b) {
    this.array = [];
    this.comparator = comparator;
  }

  push(element) {
    this.array.push(element);
    this.array.sort(this.comparator);
  }

  pop() {
    return this.array.shift();
  }

  peek() {
    return this.array[0];
  }

  size() {
    return this.array.length;
  }

  isEmpty() {
    return this.array.length === 0;
  }
}

function priorityComparator(a, b) {
  return a[0] - b[0];
}

function Dijikstra() {
  let pq = new PriorityQueue(priorityComparator);
  dist = new Array(cols * rows + 1).fill(INF);
  let s = 1;
  dist[s] = 0;
  pq.push([0, s]);
  let cnt = 1;
  let parent = new Array(rows * cols + 1).fill(-1);
  let arr1 = [];
  while (!pq.isEmpty()) {
    let dis = pq.peek()[0];
    let node = pq.peek()[1];
    pq.pop();
    arr1.push(node);
    for (let i of adjacencyMatrix[node]) {
      let edgeWeight = 1;
      let adjNode = i;
      if (dis + edgeWeight < dist[adjNode]) {
        dist[adjNode] = dis + edgeWeight;
        pq.push([dist[adjNode], adjNode]);
        parent[adjNode] = node;
      }
    }
  }


  let start = 1;
  let end = 400;
  let path = [];
  for (let at = end; at != -1; at = parent[at]) {
    path.push(at);
    if (at === start) break;
  }
  console.log(parent);
  console.log(path);
  path.reverse();

  let d = 25;
  for (let i = 0; i < (arr1.length + path.length); i++) {
    if (i < arr1.length) {
      setTimeout(() => {
        const gridItem = document.querySelector(`[data-val="${arr1[i]}"]`);
        gridItem.style.backgroundColor = "#fcd34d";
      }, i * d);
    }
    else {
      setTimeout(() => {
        const gridItem = document.querySelector(`[data-val="${path[i - arr1.length]}"]`);
        gridItem.style.backgroundColor = "green";
        gridItem.classList.add("green");
      }, i * d);
    }
  }

  // let delay = 100; // Adjust the delay here (in milliseconds)
  // for (let i = 0; i < path.length; i++) {
  //   setTimeout(() => {
  //     const gridItem = document.querySelector(`[data-val="${path[i]}"]`);
  //     gridItem.style.backgroundColor = "green";
  //     gridItem.classList.add("green");
  //   }, i * d);
  // }
}

document.getElementById("ref").addEventListener("click", refresh);


// BFS

function Dijikstra2() {
  let pq = new PriorityQueue(priorityComparator);
  dist = new Array(cols * rows + 1).fill(INF);
  let visited = new Array(cols*rows + 1).fill(0);
  let s = 1;
  dist[s] = 0;
  pq.push([0, s]);
  let cnt = 1;
  let parent = new Array(rows * cols + 1).fill(INF);
  let arr1 = [];
  while (!pq.isEmpty()) {
    let dis = pq.peek()[0];
    let node = pq.peek()[1];
    pq.pop();
    if(visited[node] === 1)
    {
      continue;
    };
    visited[node] = 1;
    arr1.push(node);
    for (let i of adjacencyMatrix[node]) {
      let edgeWeight = 1;
      let adjNode = i;
      dist[adjNode] = dis + edgeWeight;
      pq.push([dist[adjNode], adjNode]);
      if(node < parent[adjNode])
      {
        parent[adjNode] = node;
      }
    }
    console.log(parent);
  }
  parent[1] = -1;
  console.log(arr1);
  let start = 1;
  let end = 100;
  let path = [];
  console.log(parent);
  for (let at = end; at != -1 && at!= INF; at = parent[at]) {
    console.log(at);
    path.push(at);
    // if (at === start) break;
  }
  console.log(path);
  path.reverse();

  let d = 25;
  for (let i = 0; i < (arr1.length + path.length); i++) {
    if (i < arr1.length) {
      setTimeout(() => {
        const gridItem = document.querySelector(`[data-val="${arr1[i]}"]`);
        gridItem.style.backgroundColor = "#fcd34d";
      }, i * d);
    }
    else {
      setTimeout(() => {
        const gridItem = document.querySelector(`[data-val="${path[i - arr1.length]}"]`);
        gridItem.style.backgroundColor = "green";
        gridItem.classList.add("green");
      }, i * d);
    }
  }
}
