import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './App.css';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function App() {
    const [code, setCode] = useState('');
    const [logs, setLogs] = useState([]);
    const [arrayData, setArrayData] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const runCodeRef = useRef();

    const addLog = (message) => {
        setLogs((prevLogs) => [...prevLogs, message]);
    };

    const initializeArray = () => {
        setLogs([]);
        setHighlightedIndex(null);
        const arrayMatch = code.match(/const\s+(\w+)\s*=\s*\[(.*?)\]/);
        if (arrayMatch) {
            const arrayValues = JSON.parse(`[${arrayMatch[2]}]`);
            setArrayData(arrayValues);
            addLog(`Initialized array: ${JSON.stringify(arrayValues)}`);
        } else {
            addLog("No array found in the code for visualization.");
        }
    };

    const highlightElement = async (index) => {
        setHighlightedIndex(index);
        addLog(`Highlighting element at index ${index}: ${arrayData[index]}`);
        await delay(500);
    };

    const updateArrayData = async (newArray) => {
        setArrayData([...newArray]);
        await delay(500);
    };

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

    const loadExampleBubbleSort = () => {
        const exampleCode = `// Bubble Sort example
const list = [9, 7, 5, 3, 1, 8, 6, 4, 2, 0];
async function bubbleSort() {
    for (let i = 0; i < list.length - 1; i++) {
        for (let j = 0; j < list.length - i - 1; j++) {
            await highlightElement(j);
            await highlightElement(j + 1);
            if (list[j] > list[j + 1]) {
                const temp = list[j];
                list[j] = list[j + 1];
                list[j + 1] = temp;
                await updateArrayData(list);
            }
        }
    }
}
await bubbleSort();`;
        setCode(exampleCode);
        initializeArray();
    };

    const instrumentCodeForVisualization = (userCode) => {
        return userCode.replace(
            /for\s*\(\s*let\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*(\w+)\.length\s*;\s*\1\+\+\s*\)\s*\{([\s\S]*?)\}/g,
            (match, iterator, array, body) => {
                const instrumentedBody = `
                    await highlightElement(${iterator});
                    await delay(500);
                    ${body}
                    await updateArrayData(${array});
                `;
                return `for (let ${iterator} = 0; ${iterator} < ${array}.length; ${iterator}++) {${instrumentedBody}}`;
            }
        );
    };

    const executeCode = async () => {
        setLogs([]);
        setHighlightedIndex(null);
        initializeArray();
        let dynamicArray = proxyArray([...arrayData]);
        const instrumentedCode = instrumentCodeForVisualization(code);
        const wrappedCode = `
            (async function() {
                let arrayData = dynamicArray;
                ${instrumentedCode}
            })();
        `;
        try {
            await new Function(
                'dynamicArray', 
                'highlightElement', 
                'updateArrayData', 
                'log', 
                'delay',
                wrappedCode
            )(dynamicArray, highlightElement, updateArrayData, addLog, delay);
            addLog("Code executed successfully");
        } catch (error) {
            addLog(`Error: ${error.message}`);
        }
    };

    return (
        <div className="App">
            <div className="editor-section" style={{ width: '60%' }}>
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    defaultValue="// Write your algorithm here"
                    value={code}
                    onChange={(newCode) => setCode(newCode)}
                />
                <button onClick={executeCode} ref={runCodeRef}>Run Code</button>
                <button onClick={loadExampleBubbleSort}>Load Bubble Sort</button>
                <button onClick={initializeArray}>Initialize Array</button>
            </div>
            <div className="visualization-section">
                <div className="array-visualization">
                    <h3>Array</h3>
                    <div className="array-elements">
                        {arrayData.map((value, index) => (
                            <div
                                key={index}
                                className={`array-element ${index === highlightedIndex ? 'highlighted' : ''}`}
                            >
                                {value}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="logs">
                    <h3>Logs</h3>
                    <div className="log-entries">
                        {logs.map((log, index) => (
                            <div key={index} className="log-entry">{log}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
