"use client";

import {FormEvent, useEffect, useState} from "react";
import {getBase64} from "../lib/libs";
import Transition from "../components/Transition";
import API_KEY from "@/apiKey";

export default function Page() {
  const categories = [
    "Notebooks & Journals",
    "Pens & Pencils",
    "Art Supplies",
    "Office Supplies",
    "Paper Products",
    "Planners & Organizers",
    "Desk Accessories",
    "Markers & Highlighters",
    "Adhesives & Tapes",
    "Craft Supplies",
    "Other",
  ];

  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleImageChange = ({
    currentTarget: {files},
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (files && files.length) {
      setSelectedFile([]);
      setSelectedFile((existing) => existing.concat(Array.from(files))); // *** Only change is here
    }
    // ...
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let base64Img = await getBase64(selectedFile[0]);

    if (typeof base64Img === "string") {
      base64Img = base64Img.replace(/^data:.+base64,/, "");
    }

    const result = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${API_KEY}`,
      },
      body: JSON.stringify({image: base64Img, formData: formData}),
    });

    const response = await result.json();

    console.log(response);
  };

  return (
    <Transition>
      <form
        onSubmit={(e) => handleSubmit(e)}
        encType="multipart/form-data"
        className="flex flex-col"
      >
        <input
          onChange={handleImageChange}
          type="file"
          accept="image/png, image/jpg, image/jpeg"
        />
        <input
          type="text"
          placeholder="Product Name"
          onChange={(e) =>
            setFormData({...formData, productName: e.target.value})
          }
        />
        <input
          type="text"
          placeholder="Description"
          onChange={(e) =>
            setFormData({...formData, description: e.target.value})
          }
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) =>
            setFormData({...formData, price: parseInt(e.target.value)})
          }
        />
        <input
          type="number"
          placeholder="Stock"
          onChange={(e) =>
            setFormData({...formData, stock: parseInt(e.target.value)})
          }
        />
        <select
          name="category"
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        >
          {categories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button type="submit">Submit File</button>
      </form>
    </Transition>
  );
}
