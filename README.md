# Array Visualisation

## Overview
This project is an interactive web-based array visualisation tool built with React. It allows users to input JavaScript code, execute it, and visualise how arrays are manipulated in real-time. The application highlights array elements being accessed and provides logs for better understanding of the execution process.

## Features
- **Code Editor:** Integrated with Monaco Editor for writing and executing JavaScript code.
- **Array Visualisation:** Displays changes in the array during execution with highlighted elements.
- **Execution Logs:** Provides step-by-step execution details.
- **Preloaded Example:** Includes a Bubble Sort algorithm as a demonstration.
- **Live Execution:** Highlights elements being accessed and updates array values dynamically.
- **User Interaction:** Allows users to input custom JavaScript code for visualisation.

## Installation & Setup
To set up and run the project locally:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/Array-Visualiser.git
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000/`.

## How It Works
### Main Components:
- **`App.js`**: The core component handling user input, visualisation logic, and execution.
- **`App.css`**: Styles for layout and array visualisation.
- **`index.html`**: The main entry point for rendering the application.

### JavaScript Logic:
- **Array Initialisation:** Parses and extracts array values from user input.
- **Code Instrumentation:** Modifies user code to track array access and updates.
- **Proxy Array:** Uses JavaScript Proxy to dynamically track and highlight array operations.
- **Execution Flow:** Runs user scripts asynchronously while updating UI elements.

### Key Functions
#### Array Initialisation:
```js
const initialiseArray = () => {
    setLogs([]);
    setHighlightedIndex(null);
    const arrayMatch = code.match(/const\s+(\w+)\s*=\s*\[(.*?)\]/);
    if (arrayMatch) {
        const arrayValues = JSON.parse(`[${arrayMatch[2]}]`);
        setArrayData(arrayValues);
        addLog(`Initialised array: ${JSON.stringify(arrayValues)}`);
    } else {
        addLog("No array found in the code for visualisation.");
    }
};
```

#### Proxy-Based Array Tracking:
```js
const proxyArray = (arr) => {
    return new Proxy(arr, {
        get(target, prop) {
            if (typeof prop === 'string' && !isNaN(prop)) {
                (async () => {
                    await highlightElement(Number(prop));  
                    await delay(500);
                })();
            }
            return target[prop];
        },
        set(target, prop, value) {
            target[prop] = value;
            (async () => {
                setArrayData([...target]);
                await delay(500);
            })();
            return true;
        }
    });
};
```

## Future Improvements
- **Support for Binary Trees & 2D Arrays**
- **Enhanced Sorting Algorithm Visualisations**
- **Step-by-Step Debugging Mode**
- **Additional Algorithm Examples (Quick Sort, Merge Sort, etc.)**
- **Improved UI with Graphical Representations**


## Contact
submit a pull request!

