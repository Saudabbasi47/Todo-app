"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<string>(""); // Current input value
  const [items, setItems] = useState<{ text: string; completed: boolean }[]>(
    []
  ); // List of todos with completion status
  const [isEditing, setIsEditing] = useState<number | null>(null); // Track editing index
  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted on the client side

  // This function will run after the component has mounted on the client side
  useEffect(() => {
    setIsMounted(true); // Set to true once the component is mounted
    const list = localStorage.getItem("List");
    if (list) {
      setItems(JSON.parse(list)); // Get items from localStorage
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render

  // Add a new todo or update an existing one
  const addItem = () => {
    if (!data.trim()) {
      alert("Please input data");
    } else {
      if (isEditing !== null) {
        const updatedItems = [...items];
        updatedItems[isEditing].text = capitalizeFirstLetter(data);
        setItems(updatedItems);
        setIsEditing(null); // Reset editing state
      } else {
        setItems([
          ...items,
          { text: capitalizeFirstLetter(data), completed: false },
        ]);
      }
      setData(""); // Clear input
    }
  };

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("List", JSON.stringify(items)); // Save items to localStorage
    }
  }, [items, isMounted]); // Run this effect whenever 'items' changes

  // Delete an item from the list
  const deleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Edit an item in the list
  const editItems = (index: number) => {
    setData(items[index].text);
    setIsEditing(index);
  };

  // Capitalize the first letter of the string
  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Handle key press event for "Enter"
  const handlekey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  // Toggle the completion status of a todo
  const toggleCompletion = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;
    setItems(updatedItems);
  };

  // Only render content after the component is mounted
  if (!isMounted) {
    return null; // Optionally, you can return a loading spinner or similar here
  }

  return (
    <>
      <h1 className="text-[70px] font-bold mt-6 select-none">TODO APP</h1>
      <main className="flex flex-col justify-center items-center gap-3 ">
        <h1 className="text-[90px] select-none">📄</h1>
        <div className="flex flex-col justify-center items-center gap-2 mt-2">
          <p className="text-[17px] font-extrabold">Add Your List Here ✌</p>
          <span className="flex items-center justify-center">
            <input
              type="text"
              name="input"
              value={data}
              onKeyDown={handlekey}
              onChange={(e) => setData(capitalizeFirstLetter(e.target.value))}
              placeholder="Enter Your Todo ✍"
              className="placeholder:text-gray-500 mr-1 text-black p-2 border-[2px] rounded-lg border-black bg-white w-[300px] ml-6 md:w-[500px]"
            />
            <button
              onClick={addItem}
              className="p-2 rounded-md px-4 bg-white text-black font-bold"
            >
              {isEditing === null ? "Add" : "Update"}
            </button>
          </span>
        </div>
        <section className="flex mt-6 flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center duration-300 justify-between md:w-[400px] w-[340px] ml-7 text-left p-2 rounded-md hover:text-[#aa4cf7] hover:bg-white bg-[#aa4cf7]"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleCompletion(index)}
                />
                <p
                  className={`${
                    item.completed ? "line-through text-gray-10" : ""
                  }`}
                >
                  {item.text}
                </p>
              </div>
              <span className="flex gap-5 text-[20px]">
                <button onClick={() => editItems(index)}>✍</button>
                <button onClick={() => deleteItem(index)}>❌</button>
              </span>
            </div>
          ))}
        </section>
        <div>
          <button
            className="p-2 border-1 bg-white text-black rounded-md font-mono"
            onClick={() => setItems([])}
          >
            Clear All
          </button>
        </div>
      </main>
    </>
  );
}
