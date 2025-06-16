import axios from "axios";
import { useEffect, useState } from "react"

export default function useContents() {
    const [contents, setContents] = useState([]);

    function refresh() {
        axios.get("http://localhost:3000/api/v1/content", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((result) => {
            setContents(result.data);
        })
    }
    useEffect(() => {
        refresh();
        setInterval(() => {
            refresh();
        }, 10 * 1000);
    }, [])
  return contents;
}
