import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import "./App.css";
import { createCollection, db } from "./firebase";

function App() {
    const [text, setText] = useState("");
    useEffect(() => {
        getTextFromDb();
    }, []);

    const getTextFromDb = async () => {
        const collection = createCollection<{ text: string }>(db, "test");
        const document = await getDoc(doc(collection, "rWlIDX8rqB315KpVs2hW"));
        if (document.exists()) {
            setText(document.data().text);
        }
    };

    return <h1>{text}</h1>;
}

export default App;
